import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDisplayerComponent } from './video-displayer.component';

describe('VideoDisplayerComponent', () => {
  let component: VideoDisplayerComponent;
  let fixture: ComponentFixture<VideoDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoDisplayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
