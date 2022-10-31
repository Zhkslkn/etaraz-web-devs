import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DicApplicationService} from './services/dic.application.service';
import {DestroyableComponent} from './shared/components/destroyable/destroyable.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AuthService} from './services/auth.service';
import {Event, RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {first, takeUntil} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {TestEnvironmentAccessPopupComponent} from './components/test-environment-access-popup/test-environment-access-popup.component';
import {timer} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends DestroyableComponent implements OnInit {
  public pageIsLoaded: boolean;
  public moduleIsLoading: boolean;
  public pageIsPreloading: boolean;
  private readonly pagePreloadingTime: number;

  constructor(
    private translate: TranslateService,
    private dicSvc: DicApplicationService,
    private authService: AuthService,
    private matDialog: MatDialog,
    private router: Router,
  ) {
    super();
    this.pagePreloadingTime = 2000;
    this.setPageLoadFlag(false);
    this.setPagePreloadFlag(false);
    this.setModuleLoadFlag(false);
  }

  public ngOnInit(): void {
    this.displayStaffAccessPopup();
    this.checkModulesLoadingAndSetScroll();
    this.setDefaultLanguage();
    this.getRegions();
  }

  private getRegions(): void {
    this.dicSvc.getRegions().then();
  }

  private setDefaultLanguage(): void {
    if (localStorage.getItem('currentLang') === 'kk') {
      this.translate.setDefaultLang('kk');
    } else {
      this.translate.setDefaultLang('ru');
    }
  }

  private checkModulesLoadingAndSetScroll(): void {
    this.router
      .events
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(
        (event: Event) => {
          if (event instanceof RouteConfigLoadStart) {
            this.setModuleLoadFlag(true);
          } else if (event instanceof RouteConfigLoadEnd) {
            this.setModuleLoadFlag(false);
          }
        }
      );
  }

  private setPageLoadFlag(flag: boolean): void {
    this.pageIsLoaded = flag;
  }

  private setPagePreloadFlag(flag: boolean): void {
    this.pageIsPreloading = flag;
  }

  private setModuleLoadFlag(flag: boolean): void {
    this.moduleIsLoading = flag;
  }

  private displayStaffAccessPopup(): void {
    if (
      environment.testEnvironment.flag
      && !this.authService.isAuthenticated()
    ) {
      const dialogRef: MatDialogRef<TestEnvironmentAccessPopupComponent> =
        this.matDialog.open(
          TestEnvironmentAccessPopupComponent,
          {
            panelClass: 'zero-padding-dialog-container'
          }
        );
      dialogRef
        .afterClosed()
        .pipe(
          takeUntil(this.destroyed$)
        )
        .subscribe(
          () => {
            this.setPageLoadFlags();
          }
        );
    } else {
      this.setPageLoadFlags();
    }
  }

  private setPagePreloadCountdown(): void {
    this.setPagePreloadFlag(true);
    timer(this.pagePreloadingTime)
      .pipe(
        first(),
        takeUntil(this.destroyed$)
      )
      .subscribe(
        () => {
          this.setPagePreloadFlag(false);
        }
      );
  }

  private setPageLoadFlags(): void {
    this.setPagePreloadCountdown();
    this.setPageLoadFlag(true);
  }
}
