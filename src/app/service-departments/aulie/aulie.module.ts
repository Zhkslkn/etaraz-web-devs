import { AulieRoutingModule } from './aulie-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';

import {ArchMapModule} from '../../components/arch-map/arch-map.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatSortModule} from '@angular/material/sort';

import {FilesUploadModule} from '../../components/files-upload/files-upload.module';
import {HeaderArchSpecialistModule} from '../../components/header-arch-specialist/header-arch-specialist.module';
import {ShowApplicationAccordionModule} from '../../components/show-application-accordion/show-application-accordion.module';
import {EditorModule} from '../../components/editor/editor.module';
import {IdentifyService} from '../../services/identify.service';
import {OrgTableModule} from '../../components/org-table/org-table.module';
import { AulieAtaComponent } from './aulie-ata/aulie-ata.component';
import {AulieHeaderArchSpecialistModule} from "../../components/aulie-header-arch-specialist/aulie-header-arch-specialist.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ArchMapModule,
    NgxPaginationModule,
    MatSortModule,
    HeaderArchSpecialistModule,
    AulieHeaderArchSpecialistModule,
    FilesUploadModule,
    ShowApplicationAccordionModule,
    EditorModule,
    OrgTableModule,
    AulieRoutingModule,
    EditorModule,
  ],
  entryComponents: [
  ],
  declarations: [
  AulieAtaComponent,
  ],
  providers: [
    IdentifyService
  ]
})
export class AulieModule {
}
