import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyDekkComponent } from './why-dekk.component';

describe('WhyDekkComponent', () => {
  let component: WhyDekkComponent;
  let fixture: ComponentFixture<WhyDekkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyDekkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyDekkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
