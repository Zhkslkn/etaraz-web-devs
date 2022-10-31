import {ApiService} from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import {FileService} from '../../../services/file.service';
import {BaseSpecialistComponent} from '../../../departments/architecture/base-specialist/base-specialist.component';
import {AuthService} from 'src/app/services/auth.service';
import {EditorService} from 'src/app/services/editor.service';
import {ApplicationService} from 'src/app/services/application.service';
import {FilesUploadComponent} from '../../../components/files-upload/files-upload.component';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ProblemService} from 'src/app/services/problem.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {dic} from '../../../shared/models/dictionary.model';
import {app} from '../../../shared/models/application.model';
import {auth} from '../../../shared/models/auth.model';
import {DatePipe} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

export interface IApplicant {
  industry: string;
  workExperience: any;
  workExperiencePoint: number;
  workExperienceProof: any;
  initialFee: any;
  initialFeePoint: number;
  initialFeeDoc: any;
  amountOfChildren: any;
  amountOfChildrenPoint: number;
  amountOfChildrenDoc: any;
  marriage: any;
  marriagePoint: number;
  marriageDoc: any;
  total: number;
}

export interface IApplicantDocFiles {
  contentType: string;
  fileCategory: string;
  id: number;
  name: string;
  objectId: string;
  size: number;
  uploadDate: any;
}
@Component({
  selector: 'app-aulie-ata',
  templateUrl: './aulie-ata.component.html',
  styleUrls: ['./aulie-ata.component.scss'],
})
export class AulieAtaComponent
  extends BaseSpecialistComponent
  implements OnInit, OnDestroy {
  @ViewChild('refMarriageDoc', { static: false }) refMarriageDoc: ElementRef;
  app: app.App = new app.App();
  currentUser = (auth.User = null);
  task: any;
  templateData: dic.TemplateEditor = new dic.TemplateEditor();
  public taskId: any;
  public sectionId: any;
  templates: any = [];
  fileList: any = [];
  doc = {
    contentType: '',
    fileCategory: '',
    id: '',
    name: '',
    objectId: '',
    size: '',
    uploadDate: null,
  };
  applicant: IApplicant = {
    industry: '',
    workExperience: '',
    workExperiencePoint: 0,
    workExperienceProof: this.doc,
    initialFee: '',
    initialFeePoint: 0,
    initialFeeDoc: this.doc,
    amountOfChildren: '',
    amountOfChildrenPoint: 0,
    amountOfChildrenDoc: this.doc,
    marriage: '',
    marriagePoint: 0,
    marriageDoc: this.doc,
    total: 0,
  };
  marriageDocName: '';
  destroyed$ = new Subject();
  filesGetter$ = new Subject();
  dataTaskDecide: dic.Decide = new dic.Decide();
  subscription: Subscription;
  taskDecideSubscription: Subscription;
  editorSubscription: Subscription;
  birthday: { birth: string };
  birthday2: string;
  @ViewChild(FilesUploadComponent, { static: false })
  public fileComponent: FilesUploadComponent;
  public applicantForm?: FormGroup;
  public stepProgress$?: Observable<boolean | null>;
  private readonly stepProgressSub$: BehaviorSubject<boolean | null>;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public editorSvc: EditorService,
    public authService: AuthService,
    public translate: TranslateService,
    public fileSvc: FileService,
    private api: ApiService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    super(
      route,
      taskService,
      appSvc,
      authService,
      translate,
      editorSvc,
      fileSvc
    );
    this.stepProgressSub$ = new BehaviorSubject<boolean | null>(null);
    this.stepProgress$ = this.stepProgressSub$.asObservable();
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params) => {
        this.taskId = params.id;
        this.sectionId = params.sectionId;
        this.getCurrentUser();
        this.getTasks();
      });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.stepProgressSub$.complete();
  }

  public getCurrentUser() {
    this.currentUser = this.authService.getUser();
  }

  public getTasks() {
    this.getTaskById();
  }

  navigateBack() {
    if (+this.sectionId === 9) {
      this.router.navigate(['arch/currentTasks'], {
        queryParams: { id: 9, name: 'MyDesignated' },
      });
    }
    if (+this.sectionId === 3) {
      this.router.navigate(['arch/finishedTasks'], {
        queryParams: { id: 3, name: 'MyExecuted' },
      });
    }
  }

  getTaskById() {
    if (+this.sectionId === 9) {
      this.taskService
        .getTaskById(this.taskId)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => {
          if (res) {
            if (res) {
              this.task = res;
              if (this.task.content) {
                this.setTaskData();
                this.taskService.sendTaskSubject(this.task);
              }
              this.getApplication(this.task.content.appId);
            }
          }
          this.fillTableInfo(this.task);
          this.setApplicantForm(false);
          this.getBirthday(this.task.content.iin);
        });
    }
    if (+this.sectionId === 3) {
      this.api.get2(`userapp/${this.taskId}`).subscribe((res) => {
        if (res) {
          this.task = res;
          this.task.content = {
            appId: res.id,
            firstName: res.firstName,
            lastName: res.lastName,
            secondName: res.secondName,
            industry: res.aulieAtaInfo.industry,
            workExperience: res.aulieAtaInfo.workExperience,
            marriage: res.aulieAtaInfo.marriage,
            amountOfChildren: res.aulieAtaInfo.amountOfChildren,
            initialFee: res.aulieAtaInfo.initialFee,
            iin: res.iin,
            sumOfPoint: res.aulieAtaInfo.sumOfPoint,
            amountOfChildrenPoint: res.aulieAtaInfo.amountOfChildrenPoint,
            marriagePoint: res.aulieAtaInfo.marriagePoint,
            initialFeePoint: res.aulieAtaInfo.initialFeePoint,
            registrationPoint: res.aulieAtaInfo.registrationPoint,
            workExperiencePoint: res.aulieAtaInfo.workExperiencePoint,
          };
          this.task.createTime = res.createDate;
          if (this.task) {
            // this.setTaskData();
            // this.taskService.sendTaskSubject(this.task);
          }
          this.fillTableInfo(this.task);
          this.setApplicantForm(true);
          this.getBirthday(this.task.iin);
        }
      });
    }
  }

  isTemplates() {
    return this.dataTaskDecide.code === 'TEMPLATE';
  }
  setTemplate(template) {
    this.setTemplateToMessage(template);
  }

  async fillTableInfo(task) {
    this.getAppFiles(task.content.appId);
    this.applicant.initialFee = task.content.initialFee;
    switch (task.content.industry) {
      case 'HEALTHCARE':
        this.applicant.industry = 'Healthcare';
        break;
      case 'EDUCATION':
        this.applicant.industry = 'Education';
        break;
      case 'CULTURE':
        this.applicant.industry = 'Culture';
        break;
      case 'SPORT':
        this.applicant.industry = 'Спорт';
        break;
      case 'JOURNALISM':
        this.applicant.industry = 'Журналистика';
        break;
      default:
        this.applicant.industry = 'NotSpecified';
        break;
    }

    switch (task.content.workExperience) {
      case 1:
        this.applicant.workExperience = 'UpTwoYear';
        break;
      case 2:
        this.applicant.workExperience = 'FromThreeToFiveYears';
        break;
      case 3:
        this.applicant.workExperience = 'FromSixToSevenYears';
        break;
      case 4:
        this.applicant.workExperience = 'FromEithToFiveYears';
        break;
      case 5:
        this.applicant.workExperience = 'MoreTenYears';
        break;
      default:
        this.applicant.workExperience = 'NotSpecified';
        break;
    }

    switch (task.content.amountOfChildren) {
      case 0:
        this.applicant.amountOfChildren = 'NoChildren';
        break;
      case 1:
        this.applicant.amountOfChildren = '1-2';
        break;
      case 2:
        this.applicant.amountOfChildren = '3-4';
        break;
      case 3:
        this.applicant.amountOfChildren = '5-6';
        break;
      case 4:
        this.applicant.amountOfChildren = 'MoreSeven';
        break;
      default:
        this.applicant.amountOfChildren = 'NotSpecified';
        break;
    }

    switch (task.content.marriage) {
      case 1:
        this.applicant.marriage = 'UpTwoYear';
        break;
      case 2:
        this.applicant.marriage = 'FromThreeToFiveYears';
        break;
      case 3:
        this.applicant.marriage = 'FromSixToSevenYears';
        break;
      case 4:
        this.applicant.marriage = 'FromEithToFiveYears';
        break;
      case 5:
        this.applicant.marriage = 'MoreTenYears';
        break;
      default:
        this.applicant.marriage = 'NotSpecified';
        break;
    }

    this.filesGetter$.subscribe((data: any) => {
      this.applicant.marriageDoc = data.find(
        (f) => f.fileCategory === 'SCAN_MARRIAGE'
      );
      this.applicant.amountOfChildrenDoc = data.find(
        (f) => f.fileCategory === 'CHILD_BIRTH_CERTIFICATE'
      );
      this.applicant.workExperienceProof = data.find(
        (f) => f.fileCategory === 'WORK_PROOF'
      );
      this.applicant.initialFeeDoc = data.find(
        (f) => f.fileCategory === 'OTBASY_ACCOUNT'
      );
    });

    this.applicant.amountOfChildrenPoint = task.content.amountOfChildrenPoint;
    this.applicant.initialFeePoint = task.content.initialFeePoint;
    this.applicant.marriagePoint = task.content.marriagePoint;
    this.applicant.workExperiencePoint = task.content.workExperiencePoint;
    this.applicant.total = task.content.sumOfPoint;
    this.applicant.initialFee = task.content.initialFee;
  }

  private setApplicantForm(disabled: boolean): void {
    const initialPoints = 0;
    this.applicantForm = this.formBuilder.group({
      initialFeePoint: {
        value: initialPoints || this.task.content.initialFeePoint,
        disabled,
        validators: Validators.required
      },
      marriagePoint: {
        value: initialPoints || this.task.content.marriagePoint,
        disabled,
        validators: Validators.required
      },
      workExperiencePoint: {
        value: initialPoints || this.task.content.workExperiencePoint,
        disabled,
        validators: Validators.required
      },
      amountOfChildrenPoint: {
        value: initialPoints || this.task.content.amountOfChildrenPoint,
        disabled,
        validators: Validators.required
      },
    });
    if (this.dataTaskDecide) {
      this.dataTaskDecide.initialFeePoint = initialPoints;
      this.dataTaskDecide.marriagePoint = initialPoints;
      this.dataTaskDecide.workExperiencePoint = initialPoints;
      this.dataTaskDecide.amountOfChildrenPoint = initialPoints;
    }
    this.sendStepStatus(false);
  }

  private sendStepStatus(status: boolean): void {
    this.stepProgressSub$.next(status);
  }

  public updateScoreValue(controlName: string): void {
    if (this.applicantForm) {
      const control: AbstractControl = this.applicantForm.get(controlName);
      if (control) {
        if (
          !Number.isFinite(control.value)
          || control.value < 0
          || control.value > Number.MAX_SAFE_INTEGER
        ) {
          control.setValue(0);
          control.updateValueAndValidity();
        }
        if (this.applicantForm.valid && this.dataTaskDecide) {
          const newValue: number = control.value;
          this.dataTaskDecide[controlName] = Number.isFinite(newValue) ? newValue : 0;
          this.sendStepStatus(true);
        }
      }
    }
  }

  setTaskData() {
    this.task.name = this.task.name.replace(/ *\([^)]*\) */g, '');
    this.dataTaskDecide = this.taskService.matchingData(
      this.task.content,
      this.dataTaskDecide
    );
  }

  findFile(fileCategory) {
    const file = this.fileList.find((f) => {
      return f.fileCategory === fileCategory;
    });
    return file !== undefined ? file : ' - - - ';
  }

  getApplication(appId: number) {
    if (appId) {
      this.appSvc
        .getApplicationById(appId)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((res) => {
          this.appSvc.setApp(res);
          this.app = res;
          this.app.taskId = this.taskId;
          if (res.numerationDate) {
            this.app.numerationDate = new Date(this.app.numerationDate);
          }
          this.getTemplates();
        });
    }
  }

  getTemplates(): void {
    this.taskService
      .getTemplatesBySubServiceId(
        this.task.content.subserviceId,
        this.dataTaskDecide.regionId
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.templates = res;
      });
  }

  public setText(text) {
    this.dataTaskDecide.orderText = text;
    this.taskService.sendTaskDecideSubject(this.dataTaskDecide);
    this.updateTask(this.dataTaskDecide);
  }

  applyExtends(myClass: any, ExtenderSourceList: any[]) {
    ExtenderSourceList.forEach((ext) => {
      Object.getOwnPropertyNames(ext.prototype).forEach((name) => {
        myClass.prototype[name] = ext.prototype[name];
      });
    });
  }

  getAppFiles(id: number) {
    this.api.get2(`userapp/${id}/files`).subscribe((r) => {
      this.fileList = r;
      this.filesGetter$.next(r);
    });
  }

  downloadFiles(id) {
    this.fileSvc.downloadFileReq(id);
  }
  getBirthday(iin: string) {
    this.api.get2(`userapp/aulieata/birth/${iin}`).subscribe((data: any) => {
      this.birthday = data;
      this.birthday2 = this.datePipe.transform(
        this.birthday.birth,
        'dd.MM.yyyy'
      );
    });
  }
}
