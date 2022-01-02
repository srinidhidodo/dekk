import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditSubdekkDetailComponent } from './create-edit-subdekk-detail.component';

describe('CreateEditSubdekkDetailComponent', () => {
  let component: CreateEditSubdekkDetailComponent;
  let fixture: ComponentFixture<CreateEditSubdekkDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditSubdekkDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditSubdekkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
