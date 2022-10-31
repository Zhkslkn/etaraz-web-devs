import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-modal-app-submit',
  templateUrl: './modal-app-submit.component.html',
  styleUrls: ['./modal-app-submit.component.scss']
})
export class ModalAppSubmitComponent implements OnInit {
  @Output() onYes: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    public dialogRef: MatDialogRef<ModalAppSubmitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }
  submitApplication(){
    console.log('child')
    this.onNoClick();
    this.onYes.emit(true);
  }
}
