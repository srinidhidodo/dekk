import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyMsgDialogComponent } from './study-msg-dialog.component';

describe('StudyMsgDialogComponent', () => {
  let component: StudyMsgDialogComponent;
  let fixture: ComponentFixture<StudyMsgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyMsgDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyMsgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
