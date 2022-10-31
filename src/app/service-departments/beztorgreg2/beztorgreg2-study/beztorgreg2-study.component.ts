import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from '../../../services/problem.service';
import { ApplicationService } from '../../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { EditorService } from '../../../services/editor.service';
import { FileService } from '../../../services/file.service';
import { BaseSpecialistComponent } from '../../../departments/architecture/base-specialist/base-specialist.component';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-beztorgreg2-study',
  templateUrl: './beztorgreg2-study.component.html',
  styleUrls: ['./beztorgreg2-study.component.scss']
})
export class Beztorgreg2StudyComponent extends BaseSpecialistComponent implements OnInit {

  constructor(
    public route: ActivatedRoute,
    public taskService: ProblemService,
    public appSvc: ApplicationService,
    public api: ApiService,
    public authService: AuthService,
    public translate: TranslateService,
    public editorSvc: EditorService,
    public fileSvc: FileService,
    public dialog: MatDialog
  ) {
    super(route, taskService, appSvc, authService, translate, editorSvc, fileSvc);
  }

  ngOnInit() { super.ngOnInit(); }

  setTemplate(template) { this.setTemplateToMessage(template); }

  isRegKanc() {  return this.dataTaskDecide.code === 'KANC_REG'; }

  isTemplates() { return this.dataTaskDecide.code === 'TEMPLATE'; }

  isEditor() {
    this.giveTitleValue();
    const hide = [0]; return !hide.includes(+this.dataTaskDecide.order);
  }

  giveTitleValue() {
    if (this.dataTaskDecide.order) {
      this.titleVal = 'orderText'; this.textVal = this.dataTaskDecide.orderText;
    }
  }

  genRegNumberAndDate() {
    this.appSvc.generateRegistrationNumber(this.app.id, {
      numeration: this.dataTaskDecide.number,
      numerationDate: this.dataTaskDecide.date,
      approved: this.task.content.approved
    }).subscribe(res => { this.fileComponent.getAppFiles(this.app.id); });
  }

}
