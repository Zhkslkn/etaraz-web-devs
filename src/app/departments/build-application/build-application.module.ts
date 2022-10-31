import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


import { ArchMapModule } from '../../components/arch-map/arch-map.module';
import { BuildApplicationComponent } from './build-application/build-application.component';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { ObjectDataFormComponent } from './object-data-form/object-data-form.component';
import { BuildApplicationRoutingModule } from './build-application-routing.module';
import { AttachmentDocumentsComponent } from './attachment-documents/attachment-documents.component';
import { FilesUploadModule } from '../../components/files-upload/files-upload.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  SignApplicationComponent
} from './sign-application/sign-application.component';
import { ProjectorDataFormComponent } from './projector-data-form/projector-data-form.component';
import { ElectrificationFormComponent } from './electrification-form/electrification-form.component';
import { WaterSupplyFormComponent } from './water-supply-form/water-supply-form.component';
import { SewerageFormComponent } from './sewerage-form/sewerage-form.component';
import { HeatSupplyFormComponent } from './heat-supply-form/heat-supply-form.component';
import { GasSupplyFormComponent } from './gas-supply-form/gas-supply-form.component';
import { ElectricinfoCategoryDescriptionComponent } from
  './electrification-form/electricinfo-category-description/electricinfo-category-description.component';
import { DateAdapter, MAT_DATE_LOCALE, MatSlideToggleModule } from '@angular/material';
import { AppDateAdapter } from '../../shared/helper/format-datepicker';
import { LandProjectorFormComponent } from './land-projector-form/land-projector-form.component';
import { InstructionSiteDesignationComponent } from './object-data-form/instruction-site-designation/instruction-site-designation.component';
import { SelectRegionModule } from '../../components/select-region/select-region.module';
import { NgxPhoneMaskModule } from 'ngx-phone-mask';
import {MatDialogModule} from "@angular/material/dialog";
import {ModalAppSubmitComponent} from "../directory/modal-app-submit/modal-app-submit.component";
import { DialogSubmitApplicationComponent } from './application-form/dialog-submit-application/dialog-submit-application.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ArchMapModule,
        BuildApplicationRoutingModule,
        FilesUploadModule,
        MatProgressBarModule,
        MatSlideToggleModule,
        SelectRegionModule,
        NgxPhoneMaskModule,
        MatDialogModule
    ],
  exports: [
    ReactiveFormsModule,
  ],
  entryComponents: [
    ElectricinfoCategoryDescriptionComponent,
    InstructionSiteDesignationComponent,
    ModalAppSubmitComponent,
    DialogSubmitApplicationComponent
  ],
  declarations: [
    BuildApplicationComponent,
    ApplicationFormComponent,
    ObjectDataFormComponent,
    AttachmentDocumentsComponent,
    SignApplicationComponent,
    ProjectorDataFormComponent,
    ElectrificationFormComponent,
    WaterSupplyFormComponent,
    SewerageFormComponent,
    HeatSupplyFormComponent,
    GasSupplyFormComponent,
    ElectricinfoCategoryDescriptionComponent,
    LandProjectorFormComponent,
    InstructionSiteDesignationComponent,
    ModalAppSubmitComponent,
    DialogSubmitApplicationComponent
  ],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
  ]
})
export class BuildApplicationModule {
}
