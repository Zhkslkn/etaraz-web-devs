import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { LoginComponent } from "../../core/auth/login/login.component";
import { MatDialog } from "@angular/material";
import { AuthService } from "../../services/auth.service";
import { ROLES } from "../../shared/utils/constants";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { Subject, Subscription } from "rxjs";
import { auth } from "../../shared/models/auth.model";
import { takeUntil } from "rxjs/operators";
import { UserGuideComponent } from "./user-guide/user-guide.component";
import { environment } from "../../../environments/environment";
import { RedirectService } from "../../services/redirect.service";
import { WindowTarget } from "../../shared/models/redirect.model";
import { DatrePickerChangeLang } from "src/app/services/datePickerChangeLang.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
  selected = "option2";
  isRoleArch = false;
  isRoleOZO = false;
  isRoleDutyMap = false;
  isRoleCom = false;
  currentUser = null;
  subscription: Subscription;
  currentISOUser: auth.User = null;
  currentLang: string;
  destroyed$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    private redirectService: RedirectService,
    private datePickerChangeLang: DatrePickerChangeLang
  ) {
    this.subscription = this.authService
      .getcurrentUserSubject()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user) => {
        this.currentISOUser = user;
      });
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang
      ? this.translate.currentLang
      : this.translate.getDefaultLang();
    this.translate.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
    this.currenUserData();
    this.initTranslate();
  }

  initTranslate() {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event: any) => {
        this.currentLang = event.lang;
      });
  }

  getCorrectUsername() {
    if (this.currentISOUser) {
      let result = `${this.currentISOUser.lastName} ${this.currentISOUser.firstName}`;
      result = result.length > 30 ? this.currentISOUser.lastName : result;
      return result;
    }
    if (this.currentUser) {
      const result = `${this.currentUser.lastName} ${this.currentUser.firstName}`;
      return result;
    }
  }

  getUsername() {
    if (this.currentUser) {
      return this.currentUser.username;
    }
  }

  getUserIIN() {
    if (this.currentISOUser) {
      const iin = this.currentISOUser.iin ? `${this.currentISOUser.iin}, ` : "";
      const bin = this.currentISOUser.bin ? `${this.currentISOUser.bin}, ` : "";
      const result = `${bin || iin}`;
      return result;
    }
    if (this.currentUser) {
      const iin = this.currentUser.iin ? `${this.currentUser.iin}, ` : "";
      const bin = this.currentUser.bin ? `${this.currentUser.bin}, ` : "";
      const result = `${bin || iin}`;
      return result;
    }
  }

  login(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: "500px",
      data: {},
    });
  }

  private currenUserData() {
    this.authService.userInfo$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: any) => {
        if (data) {
          this.currentUser = data;
          this.checkCurrentUserRoles();
        } else {
          this.currentUser = null;
        }
      });
  }

  logout() {
    this.authService.logout();
    this.changeRoute();
  }

  changeRoute() {
    this.router.navigate(["/"]);
  }

  switchLang(lang: string): any {
    this.translate.use(lang);
    localStorage.setItem("currentLang", lang);
    this.currentLang = lang;
  }

  checkCurrentUserRoles() {
    this.isRoleDutyMap = this.authService.hasRole(ROLES.DUTY_MAP);
    this.isRoleArch = this.authService.hasRole(ROLES.BPM_ARCH);
    this.isRoleCom = this.authService.hasRole(ROLES.BPM_COM);
    if (!this.isRoleArch) {
      this.isRoleOZO = this.authService.hasRole(ROLES.BPM_OZO);
    }
  }

  showDialogBox() {
    const dialogRef = this.dialog.open(UserGuideComponent, {
      width: "600px",
      data: { message: "<p>test</p>" },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public redirectToEServices(): void {
    const tokenKey = "access_token";
    const token: string | null = localStorage.getItem(tokenKey);
    const url: string = token
      ? `${environment.project.urls.default.es}/#/?${tokenKey}=${token}`
      : environment.project.urls.default.es;
    this.redirectToExternalSource(url, "_self");
  }

  public redirectToDutyMap(): void {
    this.redirectToExternalSource(environment.project.urls.default.dm, "_self");
  }

  private redirectToExternalSource(url: string, target: WindowTarget): void {
    this.redirectService.handleLink(url, target);
  }

  onClickChangeDatePickerLang() {
    this.datePickerChangeLang.sendClickEvent();
  }
}
