import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'single-dekk',
  templateUrl: './single-dekk.component.html',
  styleUrls: ['./single-dekk.component.scss'],
})
export class SingleDekkComponent implements OnInit {

  @Input()
  dekkName = '';

  @Input()
  numOfCardsInDekk = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
