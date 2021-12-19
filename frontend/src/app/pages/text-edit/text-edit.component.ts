import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';
// import { Editor, toDoc } from 'ngx-editor';
import { toDoc } from 'ngx-editor';
// import { EventEmitter } from 'stream';

import "tinymce/themes/modern";
import "tinymce/plugins/colorpicker";
import "tinymce";
import { CardUtils } from 'src/app/common/utils/card.utils';
declare var tinymce: any;

@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.scss']
})
export class TextEditComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  content = '';

  @Input() 
  elementId: string;

  editor: any;

  constructor() {}

  ngAfterViewInit() {
    setTimeout(() => {
      tinymce.init({
        selector: '#' + this.elementId,
        menubar: false,
        plugins: "textcolor colorpicker",
        toolbar: "backcolor",
        textcolor_cols: "1",
        textcolor_rows: "1",
        custom_colors: false,
        textcolor_map: [
          CardUtils.DEFAULT_TEXT_HIGHLIGHT_COLOR.slice(1)
        ],
        force_br_newlines : true,
        force_p_newlines : false,
        forced_root_block : '',
        setup: (editor: any) => {
          editor.on('init', (e: any) => {
            editor.setContent(this.content);
          });
        }
      });
  
      tinymce.get('#' + this.elementId).setContent(this.content); 
    }, 1000);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
  }

  constructCardContent(): string {
    return '';
  }

  convertCardContentToPayload(): string {
    let processedText = '';
    toDoc(tinymce.get(this.elementId).getContent())
      ?.content[0]
      ?.content
      ?.forEach((contentComponent: any) => {
        if (contentComponent?.type === 'text') {
          if (contentComponent.marks) {
            processedText += '*' + contentComponent.text + '*';
          } else {
            processedText += contentComponent.text;
          }
        } else if (contentComponent.type === 'hard_break') {
          processedText += '\n';
        }
      }
    );
    return processedText;
  }
}
