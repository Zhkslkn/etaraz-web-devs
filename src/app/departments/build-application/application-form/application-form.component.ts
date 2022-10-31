import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {app} from '../../../shared/models/application.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApplicationService} from '../../../services/application.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {auth} from '../../../shared/models/auth.model';
import {AdminService} from '../../../services/admin.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {USER_TYPE} from '../../../shared/utils/constants';
import {DicApplicationService} from '../../../services/dic.application.service';
import {MessageBoxComponent} from 'src/app/components/message-box/message-box.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Region} from '../../../components/select-region/model/region.model';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../../services/api.service';
import {DatePipe} from '@angular/common';
import {DialogSubmitApplicationComponent} from './dialog-submit-application/dialog-submit-application.component';
import User = auth.User;


@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ApplicationFormComponent implements OnInit {
  app: app.App = new app.App();
  appForm: any;
  appFormAulie: FormGroup;
  subserviceId: any;
  token: any;
  age: number;
  currentUser: User = null;
  currentNavLinks: any;
  nextNavPosition = 1;
  isOrgApp = false;
  districtList = [];
  destroyed$ = new Subject();
  regions: Region[] = [];
  currentLang;
  isShow = true;
  // form aulie
  sphereIndustry = null;
  regPlace = null;
  firstDeposit = null;
  birthday: { birth: string };
  nationality = null;
  regionId = null;
  familyStatusList = [{title: 'MarriedOr', value: true}, {title: 'Single', value: false}];
  marriageList = [
    {title: 'UpTwoYear', value: 1},
    {title: 'FromThreeToFiveYears', value: 2},
    {title: 'FromSixToSevenYears', value: 3},
    {title: 'FromEithToFiveYears', value: 4},
    {title: 'MoreTenYears', value: 5},
  ];
  childStatusList = [
    {title: 'NoChildren', value: 0},
    {title: '1-2', value: 1},
    {title: '3-4', value: 2},
    {title: '5-6', value: 3},
    {title: 'MoreSeven', value: 4},
  ];
  industryStatusList = [
    {title: 'Healthcare', value: 'HEALTHCARE'},
    {title: 'Education', value: 'EDUCATION'},
    {title: 'Culture', value: 'CULTURE'},
    {title: 'Спорт', value: 'SPORT'},
    {title: 'Журналистика', value: 'JOURNALISM'},
  ];
  relativesLocationList = [
    {title: 'ZhambylRegion', value: 'ZHAMBYL'},
    {title: 'NurSultanCity', value: 'NURSULTAN'},
    {title: 'AlmatyCity', value: 'ALMATY'},
    {title: 'ShymkentCity', value: 'SHYMKENT'},
    {title: 'OtherRegionsRK', value: 'OTHER_REGION'},
  ];
  workExperienceStatusList = [
    {title: 'UpTwoYear', value: 1},
    {title: 'FromThreeToFiveYears', value: 2},
    {title: 'FromSixToSevenYears', value: 3},
    {title: 'FromEithToFiveYears', value: 4},
    {title: 'MoreTenYears', value: 5},
  ];
  hasValueFamilyStatus: number;
  hasChildrenStatus: any;
  hasValueIndustryStatus: any;
  hasValueWorkStatus: any;
  checkMarriageAge: any;
  submitted = false;
  isModal: boolean;

  constructor(
    private fb: FormBuilder,
    private appSvc: ApplicationService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dicSvc: DicApplicationService,
    private translate: TranslateService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
    this.isModal = false;
  }

  ngOnInit() {
    this.initApp();
    this.fillUserInfo();
    this.getRegions().then();
    this.getQueryParams();
    this.setNavLink();
    this.initForm();
    this.getDistricts();
    this.initTranslate();
  }

  private initApp(): void {
    this.app = this.appSvc.getApp();
  }

  fillUserInfo(): void {
    // this.birthday = this.app.iin;
    this.regionId = this.app.regionId;
  }

  initTranslate() {
    this.translate.onLangChange.subscribe((event: any) => {
      this.currentLang = event.lang;
      this.setAppAddress();
    });
  }

  setNavLink() {
    this.currentNavLinks = this.appSvc.getNavLink(this.subserviceId);
  }

  getQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        this.token = params.access_token;
        this.subserviceId = +params.subserviceId;
        this.setAuthUserInOtherProject();
        if (params.locale) {
          this.currentLang = params.locale === 'ru' ? 'ru' : 'kk';
          this.setLocalization();
        }
        if (params.regionId) {
          this.app = new app.App();
          this.app.regionId = +params.regionId;
          this.regionId = +params.regionId;
        }
        if (params.subserviceId === '153') {
          this.isShow = false;
        }
      });
  }

  setLocalization(): any {
    this.translate.use(this.currentLang);
    localStorage.setItem('currentLang', this.currentLang);
  }

  setAuthUserInOtherProject() {
    if (this.token) {
      localStorage.setItem('access_token', this.token);
      this.authService.init();
      this.getCurrentUser();
    }
  }

  getCurrentUser() {
    this.authService.getCurrentUser().pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.currentUser = res;
          if (this.app.bin) {
            this.isOrgApp = true;
          }
          this.transferDataFromCurrentUserInfo(this.currentUser);
          this.adminService.setForm(this.appForm.controls, this.app);
        }
      });
  }

  private transferDataFromCurrentUserInfo(currentUser: auth.User) {
    this.app.firstName = currentUser.firstName;
    this.app.lastName = currentUser.lastName;
    this.app.secondName = currentUser.secondName;
    this.app.iin = currentUser.iin;
    this.app.bin = currentUser.bin;
    this.app.org = currentUser.userType === USER_TYPE.LEGAL;
    this.app.subservice.id = this.subserviceId;
    this.fillUserInfo();
    if (currentUser.orgName) {
      this.app.orgName = currentUser.orgName.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    }
    if (this.subserviceId === 153) {
      this.getBirthday(currentUser.iin);
    }
    this.setAppAddress();
  }

  public setAppAddress() {
    this.app.address = this.getAddressByLang();
    if (this.appForm && this.appForm.controls && this.subserviceId !== 153) {
      this.appForm.controls.address.setValue(this.app.address);
      this.appForm.controls.address.updateValueAndValidity();
    }
  }

  getAddressByLang() {
    const result = this.currentLang === 'ru' ? `080110, Республика Казахстан, Жамбылская область, ${this.getRegionNameByRegionId()}` :
      `080110, Қазақстан Республикасы, Жамбыл облысы,  ${this.getRegionNameByRegionId()}`;
    return result;
  }

  getRegionNameByRegionId(regionId = null) {
    let regionName = '';
    const region = this.dicSvc.getRegionById(this.regions, regionId || this.app.regionId);
    regionName = region ? region['name' + this.capitalizeFirstLetter(this.currentLang)] : 'г.Тараз';
    return regionName;
  }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async getRegions() {
    this.dicSvc.getRegions().then((data: Region[]) => {
      this.regions = data;
      this.setAppAddress();
    });
  }

  initForm() {
    if (this.subserviceId !== 153) {
      this.appForm = this.fb.group({
        firstName: {value: this.app.firstName, disabled: true},
        lastName: {value: this.app.lastName, disabled: true},
        secondName: {value: this.app.secondName, disabled: true},
        iin: {value: this.app.iin, disabled: true},

        address: [this.app.address, Validators.required],
        phone: [this.app.phone, Validators.required],
        regionId: [this.app.regionId, Validators.required],
        bin: [this.app.bin],
        orgName: [this.app.orgName],
        org: [this.app.org, Validators.required],
        subservice: this.fb.group({
          id: [this.subserviceId, Validators.required]
        }),

        otherApplicant: [this.app.otherApplicant],
        applicantIinBin: [this.app.applicantIinBin],
        applicantName: [this.app.applicantName],
        applicantIsOrg: [this.app.applicantIsOrg],
        identityCardNumber: [this.app.identityCardNumber],
        identityCardDistributor: [this.app.identityCardDistributor],
      });
    }

    if (this.subserviceId === 14) {
      this.appForm.addControl('ozoInfo',
        this.fb.group({districts: [this.app.ozoInfo.districts, Validators.required]}));
    }

    if (this.app.id && this.subserviceId === 153) {
      this.getBirthday(this.app.iin);
      this.appForm = this.fb.group({
        firstName: {value: this.app.firstName, disabled: true},
        lastName: {value: this.app.lastName, disabled: true},
        secondName: {value: this.app.secondName, disabled: true},
        iin: {value: this.app.iin, disabled: true},
        birthday: {value: this.birthday, disabled: true},
        nationality: {value: 'Казахстан', disabled: true},
        subservice: [{id: this.subserviceId}, Validators.required],
        aulieAtaInfo: this.fb.group({
          industry: [this.app.aulieAtaInfo.industry, Validators.required],
          regionId: {value: this.regionId},
          mail: [this.app.aulieAtaInfo.mail, [Validators.required, Validators.email]],
          phone: [this.app.aulieAtaInfo.phone, [Validators.required, Validators.minLength(11)]],
        })
      });
    }
    if (this.subserviceId === 153 && !this.app.id) {
      this.appForm = this.fb.group({
        firstName: {value: this.app.firstName, disabled: true},
        lastName: {value: this.app.lastName, disabled: true},
        secondName: {value: this.app.secondName, disabled: true},
        iin: {value: this.app.iin, disabled: true},
        birthday: {value: this.birthday, disabled: true},
        nationality: {value: 'Казахстан', disabled: true},
        subservice: [{id: this.subserviceId}, Validators.required],
        aulieAtaInfo: this.fb.group({
          industry: ['', Validators.required],
          regionId: {value: this.regionId},
          mail: ['', [Validators.required, Validators.email]],
          phone: ['', [Validators.required, Validators.minLength(11)]],
        })
      });
    }
  }

  get formControls() {
    return this.appForm.controls;
  }

  validate() {
    this.submitted = true;
    if (this.appForm.invalid) {
      Object.keys(this.appForm.controls)
        .forEach(controlName => this.appForm.controls[controlName].markAsTouched());
      return;
    }
    if (this.checkNumberLength(this.appForm.controls.iin.value)) {
      this.showModal();
    } else {
      this.snackBar.open('Указан неправильный формат ИИН!', '', {duration: 3000});
    }
  }

  public checkEventValueType(evt: any) {
    if (evt.which !== 8 && isNaN(Number(String.fromCharCode(evt.which)))) {
      evt.preventDefault();
    }
    if (evt.target.value.length > 11) {
      evt.preventDefault();
    }
  }

  public checkEventValueCardNumber(evt: any) {
    if (evt.which !== 8 && isNaN(Number(String.fromCharCode(evt.which)))) {
      evt.preventDefault();
    }
    if (evt.target.value.length > 8) {
      evt.preventDefault();
    }
  }

  private checkNumberLength(num: string) {
    return num.length >= 12;
  }

  create() {
    if (!this.app.id) {
      let data = this.appForm.getRawValue();
      if (this.subserviceId === 153) {
        data = this.parseDataAulie(data);
      }
      if (this.subserviceId === 14) {
        data.ozoInfo.districts = JSON.stringify(data.ozoInfo.districts);
      }
      if (this.subserviceId === 37) {
        this.checkingSpecregByIIN(data);
      } else {
        this.createApp(data);
      }
    }
  }

  createApp(data) {
    this.appSvc.createApp(data, (_app) => {
      this.app = _app;
      this.appSvc.setApp(_app);
      this.changeRoute(this.currentNavLinks[this.nextNavPosition]);
    });
  }

  parseDataAulie(data) {
    data.aulieAtaInfo.age = +data.aulieAtaInfo.age;
    data.aulieAtaInfo.regionId = {id: this.regionId};
    data.subservice = {id: data.subservice.id};
    if (this.hasValueFamilyStatus) {
      data.aulieAtaInfo.marriage = +data.aulieAtaInfo.marriage;
    }
    return data;
  }

  changeRoute(url: any) {
    this.appSvc.sendBuildAppUrl(this.nextNavPosition);
    const params: any = {appId: this.app.id, subserviceId: this.subserviceId};
    this.router.navigate([url], {
      queryParams: params
    }).then();
  }

  private getDistricts() {
    this.dicSvc.getDisctrictsReq().pipe(takeUntil(this.destroyed$))
      .subscribe(data => {
        this.districtList = data;
      });
  }

  checkingSpecregByIIN(data: app.App) {
    this.appSvc.checkingSpecregByIIN(this.appForm.controls.iin.value).pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        if (response.exists) {
          this.showSpecRegMessage(response.orderNumber, response.regionId);
        } else {
          this.createApp(data);
        }
      });
  }

  showSpecRegMessage(orderNumber, regionId) {
    let text = `Вы не можете подать на данную услугу, т.к на основании заключения городской комиссии по
        предоставлению земельных участков в собственность и землепользование Вы зарегистрированы в списке
        специального учета заявлений за номером ${orderNumber}`;
    if (regionId) {
      const regionName = this.getRegionNameByRegionId(regionId);
      text = text + ` в регионе ${regionName}`;
    }
    const dialogRef = this.dialog.open(MessageBoxComponent, {
      width: '600px',
      data: {
        title: 'Уведомление',
        message: text
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        this.router.navigate(['/']).then();
      });
  }

  changeRadioBtn(event) {
    if (event) {
      this.appForm.get('applicantIinBin').setValidators([Validators.required, Validators.minLength(12)]);
      this.appForm.controls.lastName.enable();
      this.appForm.controls.firstName.enable();
      this.appForm.controls.secondName.enable();
      this.appForm.controls.iin.enable();
    } else {
      this.appForm.get('applicantIinBin').clearValidators();
      this.appForm.get('applicantIinBin').updateValueAndValidity();
      this.appForm.controls.lastName.disable();
      this.appForm.controls.firstName.disable();
      this.appForm.controls.secondName.disable();
      this.appForm.controls.iin.disable();
    }
  }

  /*public compareWithFunc(a, b) {
    if (a && b) {
      return a.name === b.name;
    }
  }*/

  checkNextStep() {
    this.validate();
    this.changeRoute(this.currentNavLinks[this.nextNavPosition]);
  }

  setValueFamilyStatus() {
    this.appForm.controls.aulieAtaInfo.controls.familyStatus.value = this.hasValueFamilyStatus;
  }

  setValueChildStatus() {

  }

  radioBtn() {
  }

  getBirthday(iin: string) {
    this.api.get2(`userapp/aulieata/birth/${iin}`).subscribe((data: any) => {
      this.birthday = data;
      const birthday = this.datePipe.transform(this.birthday.birth, 'dd.MM.yyyy');
      this.appForm.controls.birthday.setValue(birthday);
    });
  }

  checkAge(iin: string) {
    let year = +iin.slice(0, 2);
    const month = +iin.slice(2, 4);
    const date = +iin.slice(4, 6);
    const nowDate = new Date();
    const nowYear = +nowDate.getFullYear();
    (year > (nowYear - 2000)) ? year = year + 1900 : year = year + 2000;
    const nowMonth = +nowDate.getMonth() + 1;
    const nowday = +nowDate.getDate();
    this.age = nowYear - year;
    if (nowMonth < month) {
      this.age = this.age - 1;
    } else if (nowMonth === month) {
      (nowday >= date) ? this.age = this.age : this.age = this.age - 1;
    }
    this.appForm.controls.aulieAtaInfo.controls.regionId.setValue(this.app.regionId);
    this.appForm.controls.aulieAtaInfo.controls.age.setValue(this.age);
  }

  get f() {
    return this.appForm.controls.aulieAtaInfo.controls;
  }

  showModal() {
    const dialogRef = this.dialog.open(DialogSubmitApplicationComponent, {});
    dialogRef.afterClosed().pipe(
      (name => name)
    ).subscribe(name => {
      if (name) {
        this.create();
      }
    });
  }
}
