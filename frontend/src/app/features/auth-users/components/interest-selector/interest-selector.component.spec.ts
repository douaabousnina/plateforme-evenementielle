import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestSelectorComponent } from './interest-selector.component';

describe('InterestSelectorComponent', () => {
  let component: InterestSelectorComponent;
  let fixture: ComponentFixture<InterestSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
