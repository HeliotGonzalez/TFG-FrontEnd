import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertStatsComponent } from './expert-stats.component';

describe('ExpertStatsComponent', () => {
  let component: ExpertStatsComponent;
  let fixture: ComponentFixture<ExpertStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
