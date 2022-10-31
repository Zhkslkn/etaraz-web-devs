import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BaseFormFieldComponent} from '../base-form-field/base-form-field.component';

@Component({
  selector: 'app-input-form-field',
  templateUrl: './input-form-field.component.html',
  styleUrls: ['./input-form-field.component.scss']
})
export class InputFormFieldComponent extends BaseFormFieldComponent {
  @Input()
  public inputType: string;
  @Output()
  public keyUpEvent: EventEmitter<KeyboardEvent>;

  constructor() {
    super();
    this.inputType = 'text';
    this.keyUpEvent = new EventEmitter<KeyboardEvent>();
  }

  public emitKeyUpEvent(event: KeyboardEvent): void {
    this.keyUpEvent.emit(event);
  }
}
