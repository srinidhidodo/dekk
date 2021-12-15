import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UrlConstants } from 'src/app/common/constants/url.constants';
import { Dekk } from 'src/app/common/models/dekk';
import { DekkMetadata } from 'src/app/common/models/dekk-metadata';
import { DekkService } from 'src/app/common/services/dekk-service';
import { TagsService } from 'src/app/common/services/tags.service';
import { DekkUtils } from 'src/app/common/utils/dekk-utils';

@Component({
  selector: 'app-create-edit-dekk-detail',
  templateUrl: './create-edit-dekk-detail.component.html',
  styleUrls: ['./create-edit-dekk-detail.component.scss']
})
export class CreateEditDekkDetailComponent implements OnInit {

  isLoading: boolean = false;
  currentDekkId: string|null;
  currentDekk: DekkMetadata;

  constructor(public tagsService: TagsService, private router: Router, private activatedRoute: ActivatedRoute, private dekkService: DekkService) {
    this.router.events.subscribe((event) => {
      this.isLoading = true;
      if (event instanceof NavigationEnd) {
        this.activatedRoute.queryParams.subscribe((params: any) => {
          if (params.id) {
            this.currentDekkId = params.id;
            this.dekkService.loadDekkMetadataByDekkId(this.currentDekkId!).subscribe((dekkMetadata: DekkMetadata) => {
              this.currentDekk = dekkMetadata;
              setTimeout(() => {
                this.isLoading = false;
              }, 1000);
            });
          } else {
            this.currentDekk = DekkUtils.getEmptyDekkMetadata();
            this.currentDekkId = this.currentDekk.dekk_id;
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    // this.tags = new FormControl();
  }

  createDekk(): void {
    this.router.navigate([UrlConstants.DEKK_EDIT_VIEW]);
  }
}
