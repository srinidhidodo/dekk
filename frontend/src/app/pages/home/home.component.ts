import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlConstants } from 'src/app/common/constants/url.constants';
import { Dekk } from 'src/app/common/models/dekk';
import { HomeResponse } from 'src/app/common/models/home-response';
import { HttpClientService } from 'src/app/common/services/http-client.service';
import { StudyService } from 'src/app/common/services/study.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dekks: Dekk[] = [];

  constructor(private httpClientService: HttpClientService, 
    private studyService: StudyService, 
    private userService: UserService,
    private router: Router) {
      if (!this.userService.loggedIn) {
        this.router.navigate([UrlConstants.LANDING]);
      }
    }

  ngOnInit(): void {
    this.httpClientService.get(UrlConstants.HOME_URL, []).subscribe((response: HomeResponse) => {
      this.dekks = response && response.dekk_stats ? response.dekk_stats : [];
    });
  }

  studyDekk(dekkName: string): void {
    this.studyService.selectedTag = dekkName;
    this.router.navigate([UrlConstants.STUDY_CARD]);
  }

  studySessionDekk(dekkId: string): void {
    this.router.navigateByUrl(UrlConstants.STUDY_SESSION, {state: { selectedDekkId: dekkId}});
  }
}
