import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { dic } from '../../../shared/models/dictionary.model';
import { ApplicationService } from '../../../services/application.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ProblemService } from '../../../services/problem.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Location } from '@angular/common';
import { FileService } from '../../../services/file.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { SignService } from '../../../services/sign.service';
import { EditorService } from '../../../services/editor.service';
import { DicApplicationService } from '../../../services/dic.application.service';
import { HeaderArchSpecialistComponent } from '../../../components/header-arch-specialist/header-arch-specialist.component';
import { app } from '../../../shared/models/application.model';
import ApprovalList = dic.ApprovalList;
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {RedirectService} from '../../../services/redirect.service';

@Component({
  selector: 'app-beztorgreg2-header',
  templateUrl: './beztorgreg2-header.component.html',
  styleUrls: ['./beztorgreg2-header.component.scss']
})
export class Beztorgreg2HeaderComponent extends HeaderArchSpecialistComponent implements OnInit, OnDestroy {

  @Output() getApplication = new EventEmitter<number>();
  @Output() refreshResultFiles = new EventEmitter<any>();
  @Input() app: app.App;
  @Input() task: dic.TaskData;
  @Input() sectionId;
  @Input() templates: any;
  approvalList: ApprovalList = new ApprovalList();
  approvalListSubscription: Subscription;

  constructor(
    public appSvc: ApplicationService,
    public dialog: MatDialog,
    public taskService: ProblemService,
    public router: Router,
    public authService: AuthService,
    public location: Location,
    public fileServise: FileService,
    public translate: TranslateService,
    public api: ApiService,
    public signService: SignService,
    public snackBar: MatSnackBar,
    public editorSvc: EditorService,
    public dicSvc: DicApplicationService,
    protected redirectService: RedirectService
  ) {
    super(appSvc, dialog, taskService, router, authService, location, fileServise, translate,
      api, signService, snackBar, editorSvc, dicSvc, redirectService);
    this.approvalListSubscription = this.taskService.getApprovalList()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(list => {
        this.approvalList = list;
      });
  }

  ngOnInit() { super.ngOnInit(); }

  // showRefusal() { return false; }

  isRework() { return this.dataTaskDecide.code === 'REWORK'; }

  public verificationBeforeApproval() {
    this.setValueStage(true).then(() => {
      this.approved();
    });
  }

  verificationBeforeRefusal() {
    this.setValueStage(false).then(() => {
      this.refusal();
    });
  }

  signAndCompleteLandLeaseExten() {
    this.setValueStage(true);
    this.getSignXml();
    this.transferTaskToSend = true;
  }

  setValueStage(value: boolean) {
    return new Promise((resolve) => {
      Object.keys(this.approvalList).forEach((key) => {
        if (this.approvalList[key]) {
          this.dataTaskDecide[key] = value;
        }
      });
      resolve();
    });
  }

  ngOnDestroy() {
    this.approvalListSubscription.unsubscribe();
  }

}
