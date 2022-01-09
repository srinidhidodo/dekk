import { Component, OnInit } from '@angular/core';
import { PunsConstants } from '../../constants/puns.constants';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  loadingText = '';

  constructor() { }

  ngOnInit(): void {
    this.loadingText = PunsConstants.sessionPun;
  }

}
