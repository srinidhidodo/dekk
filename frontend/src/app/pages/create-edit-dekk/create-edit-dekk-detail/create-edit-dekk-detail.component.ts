import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { ErrorDialogComponent } from 'src/app/common/components/error-dialog/error-dialog.component';
import { PopupConstants } from 'src/app/common/constants/popup.constants';
import { UrlConstants } from 'src/app/common/constants/url.constants';
import { Dekk } from 'src/app/common/models/dekk';
import { DekkMetadata } from 'src/app/common/models/dekk-metadata';
import { DekkService } from 'src/app/common/services/dekk-service';
import { TagsService } from 'src/app/common/services/tags.service';
import { DekkUtils } from 'src/app/common/utils/dekk-utils';
import { filter, pairwise } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-create-edit-dekk-detail',
  templateUrl: './create-edit-dekk-detail.component.html',
  styleUrls: ['./create-edit-dekk-detail.component.scss']
})
export class CreateEditDekkDetailComponent implements OnInit {

  routeListener: Subscription;

  isLoading: boolean = false;
  currentDekkId: string = '';
  currentDekkName: string = '';
  currentDekk: DekkMetadata = DekkUtils.getEmptyDekkMetadata();

  isFormErrorHidden: boolean = true;

  constructor(public tagsService: TagsService, private router: Router, private activatedRoute: ActivatedRoute, private dekkService: DekkService, private dialog: MatDialog) {
    this.routeListener = this.router.events.subscribe((event) => {
      this.isLoading = true;
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url.split('?')[0];
        if (currentUrl === UrlConstants.CREATE) {
          this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.id) {
              this.currentDekkId = params.id;
              this.dekkService.loadDekkMetadataByDekkId(this.currentDekkId!).subscribe((dekkMetadata: DekkMetadata) => {
                this.currentDekk = dekkMetadata;
                this.currentDekkName = this.currentDekk.dekk_name;
                setTimeout(() => {
                  this.isLoading = false;
                }, 1000);
              });
            } else {
              this.currentDekk = DekkUtils.getEmptyDekkMetadata();
              this.currentDekkId = this.currentDekk.dekk_id;
              this.currentDekkName = this.currentDekk.dekk_name;
              setTimeout(() => {
                this.isLoading = false;
              }, 1000);
            }
          });
        }
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.routeListener.unsubscribe();
  }

  saveDekk(): void {
    if (!this.currentDekkName || this.currentDekkName === '') {
      this.isFormErrorHidden = false;
      return;
    }
    if (this.currentDekkName != this.currentDekk.dekk_name) {
      this.isLoading = true;
      this.dekkService.saveDekkMetadata(this.currentDekkName, this.currentDekkId).subscribe((responseDekk: any) => {
        this.isLoading = false;
        this.router.navigate([UrlConstants.DEKK_EDIT_VIEW], {queryParams: { id: responseDekk?.dekk_id }});
      }, (error: any) => {
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          data: {
              msg: PopupConstants.DEKK_METADATA_SAVE_ERROR
          }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed: ', result);
        });
      });
    } else {
      this.router.navigate([UrlConstants.DEKK_EDIT_VIEW], {queryParams: { id: this.currentDekkId }});
    }
  }
}
