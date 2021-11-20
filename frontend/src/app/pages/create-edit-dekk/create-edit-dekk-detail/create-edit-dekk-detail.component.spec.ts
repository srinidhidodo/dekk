import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditDekkDetailComponent } from './create-edit-dekk-detail.component';

describe('CreateEditDekkDetailComponent', () => {
  let component: CreateEditDekkDetailComponent;
  let fixture: ComponentFixture<CreateEditDekkDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditDekkDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditDekkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
