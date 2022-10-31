
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { EditorModule } from '../../components/editor/editor.module';
import { ArchMapModule } from '../../components/arch-map/arch-map.module';
import { FilesUploadModule } from '../../components/files-upload/files-upload.module';
import { HeaderArchSpecialistModule } from '../../components/header-arch-specialist/header-arch-specialist.module';
import { ShowApplicationAccordionModule } from 'src/app/components/show-application-accordion/show-application-accordion.module';

import { Beztorgreg2HeaderComponent } from './beztorgreg2-header/beztorgreg2-header.component';
import { Beztorgreg2StudyComponent } from './beztorgreg2-study/beztorgreg2-study.component';
import { ApprovalSheetModule } from 'src/app/components/service-components/approval-sheet/approval-sheet.module';

const routes: Routes = [
  { path: 'study', component: Beztorgreg2StudyComponent }
];
@NgModule({
  declarations: [Beztorgreg2HeaderComponent, Beztorgreg2StudyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule,
    EditorModule,
    ArchMapModule,
    FilesUploadModule,
    HeaderArchSpecialistModule,
    ShowApplicationAccordionModule,
    ApprovalSheetModule
  ]
})
export class Beztorgreg2Module { }
