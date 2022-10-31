import {Component, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Component({
  template: ''
})
export class DestroyableComponent implements OnDestroy {
  protected readonly destroyed$: Observable<void>;
  private readonly next$: Subject<void>;

  constructor() {
    this.next$ = new Subject<void>();
    this.destroyed$ = this.next$.asObservable();
  }

  public ngOnDestroy(): void {
    this.next$.next();
    this.next$.complete();
  }

  protected baseNgOnDestroy(): void {
    this.ngOnDestroy();
  }
}
