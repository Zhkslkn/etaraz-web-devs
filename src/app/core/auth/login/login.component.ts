import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../services/auth.service';
import {auth} from '../../../shared/models/auth.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../../shared/helper/must-match.validator';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {takeUntil, timeout} from 'rxjs/operators';
import {HTTP_REQUEST_TIMEOUT} from '../../../shared/utils/constants';
import {DestroyableComponent} from '../../../shared/components/destroyable/destroyable.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends DestroyableComponent implements OnInit {
  message = '';
  authForm: FormGroup;
  registerContent: boolean;
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();

  }

  private initForm() {
    this.authForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private initRegisterForm() {
    if (!this.registerForm) {
      this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
        username: [''],
        password: ['', [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{7,}')
        ]],
        confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
        firstName: ['', [Validators.required]],
        lastName: [''],
        secondName: ['', [Validators.required]],
      }, {
        validator: MustMatch('password', 'confirmPassword')
      });
    }
  }

  public toLogin(event?: KeyboardEvent): void {
    const enterKey = 'Enter';
    if (
      this.authForm.invalid
      || (
        event
        && ![event.key, event.code].includes(enterKey)
      )
    ) {
      if (this.authForm.invalid) {
        this.authForm.markAllAsTouched();
      }
      return;
    }
    this.http
      .post('/auth/token', this.authForm.value)
      .pipe(
        timeout(HTTP_REQUEST_TIMEOUT),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        (data: any) => {
          if (data && data.access_token) {
            this.onSuccessLogin(data);
          } else {
            this.message = 'something went wrong';
          }
        },
        (error: any) => {
          if (error && error.error && error.error.error) {
            this.message = error.error.error;
          }
        }
      );
  }

  onSuccessLogin(data) {
    localStorage.setItem('access_token', data.access_token);
    this.authService.init();
    this.authService
      .getCurrentUser()
      .pipe(
        timeout(HTTP_REQUEST_TIMEOUT),
        takeUntil(this.destroyed$)
      )
      .subscribe((user: auth.User) => {
        if (user) {
          this.authService.userInfo$.next(user);
        } else {
          this.authService.userInfo$.next(null);
        }
      });
  }

  get login() {
    return this.authForm.controls.username;
  }

  get password() {
    return this.authForm.controls.password;
  }

  get confirmPassword() {
    return this.registerForm.controls.confirmPassword;
  }

  get registerLogin() {
    return this.registerForm.controls.email;
  }

  get registerPassword() {
    return this.registerForm.controls.password;
  }

  getLoginErrorMessage() {
    return this.login.hasError('required') ? '?????? ?????????????????????????? ????????!' :
      this.login.hasError('minlength') ? '?????????? ???????????? ?????????????????? ???? ?????????? 3 ????????????????' : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? '?????? ?????????????????????????? ????????!' :
      this.password.hasError('minlength') ? '???????????? ???????????? ?????????????????? ???? ?????????? 3 ????????????????' : '';
  }

  getRegisterLoginErrorMessage() {
    return this.registerLogin.hasError('required') ? '?????? ?????????????????????????? ????????!' :
      this.registerLogin.hasError('minlength') ? '?????????? ???????????? ?????????????????? ???? ?????????? 3 ????????????????' : '';
  }

  getRegisterPasswordErrorMessage() {
    return this.registerPassword.hasError('required') ? '?????? ?????????????????????????? ????????!' :
      // tslint:disable-next-line:max-line-length
      this.registerPassword.hasError('pattern') ? '???????????? ???????????? ?????????????????? ???? ?????????? 8 ???????????????? ?? ???????????????????????? ?????????????? ???????????? ???????? ?????????????????? ?? ?????????????????? ?????????? ?? ?????????????????????? ?????????????? ($@$!%*?&#).' : '';
  }

  getRegisterConfirmPasswordErrorMessage() {
    return this.confirmPassword.hasError('required') ? '?????? ?????????????????????????? ????????!' :
      this.confirmPassword.hasError('minlength') ? '???????????? ???????????? ?????????????????? ???? ?????????? 8 ????????????????' :
        this.confirmPassword.hasError('mustMatch') ? '???????????? ???? ??????????????????' : '';
  }

  get formControls() {
    return this.registerForm.controls;
  }

  showRegisterContent() {
    this.registerContent = true;
    this.initRegisterForm();
  }

  onReset() {
    this.registerContent = false;
    this.submitted = false;
    this.registerForm.reset();
  }

  register() {
    if (this.registerContent) {
      this.submitted = true;
      if (this.registerForm.invalid) {
        return;
      }
      this.registerForm.value.username = this.registerForm.value.email;

      this.authService
        .register(this.registerForm.value)
        .pipe(
          timeout(HTTP_REQUEST_TIMEOUT),
          takeUntil(this.destroyed$)
        )
        .subscribe(res => {
          if (res) {
            this.snackBar.open('?????????????????? ???????????? ??????????????! ?????????????????? ?????????? ?????????? ???????????? ??????????????????', '', {duration: 3000});
            this.onReset();
          }
        }, error => {
          if (error.status === 409) {
            this.snackBar.open('???????????????????????? ?? ?????????? ???????????? ?????? ?????????????????????????????? !', '', {duration: 3000});
          }
        });
    }

  }

  reactivate() {
    if (this.login.value) {
      this.authService
        .reactivateUser(this.login.value)
        .pipe(
          timeout(HTTP_REQUEST_TIMEOUT),
          takeUntil(this.destroyed$)
        )
        .subscribe(res => {
          if (res) {
            this.snackBar.open('?????????????????? ?????????? ?????????? ???????????? ??????????????????', '', {duration: 3000});
            this.message = '';
          }
        }, error1 => {
          this.snackBar.open('??????! ?????? - ???? ?????????? ???? ?????? !', '', {duration: 3000});
        });
    }
  }

}
