import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AulieHeaderArchSpecialistComponent } from './aulie-header-arch-specialist.component';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {FilesUploadModule} from "../files-upload/files-upload.module";



@NgModule({
  declarations: [AulieHeaderArchSpecialistComponent],
  exports: [
    AulieHeaderArchSpecialistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    FilesUploadModule
  ]
})
export class AulieHeaderArchSpecialistModule { }
