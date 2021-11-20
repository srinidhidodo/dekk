import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TagsService } from 'src/app/common/services/tags.service';

@Component({
  selector: 'app-create-edit-card',
  templateUrl: './create-edit-card.component.html',
  styleUrls: ['./create-edit-card.component.scss']
})
export class CreateEditCardComponent implements OnInit {

  tags: FormControl;
  tagsList: string[];

  constructor(private tagsService: TagsService) {
    this.tagsService.loadTags().subscribe((tagsData: any) => {
      this.tagsList = tagsData?.tags;
    });
  }

  ngOnInit(): void {
    this.tags = new FormControl();
  }

  createDekk(): void {
  }

}
