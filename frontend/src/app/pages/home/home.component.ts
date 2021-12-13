import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlConstants } from 'src/app/common/constants/url.constants';
import { Dekk } from 'src/app/common/models/dekk';
import { HomeResponse } from 'src/app/common/models/home-response';
import { DekkService } from 'src/app/common/services/dekk-service';
import { HttpClientService } from 'src/app/common/services/http-client.service';
import { StudyService } from 'src/app/common/services/study.service';
import { UserService } from 'src/app/common/services/user.service';
import { CardUtils } from 'src/app/common/utils/card.utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dekks: Dekk[] = [];
  selectedMasterDekkId: string|null = null;
  selectedMasterDekk: any = CardUtils.getWaitCard();

  constructor(private httpClientService: HttpClientService, 
    private studyService: StudyService, 
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dekkService: DekkService) {
      if (!this.userService.loggedIn) {
        this.router.navigate([UrlConstants.LANDING]);
      }
      this.activatedRoute.queryParams.subscribe(params => {
        if (params.id) {
          this.selectedMasterDekkId = params.id;
        }
      });
    }

  ngOnInit(): void {
    if (this.selectedMasterDekkId) {
      this.dekkService.loadDekkDetails(this.selectedMasterDekkId).subscribe((response: any) => {
        this.dekks = [];
        if (response) {
          this.selectedMasterDekk = response.filter((dekk: any) => dekk.dekk_id === this.selectedMasterDekkId)[0];
          if (this.selectedMasterDekk.sub_dekks) {
            this.selectedMasterDekk.sub_dekks.forEach((subDekk: any) => {
              this.dekks.push({
                total_cards: subDekk.cards_count,
                tag_name: subDekk.tag_name,
                tag_id: subDekk.tag_id,
                field: subDekk.tag_name,
                is_master_topic: false
              });
            });
          }
        }

        if (this.dekks.length === 0) {
          this.studySessionDekk(this.selectedMasterDekkId!);
        }
      });
    } else {
      this.httpClientService.get(UrlConstants.HOME_URL, []).subscribe((response: HomeResponse) => {
        this.dekks = response && response.dekk_stats ? response.dekk_stats : [];
      });
    }
  }

  selectDekk(dekkId: string): void {
    if (!this.selectedMasterDekkId) {
      this.router.navigate([UrlConstants.HOME], {queryParams: { id: dekkId }})
        .then(() => { window.location.reload(); });
    } else {
      this.studySessionDekk(dekkId);
    }
  }

  studyDekk(dekkId: string): void {
    this.studyService.selectedIds = [dekkId];
    this.studyService.maxCards = -1;
    this.router.navigate([UrlConstants.STUDY_CARD]);
  }

  studySessionDekk(dekkId: string): void {
    this.router.navigateByUrl(UrlConstants.STUDY_SESSION, {state: { selectedDekkId: dekkId }});
  }
}