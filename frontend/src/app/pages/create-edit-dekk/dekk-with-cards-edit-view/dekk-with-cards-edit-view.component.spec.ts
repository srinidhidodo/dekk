import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekkWithCardsEditViewComponent } from './dekk-with-cards-edit-view.component';

describe('DekkWithCardsEditViewComponent', () => {
  let component: DekkWithCardsEditViewComponent;
  let fixture: ComponentFixture<DekkWithCardsEditViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DekkWithCardsEditViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DekkWithCardsEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
