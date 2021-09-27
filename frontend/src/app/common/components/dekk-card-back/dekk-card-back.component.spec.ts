import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DekkCardBackComponent } from './dekk-card-back.component';

describe('DekkCardBackComponent', () => {
  let component: DekkCardBackComponent;
  let fixture: ComponentFixture<DekkCardBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DekkCardBackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DekkCardBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
