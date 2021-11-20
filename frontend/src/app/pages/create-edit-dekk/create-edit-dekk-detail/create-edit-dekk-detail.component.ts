import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UrlConstants } from 'src/app/common/constants/url.constants';
import { TagsService } from 'src/app/common/services/tags.service';

@Component({
  selector: 'app-create-edit-dekk-detail',
  templateUrl: './create-edit-dekk-detail.component.html',
  styleUrls: ['./create-edit-dekk-detail.component.scss']
})
export class CreateEditDekkDetailComponent implements OnInit {

  tags: FormControl;
  tagsList: string[];

  constructor(private tagsService: TagsService, private router: Router) {
    this.tagsService.loadTags().subscribe((tagsData: any) => {
      this.tagsList = tagsData?.tags;
    });
  }

  ngOnInit(): void {
    this.tags = new FormControl();
  }

  createDekk(): void {
    this.router.navigate([UrlConstants.DEKK_EDIT_VIEW]);
  }
}
