import { TestBed } from '@angular/core/testing';

import { VideoManagerService } from '../video-manager.service';

describe('VideoManagerService', () => {
  let service: VideoManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
