import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DekkCardFrontComponent } from '.';

describe('DekkCardFrontComponent', () => {
  let component: DekkCardFrontComponent;
  let fixture: ComponentFixture<DekkCardFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DekkCardFrontComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DekkCardFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
