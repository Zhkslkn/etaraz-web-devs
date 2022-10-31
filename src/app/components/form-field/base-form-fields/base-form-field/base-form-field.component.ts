import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {EMPTY, Observable, Subscription} from 'rxjs';
import {DestroyableComponent} from '../../../../shared/components/destroyable/destroyable.component';

@Component({
  selector: 'app-base-form-field',
  templateUrl: './base-form-field.component.html',
  styleUrls: ['./base-form-field.component.scss']
})
export class BaseFormFieldComponent extends DestroyableComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  public title: string;
  @Input()
  public placeholder: string;
  @Input()
  public control: FormControl;
  @Input()
  public errorKey: string;
  public invalidControl: boolean;
  private controlStatusSub?: Subscription;

  constructor() {
    super();
    this.title = '';
    this.placeholder = '';
    this.errorKey = '';
    this.control = new FormControl();
    this.invalidControl = false;
  }

  protected get controlValueChange(): Observable<any> {
    return this.control ? this.control.valueChanges : EMPTY;
  }

  protected get controlStatusChange(): Observable<any> {
    return this.control ? this.control.statusChanges : EMPTY;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const control: SimpleChange = changes.control;
    if (control) {
      if (control.currentValue instanceof FormControl) {
        this.checkControlStatus();
      }
    }
  }

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
    if (this.controlStatusSub) {
      this.controlStatusSub.unsubscribe();
    }
    super.ngOnDestroy();
  }

  public onInputBlur(event: FocusEvent): void {
    this.checkControlValidity();
  }

  protected checkControlStatus(): void {
    if (this.control) {
      if (this.controlStatusSub) {
        this.controlStatusSub.unsubscribe();
      }
      this.controlStatusSub =
        this.controlStatusChange
          .subscribe(
            () => {
              this.checkControlValidity();
            }
          );
    }
  }

  protected checkControlValidity(): void {
    this.invalidControl = (this.control.invalid && !this.control.disabled) || !!this.control.errors;
  }
}
