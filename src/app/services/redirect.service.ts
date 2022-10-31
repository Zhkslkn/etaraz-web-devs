import {Injectable, OnDestroy, SecurityContext} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthService} from './auth.service';
import {UNSAFE_URL_PREFIX, WindowFeature, WindowTarget} from '../shared/models/redirect.model';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class RedirectService implements OnDestroy {
  private readonly destroyed$: Subject<void>;
  private readonly safeFeatures: WindowFeature[];
  private readonly featuresSeparator: string;

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.destroyed$ = new Subject<void>();
    this.safeFeatures = [
      'noopener', 'noreferrer'
    ];
    this.featuresSeparator = ',';
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public handleLink(
    url: string,
    target: WindowTarget,
    features: WindowFeature | WindowFeature[] = ''
  ): void {
    this.safeWindowOpen(url, target, features);
  }

  private safeWindowOpen(
    url: string,
    target: WindowTarget,
    features: WindowFeature | WindowFeature[] = ''
  ): void {
    const sanitizedUrl: string = this.sanitizer.sanitize(SecurityContext.URL, url);
    if (sanitizedUrl && !sanitizedUrl.includes(UNSAFE_URL_PREFIX)) {
      const _window: Window = window.open(
        encodeURI(url),
        target,
        this.appendSafeFeatures(features)
      );
      if (_window) {
        _window.opener = null;
      }
    }
  }

  private appendSafeFeatures(features: WindowFeature | WindowFeature[]): string {
    if (features) {
      let newFeatures: WindowFeature[];
      if (Array.isArray(features)) {
        newFeatures = features;
      } else {
        newFeatures = features
          .replace(/\s+/g, '')
          .split(this.featuresSeparator);
      }
      const safeFeaturesPresent: boolean = this.safeFeatures
        .every((feature: string) => newFeatures.includes(feature));
      newFeatures
        = safeFeaturesPresent
        ? newFeatures
        : [...newFeatures, ...this.safeFeatures];
      return newFeatures.join(this.featuresSeparator);
    } else {
      return this.safeFeatures.join(this.featuresSeparator);
    }
  }
}
