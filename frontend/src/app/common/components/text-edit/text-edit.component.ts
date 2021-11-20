import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Editor, toDoc } from 'ngx-editor';
import { toDoc } from 'ngx-editor';


@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.scss']
})
export class TextEditComponent implements OnInit, OnDestroy {

  content = '';

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  checkModel() {
    console.log(toDoc(this.content));
    // console.log(this.content);
  }
}
