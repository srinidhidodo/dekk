import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDekkComponent } from './single-dekk.component';

describe('SingleDekkComponent', () => {
  let component: SingleDekkComponent;
  let fixture: ComponentFixture<SingleDekkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleDekkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDekkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
