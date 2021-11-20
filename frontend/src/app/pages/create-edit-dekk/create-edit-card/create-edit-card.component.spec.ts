import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditCardComponent } from './create-edit-card.component';

describe('CreateEditCardComponent', () => {
  let component: CreateEditCardComponent;
  let fixture: ComponentFixture<CreateEditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
