import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DekkService } from 'src/app/common/services/dekk-service';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { UrlConstants } from 'src/app/common/constants/url.constants';
import { StudyService } from 'src/app/common/services/study.service';
import { MatDialog } from '@angular/material/dialog';
import { StudyMsgDialogComponent } from 'src/app/common/components/study-msg-dialog/study-msg-dialog.component';
import { PopupConstants } from 'src/app/common/constants/popup.constants';

@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.scss']
})
export class StudySessionComponent implements OnInit, OnDestroy {

  selectedDekkId: string|null = null; // null indicates default where all dekks are loaded
  dekkDetails: any[];
  
  panelOpenState = false;
  innerpanelOpenState = false;
  panelOpenStates: any = {};
  panelChecked: any = {};
  numCardsToStudy: string = "100";
  isLoading: boolean = true;

  constructor(private dekkService: DekkService, private location: Location, private router: Router, private studyService: StudyService, private dialog: MatDialog) { }

  ngOnInit(): void {
    const inputState: any = this.location.getState();
    if (inputState?.selectedDekkId) {
      this.selectedDekkId = inputState.selectedDekkId;
    } else {
      this.selectedDekkId = null;
    }
    this.loadDekkDetails();
  }

  ngOnDestroy(): void {
  }

  loadDekkDetails(): void {
    this.isLoading = true;
    let getDekkDetailsObservable = this.selectedDekkId === null ?
      this.dekkService.loadDekkDetails() : this.dekkService.loadDekkDetails(_.toString(this.selectedDekkId));
      
      getDekkDetailsObservable.subscribe((response: any) => {
        if (response) {
          this.dekkDetails = response;
          if (this.selectedDekkId) {
            this.dekkDetails = this.dekkDetails.filter((dekkDetail: any) => _.some(dekkDetail?.sub_dekks, (subDekk: any) => subDekk?.tag_id === this.selectedDekkId));
            if (this.dekkDetails.length > 0) {
              this.dekkDetails[0].sub_dekks = this.dekkDetails[0]?.sub_dekks.filter((subDekk: any) => subDekk?.tag_id === this.selectedDekkId);
            }
          }
          if (this.dekkDetails.length === 1) {
            this.panelOpenStates[this.dekkDetails[0]?.dekk_id] = true;
            if (this.dekkDetails[0].sub_dekks?.length === 1) {
              this.panelOpenStates[this.dekkDetails[0].sub_dekks[0].tag_id] = true;
            }
          }
        }
        setTimeout(() => {
          this.isLoading = false; 
        }, 500);
      }, (error: any) => {
        const dialogRef = this.dialog.open(StudyMsgDialogComponent, {
          data: {
              msg: PopupConstants.SESSION_LOAD_ERROR
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed: ', result);
        });
      });
  }

  disableExpand(dekkDetail: any): boolean {
    if (dekkDetail?.sub_dekks?.length === 0 || dekkDetail?.sub_topics?.length === 0) {
      return true;
    }
    return false;
  }

  select(dekk?: any, subDekk?: any, subSubDekk?: any): void {
    if (subSubDekk) {
      subSubDekk.selected = true;
      if (subDekk) {
        subDekk.selected = _.every(subDekk.sub_topics, (eachDekk: any) => eachDekk.selected);
      }
      if (dekk) {
        dekk.selected = _.every(dekk.sub_dekks, (eachDekk: any) => eachDekk.selected);
      }
      return;
    }

    if (subDekk) {
      subDekk.selected = true;
      subDekk.sub_topics?.forEach((eachDekk: any) => {
        eachDekk.selected = true;
      });
      if (dekk) {
        dekk.selected = _.every(dekk.sub_dekks, (eachDekk: any) => eachDekk.selected);
      }
      return;
    }

    if (dekk) {
      dekk.selected = true;
      dekk.sub_dekks?.forEach((eachDekk: any) => {
        eachDekk.selected = true;
        eachDekk.sub_topics?.forEach((eachSubDekk: any) => {
          eachSubDekk.selected = true;
        });
      });
      return;
    }
  }

  unselect(dekk: any, subDekk?: any, subSubDekk?: any): void {
    if (subSubDekk) {
      subSubDekk.selected = false;
      if (subDekk) {
        subDekk.selected = _.every(subDekk.sub_topics, (eachDekk: any) => eachDekk.selected);
      }
      if (dekk) {
        dekk.selected = _.every(dekk.sub_dekks, (eachDekk: any) => eachDekk.selected);
      }
      return;
    }

    if (subDekk) {
      subDekk.selected = false;
      subDekk.sub_topics?.forEach((eachDekk: any) => {
        eachDekk.selected = false;
      });
      if (dekk) {
        dekk.selected = _.every(dekk.sub_dekks, (eachDekk: any) => eachDekk.selected);
      }
      return;
    }

    if (dekk) {
      dekk.selected = false;
      dekk.sub_dekks?.forEach((eachDekk: any) => {
        eachDekk.selected = false;
        eachDekk.sub_topics?.forEach((eachSubDekk: any) => {
          eachSubDekk.selected = false;
        });
      });
      return;
    }
  }

  checkboxAction(event: any, dekk: any, subDekk?: any, subSubDekk?: any): void {
    if (!event) {
      return;
    }
    event.checked ? this.select(dekk, subDekk, subSubDekk) : this.unselect(dekk, subDekk, subSubDekk);
  }

  stopEventProp(event: any): void {
    event.stopPropagation();
  }

  collectSelectedDekks(): string[] {
    const selectedDekkIds: string[] = [];
    this.dekkDetails?.forEach((dekk: any) => {
      if (dekk.selected) {
        selectedDekkIds.push(dekk.dekk_id);
      } else {
        dekk.sub_dekks?.forEach((subDekk: any) => {
          if (subDekk.selected) {
            selectedDekkIds.push(subDekk.tag_id);
          } else {
            subDekk.sub_topics?.forEach((subSubDekk: any) => {
              if (subSubDekk.selected) {
                selectedDekkIds.push(subSubDekk.tag_id);
              }
            });
          }
        });
      }
    });
    return selectedDekkIds;
  }

  startStudySession(): void {
    this.studyService.selectedIds = this.collectSelectedDekks();
    this.studyService.maxCards = _.parseInt(this.numCardsToStudy);
    this.router.navigate([UrlConstants.STUDY_CARD]);
  }
}
