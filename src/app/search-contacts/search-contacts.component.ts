import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { VideoManagerService } from '../services/video-manager.service';
import { User } from '../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-search-contacts',
  imports: [CommonModule, RouterModule],
  templateUrl: './search-contacts.component.html',
  styleUrl: './search-contacts.component.css'
})
export class SearchContactsComponent implements OnInit, AfterViewInit{

  users: User[] = [];

  constructor(private apiService: ApiService, private videoService: VideoManagerService, private router: Router){}

  ngAfterViewInit(): void {
      scrollTo(0, 0);
  }

  ngOnInit(): void {
      this.apiService.getNotFriendsUsers(this.videoService.ensureAuthenticated()).subscribe({
        next: (response: any) => {
          console.log(response);
          this.users = response;
        },
        error: (err: any) => {
          console.log('Error: ', err);
        }
      });
  }

  goToUserProfile(ID: number){
    this.apiService.getUserData(ID, this.videoService.ensureAuthenticated()).subscribe({
      next: (response: any) => {
        console.log(response);
        let userDataFrom  = response.user;
        let userVideosFrom = this.videoService.mapVideos(response.videos);
        this.router.navigate(['/profile', ID], {state: { userDataFrom, userVideosFrom }});
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'warning',
          title: 'Hubo algún error',
          text: 'El error fue: ' + err
        });
      }
    });
  }
}
