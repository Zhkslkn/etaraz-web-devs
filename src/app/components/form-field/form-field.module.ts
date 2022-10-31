import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseFormFieldComponent} from './base-form-fields/base-form-field/base-form-field.component';
import {InputFormFieldComponent} from './base-form-fields/input-form-field/input-form-field.component';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    BaseFormFieldComponent,
    InputFormFieldComponent
  ],
  entryComponents: [
    BaseFormFieldComponent,
    InputFormFieldComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FlexModule
  ],
  exports: [
    BaseFormFieldComponent,
    InputFormFieldComponent
  ]
})
export class FormFieldModule {}
