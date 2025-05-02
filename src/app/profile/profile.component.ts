import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { VideoManagerService } from '../services/video-manager.service';
import { CommonModule } from '@angular/common';
import { VideoListComponent } from '../video-list/video-list.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, VideoListComponent, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  userData: any = null;
  userVideos: any[] = [];
  userID: number = 0;

  constructor(private apiService: ApiService, private videoManager: VideoManagerService){
    this.userID = this.videoManager.ensureAuthenticated();
  }

  ngOnInit(): void {
    this.apiService.getUserData(this.videoManager.ensureAuthenticated(), this.userID).subscribe({
        next: (response: any) => {
          this.userData = response.user;
          this.userVideos = this.videoManager.mapVideos(response.videos);
          console.log(this.userVideos, this.userData);
        },
        error: (err: any) => {
          console.log(err);
        }
    });
  }
}
