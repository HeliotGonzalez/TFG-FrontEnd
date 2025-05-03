import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { VideoManagerService } from '../services/video-manager.service';
import { CommonModule } from '@angular/common';
import { VideoListComponent } from '../video-list/video-list.component';
import { RouterModule, Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, VideoListComponent, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userData: any = null;
  userVideos: any = null;
  State: boolean = true;
  userID: number = 0;

  constructor(
    private apiService: ApiService,
    private videoManager: VideoManagerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userID = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as Record<string, any>;

    this.userData = state?.['userDataFrom'];
    this.userVideos = state?.['userVideosFrom'];
    if (this.userData != null) this.State = false;

  }

  ngOnInit(): void {

    if (this.State){
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
}
