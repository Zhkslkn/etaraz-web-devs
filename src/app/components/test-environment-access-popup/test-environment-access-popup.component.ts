import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {RedirectService} from '../../services/redirect.service';
import {environment} from '../../../environments/environment';
import {MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import {merge, Observable, Subject, timer} from 'rxjs';
import {castWrapperValueToString, TranslationPair, TranslationWrapper} from '../../shared/models/translation.model';
import {VOID} from '../../shared/rxjs/observables';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DestroyableComponent} from '../../shared/components/destroyable/destroyable.component';

enum ACCESS_POPUP_BUTTON_CLASS {
  REDIRECT = 'redirect-button',
  ACCESS = 'access-button',
  BACK = 'back-button',
  LOGIN = 'login-button'
}

interface CountdownT9ns {
  readonly prefix: TranslationPair;
  readonly suffix: TranslationPair;
}

interface AccessPopupButtonWrapper {
  class: ACCESS_POPUP_BUTTON_CLASS;
  key: string;
  callback: (...args: any[]) => any;
}

@Component({
  selector: 'app-test-environment-access-popup',
  templateUrl: './test-environment-access-popup.component.html',
  styleUrls: ['./test-environment-access-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestEnvironmentAccessPopupComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public readonly countdownT9ns: CountdownT9ns;
  public accessLoginCtrl?: FormControl;
  public accessPasscodeCtrl?: FormControl;
  public countdownRunning: boolean;
  public countdownTickText: string;
  public accessForm?: FormGroup;
  public buttonWrappers: AccessPopupButtonWrapper[];
  public passcodeDisplay: boolean;
  private readonly countdownTerminator$: Subject<void>;
  private readonly countdownLimit: number;
  private readonly countdownTickInterval: number;
  private readonly accessLoginKey: string;
  private readonly accessPasscodeKey: string;

  constructor(
    private dialogRef: MatDialogRef<TestEnvironmentAccessPopupComponent>,
    private redirectService: RedirectService,
    private translateService: TranslateService
  ) {
    super();
    this.countdownTerminator$ = new Subject<void>();
    this.dialogRef.disableClose = true;
    this.countdownLimit = 30;
    this.countdownTickInterval = 1000;
    this.countdownT9ns = {
      prefix: {
        key: 'TestEnvironment.Access.Countdown.Prefix',
        value: ''
      },
      suffix: {
        key: 'TestEnvironment.Access.Countdown.Suffix',
        value: ''
      }
    };
    this.accessLoginKey = 'login';
    this.accessPasscodeKey = 'passcode';
    this.countdownRunning = true;
    this.buttonWrappers = [];
    this.passcodeDisplay = false;
  }

  public ngOnInit(): void {
    this.initComponent();
  }

  public ngOnDestroy(): void {
    this.countdownTerminator$.complete();
    super.ngOnDestroy();
  }

  public redirectToEServices(): void {
    this.redirectService.handleLink(
      environment.project.urls.production.es,
      '_self'
    );
  }

  public staffAccess(): void {
    this.toggleCountdown(false);
  }

  public backToWarning(): void {
    this.toggleCountdown(true);
  }

  public login(): void {
    const login: string = this.accessLoginCtrl.value;
    const passcode: string = this.accessPasscodeCtrl.value;
    if (
      btoa(login) === environment.testEnvironment.access.login
      && btoa(passcode) === environment.testEnvironment.access.passcode
    ) {
      this.close();
    } else {
      this.redirectToEServices();
    }
  }

  public togglePasscodeDisplay(): void {
    this.passcodeDisplay = !this.passcodeDisplay;
  }

  public onKeyUp(event: KeyboardEvent): boolean {
    if (event.key === 'Enter') {
      if (this.accessForm.valid) {
        this.login();
      } else {
        this.accessForm.markAllAsTouched();
      }
    }
    return true;
  }

  private initComponent(): void {
    this.initAccessForm();
    this.setAccessButtonWrappers();
    this.getCountdownKeysTranslates()
      .pipe(
        switchMap(() => this.initCountdown()),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  private setAccessButtonWrappers(): void {
    if (this.countdownRunning) {
      this.buttonWrappers = [
        {
          class: ACCESS_POPUP_BUTTON_CLASS.REDIRECT,
          key: 'TestEnvironment.Access.Buttons.Redirect',
          callback: this.redirectToEServices.bind(this)
        },
        {
          class: ACCESS_POPUP_BUTTON_CLASS.ACCESS,
          key: 'TestEnvironment.Access.Buttons.StaffAccess',
          callback: this.staffAccess.bind(this)
        }
      ];
    } else {
      this.buttonWrappers = [
        {
          class: ACCESS_POPUP_BUTTON_CLASS.BACK,
          key: 'Back',
          callback: this.backToWarning.bind(this)
        },
        {
          class: ACCESS_POPUP_BUTTON_CLASS.LOGIN,
          key: 'Enter',
          callback: this.login.bind(this)
        }
      ];
    }
  }

  private getCountdownKeysTranslates(): Observable<void> {
    return (
      this.translateService
        .get([
          this.countdownT9ns.prefix.key,
          this.countdownT9ns.suffix.key
        ])
        .pipe(
          switchMap((translates: TranslationWrapper) => {
            this.countdownT9ns.prefix.value
              = castWrapperValueToString(translates, this.countdownT9ns.prefix.key);
            this.countdownT9ns.suffix.value
              = castWrapperValueToString(translates, this.countdownT9ns.suffix.key);
            return VOID;
          }),
          takeUntil(this.destroyed$)
        )
    );
  }

  private initCountdown(): Observable<number> {
    return (
      timer(0, this.countdownTickInterval)
        .pipe(
          tap((tick: number) => {
            if (tick === this.countdownLimit) {
              this.terminateCountdown();
              this.redirectToEServices();
            } else {
              this.countdownTickText = ` ${this.countdownLimit - tick} `;
            }
          }),
          takeUntil(
            merge(
              this.countdownTerminator$,
              this.destroyed$
            )
          )
        )
    );
  }

  private initAccessForm(): void {
    this.accessLoginCtrl = new FormControl('', Validators.required);
    this.accessPasscodeCtrl = new FormControl('', Validators.required);
    this.accessForm = new FormGroup({
      [this.accessLoginKey]: this.accessLoginCtrl,
      [this.accessPasscodeKey]: this.accessPasscodeCtrl
    });
  }

  private close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  private toggleCountdown(flag: boolean): void {
    this.countdownRunning = flag;
    this.setAccessButtonWrappers();
    if (flag) {
      this.initCountdown().subscribe();
    } else {
      this.terminateCountdown();
    }
  }

  private terminateCountdown(): void {
    this.countdownTerminator$.next();
  }
}
