import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChekingVideosComponent } from './cheking-videos.component';

describe('ChekingVideosComponent', () => {
  let component: ChekingVideosComponent;
  let fixture: ComponentFixture<ChekingVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChekingVideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChekingVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
