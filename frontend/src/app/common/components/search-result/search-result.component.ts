import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../../models/card';
import { StudyService } from '../../services/study.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  @Input()
  card: Card;

  constructor(public studyService: StudyService, private router: Router) { }

  ngOnInit(): void {
  }

  getTags(): string[] {
    return _.keys(this.card.tags);
  }

  openCard(): void {
    this.studyService.card = this.card;
    this.router.navigate(['/card-view-details']);
  }

}
