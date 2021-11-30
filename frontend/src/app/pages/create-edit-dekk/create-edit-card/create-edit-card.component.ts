import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { toDoc } from 'ngx-editor';
import { Card } from 'src/app/common/models/card';
import { CardEditable } from 'src/app/common/models/card-editable';
import { TagsService } from 'src/app/common/services/tags.service';
import { CardUtils } from 'src/app/common/utils/card.utils';
import { TextEditComponent } from '../../text-edit/text-edit.component';

@Component({
  selector: 'app-create-edit-card',
  templateUrl: './create-edit-card.component.html',
  styleUrls: ['./create-edit-card.component.scss']
})
export class CreateEditCardComponent implements OnInit {

  @ViewChild('cardFront')
  cardFrontEditComponent: TextEditComponent;

  @ViewChild('cardBack')
  cardBackEditComponent: TextEditComponent;

  tags: FormControl;
  tagsList: string[];

  @Input()
  card: CardEditable = CardUtils.getEmptyEditableCard();

  constructor(private tagsService: TagsService) {
    this.tagsService.loadTags().subscribe((tagsData: any) => {
      this.tagsList = tagsData?.tags;
    });
    this.tags = new FormControl
    this.tags.setValue(this.card.tags);
    console.log(this.tags.value);
  }

  ngOnInit(): void {
    this.tags = new FormControl();
  }

  createDekk(): void {
  }

  saveCard(): void {
    this.card.tags = this.tags.value;
    console.log(toDoc(this.cardFrontEditComponent.content));
    console.log(this.cardBackEditComponent.content);
    console.log(this.card.tags);
  }

}
