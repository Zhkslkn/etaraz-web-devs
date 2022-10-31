import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-dialog-submit-application',
  templateUrl: './dialog-submit-application.component.html',
  styleUrls: ['./dialog-submit-application.component.scss']
})
export class DialogSubmitApplicationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogSubmitApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }
  submitApplication(){
    this.dialogRef.close(`name`);
  }
}
