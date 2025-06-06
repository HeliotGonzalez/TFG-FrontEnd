import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { VideoManagerService } from '../services/video-manager.service';
import { CommonModule } from '@angular/common';
import { VideoListComponent } from '../video-list/video-list.component';
import { RouterModule, Router, ActivatedRoute} from '@angular/router';
import { FriendServiceService } from '../services/friend-service.service';

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
  isFriend: boolean = false;
  currentUserId!: number;
  profileUserId!: number;
  beingAdded: boolean = false;
  Nfriends: number = 0;

  constructor(
    private apiService: ApiService,
    private videoManager: VideoManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private friendService: FriendServiceService
  ) {
    this.profileUserId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.currentUserId = this.videoManager.ensureAuthenticated();

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as Record<string, any>;

    this.userData = state?.['userDataFrom'];
    this.userVideos = state?.['userVideosFrom'];
    if (this.userData != null) this.State = false;

  }

  get formattedDate(): string {
    if (!this.userData?.created_at) return '';
    const d = new Date(this.userData.created_at);
    
    return d.toLocaleDateString('es', {
      day:   'numeric',
      month: 'long',
      year:  'numeric'
    });
  }

  ngOnInit(): void {
    if (this.State){
      this.apiService.getUserData(this.currentUserId, this.profileUserId).subscribe({
        next: (response: any) => {
          console.log(response);
          this.userData = response.user;
          this.userVideos = this.videoManager.mapVideos(response.videos);
          this.Nfriends = response.NAmigos;
          console.log(this.userVideos, this.userData);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }

    // Comprueba que se haya aceptado nada desde notificacions
    this.checkAcceptViaNotificacions();

    // Compruba que se haya rechazado vía notificacions
    this.checkDenyViaNotificacions();

    this.amIBeingAddedByOwner();
  }

  checkAcceptViaNotificacions(){
    this.friendService.accepted$.subscribe(({ from, to }) => {
      if (from === this.profileUserId && to === this.currentUserId) {
        this.beingAdded = false;
        this.isFriend   = true;
      }
    });
  }

  checkDenyViaNotificacions(){
    this.friendService.rejected$.subscribe(({ from, to }) => {
      if (from === this.profileUserId && to === this.currentUserId) {
        this.beingAdded = false;
        this.isFriend   = false;
      }
    });
  }

  sendFriendRequest(){
    this.apiService.sendFriendRequest(this.currentUserId, this.profileUserId).subscribe({
      next: (response: any) => {
        this.isFriend = !this.isFriend
        console.log(response);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  amIBeingAddedByOwner(){
    this.apiService.amIBeingAddedByOwner(this.profileUserId, this.currentUserId).subscribe({
      next: (response: any) => {
        if (response.being_added == true) this.beingAdded = response.being_added;
        else this.isMyFriend();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  isMyFriend(){
    this.apiService.isMyFriend(this.profileUserId, this.currentUserId).subscribe({
      next: (response: any) => {
        console.log('Respuesta: ', response);
        if (response.accepted == true) this.isFriend = true;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  accept(){
    this.friendService.accept(this.profileUserId, this.currentUserId, this.userData.username);
    this.beingAdded = false;
  }

  deny(){
    this.friendService.deny(this.profileUserId, this.currentUserId, this.userData.username);
    this.beingAdded = false;
  }
}
