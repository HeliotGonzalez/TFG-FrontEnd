import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { VideoListComponent } from '../video-list/video-list.component';
import { ApiService } from '../services/api.service';
import { VideoManagerService } from '../services/video-manager.service';

@Component({
  selector: 'app-recently-uploaded',
  imports: [VideoListComponent],
  templateUrl: './recently-uploaded.component.html',
  styleUrl: './recently-uploaded.component.css'
})
export class RecentlyUploadedComponent implements OnInit, AfterViewInit{
  videos: any[] = [];

  constructor(private apiService: ApiService, private videoManager: VideoManagerService) {}

  ngOnInit(): void {
    this.videoManager.getRecentlyUploadedVideos().subscribe({
      next: (response: any) => {
        this.videos = response;
        console.log('Recently uploaded videos:', this.videos);
      },
      error: (error: any) => {
        console.error('Error fetching recently uploaded videos:', error);
      }
    });
  }

  ngAfterViewInit(): void {
      scrollTo(0, 0); 
  }



}
