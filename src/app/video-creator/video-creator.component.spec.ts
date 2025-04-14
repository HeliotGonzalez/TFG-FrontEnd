import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCreatorComponent } from './video-creator.component';

describe('VideoCreatorComponent', () => {
  let component: VideoCreatorComponent;
  let fixture: ComponentFixture<VideoCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
