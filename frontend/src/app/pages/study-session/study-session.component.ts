import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DekkService } from 'src/app/common/services/dekk-service';
import * as _ from 'lodash';

@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.scss']
})
export class StudySessionComponent implements OnInit {

  selectedDekkId = -1; // -1 indicates default where all dekks are loaded
  dekkDetails: any[];
  
  panelOpenState = false;
  innerpanelOpenState = false;
  panelOpenStates: any = {};
  panelChecked: any = {};
  numCardsToStudy: number = 100;

  constructor(private dekkService: DekkService, private location: Location) { }

  ngOnInit(): void {
    const inputState: any = this.location.getState();
    if (inputState?.selectedDekkId) {
      this.selectedDekkId = inputState.selectedDekkId;
    } else {
      this.selectedDekkId = -1;
    }
    this.loadDekkDetails();
  }

  loadDekkDetails(): void {
    let getDekkDetailsObservable = this.selectedDekkId === -1 ?
      this.dekkService.loadDekkDetails() : this.dekkService.loadDekkDetails(_.toString(this.selectedDekkId));
      
      getDekkDetailsObservable.subscribe((response: any) => {
        if (response?.dekks) {
          this.dekkDetails = response.dekks;
          if (this.dekkDetails.length === 1) {
            this.panelOpenStates[this.dekkDetails[0]?.id] = true;
          }
        }
      });
  }

  disableExpand(dekkDetail: any): boolean {
    if (dekkDetail?.sub_dekks?.length > 0) {
      return false;
    }
    return true;
  }

  select(dekk: any, subDekk?: any, subSubDekk?: any): void {
    if (subSubDekk) {
      subSubDekk.selected = true;
      if (subDekk) {
        subDekk.selected = _.every(subDekk.sub_dekks, (eachDekk: any) => eachDekk.selected);
      }
      if (dekk) {
        dekk.selected = _.every(dekk.sub_dekks, (eachDekk: any) => eachDekk.selected);
      }
      return;
    }

    if (subDekk) {
      subDekk.selected = true;
      subDekk.sub_dekks?.forEach((eachDekk: any) => {
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
        eachDekk.sub_dekks?.forEach((eachSubDekk: any) => {
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
        subDekk.selected = _.every(subDekk.sub_dekks, (eachDekk: any) => eachDekk.selected);
      }
      if (dekk) {
        dekk.selected = _.every(dekk.sub_dekks, (eachDekk: any) => eachDekk.selected);
      }
      return;
    }

    if (subDekk) {
      subDekk.selected = false;
      subDekk.sub_dekks?.forEach((eachDekk: any) => {
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
        eachDekk.sub_dekks?.forEach((eachSubDekk: any) => {
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
}
