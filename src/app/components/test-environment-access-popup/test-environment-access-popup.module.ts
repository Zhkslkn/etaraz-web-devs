import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestEnvironmentAccessPopupComponent} from './test-environment-access-popup.component';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {FormFieldModule} from '../form-field/form-field.module';

@NgModule({
  declarations: [TestEnvironmentAccessPopupComponent],
  entryComponents: [TestEnvironmentAccessPopupComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormFieldModule
  ]
})
export class TestEnvironmentAccessPopupModule {}
