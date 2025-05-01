import { AfterViewInit, Component, OnInit } from '@angular/core';
import { VideoManagerService } from '../services/video-manager.service';
import { Video } from '../models/video';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-videos-corrected',
  imports: [CommonModule],
  templateUrl: './my-videos-corrected.component.html',
  styleUrl: './my-videos-corrected.component.css'
})
export class MyVideosCorrectedComponent implements OnInit, AfterViewInit{

  videos: Video[] = [];
  constructor(private videoManager: VideoManagerService){}

  ngOnInit(): void {
      this.videoManager.getVideosCorrected().subscribe({
        next: (response: Video[]) => {
          this.videos = response;
        },
        error: (error: any) => {
          console.error('Error al cargar los videos:', error);
        }
      });
  }

  ngAfterViewInit(): void {
      scrollTo(0, 0);
  }


}
