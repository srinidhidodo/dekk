import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/common/components/error-dialog/error-dialog.component';
import { PopupConstants } from 'src/app/common/constants/popup.constants';
import { UrlConstants } from 'src/app/common/constants/url.constants';
import { DekkMetadata } from 'src/app/common/models/dekk-metadata';
import { DekkService } from 'src/app/common/services/dekk-service';
import { TagsService } from 'src/app/common/services/tags.service';
import { DekkUtils } from 'src/app/common/utils/dekk-utils';

@Component({
  selector: 'app-create-edit-subdekk-detail',
  templateUrl: './create-edit-subdekk-detail.component.html',
  styleUrls: ['./create-edit-subdekk-detail.component.scss']
})
export class CreateEditSubdekkDetailComponent implements OnInit, OnDestroy {

  routeListener: Subscription;
  locationListener: Subscription;

  isLoading: boolean = false;
  isFormErrorHidden: boolean = true;
  masterDekkId: string = '';
  masterDekkName: string = '';
  currentDekkId: string = '';
  currentDekkName: string = '';
  currentDekk: DekkMetadata = DekkUtils.getEmptyDekkMetadata();

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private dekkService: DekkService, private dialog: MatDialog) {
    this.routeListener = this.router.events.subscribe((event) => {
      this.isLoading = true;
      if (event instanceof NavigationEnd) {
        this.locationListener = this.activatedRoute.queryParams.subscribe(params => {
          if (params.id) {
            this.masterDekkId = params.id;
            this.loadMasterDekk();
          } else {
            this.handleSaveSubdekkError(PopupConstants.DEKK_METADATA_LOAD_ERROR);
          }
        });
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      this.routeListener.unsubscribe();
      this.locationListener.unsubscribe();
  }

  loadMasterDekk(): void {
    this.isLoading = true;
    this.dekkService.loadDekkDetails(this.masterDekkId).subscribe((response: any) => {
      this.masterDekkName = response?.filter((dekk: any) => dekk.dekk_id === this.masterDekkId)[0]?.dekk_name;
      this.isLoading = false;
    }, (error: any) => {
      this.handleSaveSubdekkError(PopupConstants.DEKK_METADATA_LOAD_ERROR);
    });
  }

  saveSubdekk(): void {
    if (!this.currentDekkName || this.currentDekkName === '') {
      this.isFormErrorHidden = false;
      return;
    }

    this.isLoading = true;
    this.dekkService.saveSubdekk(this.masterDekkId, this.currentDekkName).subscribe((responseDekk: any) => {
      this.isLoading = false;
      this.router.navigate([UrlConstants.HOME], {queryParams: { id: this.masterDekkId }});
    }, (error: any) => {
      this.handleSaveSubdekkError(PopupConstants.SUBDEKK_METADATA_SAVE_ERROR);
    });
  }

  handleSaveSubdekkError(errorMsg: string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: {
          msg: errorMsg
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed: ', result);
    });
  }
}
