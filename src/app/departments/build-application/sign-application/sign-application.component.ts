import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {app} from '../../../shared/models/application.model';
import {ApplicationService} from '../../../services/application.service';
import {ApiService} from '../../../services/api.service';
import {SignService} from '../../../services/sign.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {MessageBoxComponent} from '../../../components/message-box/message-box.component';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {ModalAppSubmitComponent} from '../../directory/modal-app-submit/modal-app-submit.component';
import {RedirectService} from '../../../services/redirect.service';

@Component({
  selector: 'app-sign-application',
  templateUrl: './sign-application.component.html',
  styleUrls: ['./sign-application.component.scss']
})
export class SignApplicationComponent implements OnInit, OnDestroy {
  subscribeEmail = new FormControl(null, [
    Validators.email,
  ]);
  app: app.App = new app.App();
  openWindowForESP = true;
  selectedStorage = 'PKCS12';
  sign;
  currentNavLinks: any;
  prevNavPosition = 9;
  currentLang: string;
  destroyed$ = new Subject();
  appId: any;
  isModal = false;

  constructor(
    private appSvc: ApplicationService,
    private api: ApiService,
    private signService: SignService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    private translate: TranslateService,
    private redirectService: RedirectService
  ) {
    this.currentLang = this.translate.currentLang ? this.translate.currentLang : this.translate.getDefaultLang();
    this.translate.onLangChange.pipe().subscribe((event: any) => {
      this.currentLang = event.lang;
    });
  }

  ngOnInit() {
    this.app = this.appSvc.getApp();
    this.setNavLink();
    this.sign = this.signService.sign$.pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
        if (data.callback === `${this.app.id}_signXmlBack`) {
          this.signXmlBack(data.result);
        }
      });
  }


  initTranslate() {
    this.translate.onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  setNavLink() {
    this.currentNavLinks = this.appSvc.getNavLink(this.app.subservice.id);
    this.getNavPositions();
  }

  getNavPositions() {
    const currentNavPosition = this.appSvc.getCurrentNavPosition(this.router.url, this.currentNavLinks);
    if (currentNavPosition) {
      this.prevNavPosition = currentNavPosition - 1;
    }
  }

  showModal() {
    this.isModal = true;
    // this.modalSubmitApplication();
  }

  sendApplication() {
    this.api.post2('userapp/' + this.app.id + '/user/xml', null).pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
        if (data && data.body.xml && this.app.id != null) {
          this.signService.signXml(this.selectedStorage, 'SIGNATURE', data.body.xml, `${this.app.id}_signXmlBack`);
        }
      });
    this.openWindowForESP = true;
  }


  signXmlBack(result) {
    if (result.code === '200' && result.responseObject) {
      const xml = result.responseObject;
      const body: any = {xml};
      if (this.subscribeEmail.value) {
        body.subscribeEmail = this.subscribeEmail.value;
      }
      this.api.post2('userapp/' + this.app.id + `/user/sign?lang=${this.currentLang}`, body).pipe(takeUntil(this.destroyed$))
        .subscribe((data: any) => {
          if (!data.body.signed) {
            this.snackBar.open(data.body.message, '', {duration: 1000});
          } else {
            this.showDialogBox(this.getDialogMessage());
            this.appSvc.setApp(new app.App());
          }
        }, (error) => {
          console.log(error);
          alert('Ошибка');
        });
    }
  }

  getDialogMessage() {
    if (this.currentLang === 'ru') {
      return 'Заявление успешно подано! \nСейчас вы будете перенаправлены в ваш личный кабинет';
    } else {
      return 'Өтініш сәтті тапсырылды! \nЕнді сіз өзіңіздің жеке бөлмеңізге бағытталасыз.';
    }
  }

  modalSubmitApplication() {
    this.dialog.open(ModalAppSubmitComponent, {
      width: '500px',
    });
  }

  submitApplication($event) {
    this.sendApplication();
  }

  showDialogBox(text) {
    const dialogRef = this.dialog.open(MessageBoxComponent, {
      width: '600px',
      data: {message: text}
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        this.redirectToEqyzmet();
      });
  }

  redirectToEqyzmet() {
    const token = localStorage.getItem('access_token');
    const url = `${environment.project.urls.default.es}/#/app/user`;
    this.redirectService.handleLink(
      url + `?access_token=${token}`,
      '_self'
    );
  }

  changeRoute(url) {
    const params: any = {appId: this.app.id};
    this.router.navigate([url], {
      queryParams: params
    });
  }

  goBack() {
    this.appSvc.sendBuildAppUrl(this.prevNavPosition);
    this.appSvc.goBack();
  }

  userAgreed(event) {
    this.openWindowForESP = !event.checked;
  }

  ngOnDestroy(): void {
    this.sign.unsubscribe();
  }

}
