import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-img-modal',
  templateUrl: './upload-img-modal.component.html',
  styleUrls: ['./upload-img-modal.component.scss']
})
export class UploadImgModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UploadImgModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router) { }

  file: File;
  fileUploaded = false;

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpload(): void {
    this.data.callback(this.data.cardId);
    this.dialogRef.close();
  }

  onFileSelected($event: any): void {
    console.log($event);
    if ($event?.target?.files?.length > 0) {
      this.file = $event.target.files[0];
      this.fileUploaded = true;
      console.log(this.file);
    }
  }

  getFileName(): string {
    if (this.file?.name) {
      return this.file.name;
    }
    return '';
  }

  removeFile(): void {
    this.fileUploaded = false;
  }
}
