import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { VideoManagerService } from '../services/video-manager.service';
import { VideoListComponent } from '../video-list/video-list.component';
import { Video } from '../models/video';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-uploaded-by-my-friends',
  imports: [VideoListComponent],
  templateUrl: './uploaded-by-my-friends.component.html',
  styleUrl: './uploaded-by-my-friends.component.css'
})
export class UploadedByMyFriendsComponent implements OnInit, AfterViewInit{
  videos: Video[] = [];

  constructor(private apiService: ApiService, private videoService: VideoManagerService){

  }

  ngAfterViewInit(): void {
    scrollTo(0,0);
  }

  ngOnInit(): void {
      this.videoService.getMyFriendsVideos().subscribe({
        next: (response: any) => {
          this.videos = response;
        },
        error: (err: any) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al buscar vídeos, inténtelo de nuevo más tarde'
          });
        }
      });
  }
}
