import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../services/websocket-service.service';
import { VideoManagerService } from '../services/video-manager.service';
import { ApiService } from '../services/api.service';
import { Notification } from '../models/notification';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule} from '@angular/router';
import { FriendServiceService } from '../services/friend-service.service';
import { EMPTY, filter, map, startWith, switchMap, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [CommonModule, RouterModule]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  me: number = -1;
  notifications: Notification[] = [];

  panelOpen = false;
  private sub = new Subscription();

  constructor(
    private ws: WebsocketService,
    private videoManager: VideoManagerService,
    private apiService: ApiService,
    private router: Router,
    private friendService: FriendServiceService,
  ) {
    this.me = this.videoManager.ensureAuthenticated();
  }

  /** cuántas no leídas */
  get unreadCount(): number {
    return this.notifications.length;
  }

  /** helpers para filtrar por tipo */
  get friendRequests() {
    return this.notifications.filter(n => n.type === 'FRIEND_REQUEST');
  }

  get acceptedFriendRequests(): Notification[] {
    return this.notifications.filter(n => n.type === 'FRIEND_ACCEPTED');
  }

  get chats() {
    return this.notifications.filter(n => n.type === 'chat');
  }

  get videosCorrected() {
    return this.notifications.filter(n => n.type === 'VIDEO_CORRECTED');
  }

  ngOnInit(): void {
    this.getUnacceptedFriendRequests();
    this.getIncomingFriendRequests();
    this.getAcceptedFriendRequests();
    this.checkAcceptViaProfile();
    this.checkDenyViaProfile();
    this.checkRealTimeMessages();
    this.getRealTimeVideoCorrected();
    this.getUnseenVideosCorrected();
  }

  getUnseenVideosCorrected(){
    this.apiService.getUnseenVideosCorrected(this.me).subscribe({
      next: (response: any) => {
        if (response && response.length > 0){
          this.notifications.push({
            type: 'VIDEO_CORRECTED',
            from: this.me,
            fromName: '',
            payload: { },
            extraData: ''
          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching unseen videos corrected:', err);
      }
    });
  }

  getRealTimeVideoCorrected(){
    this.sub.add(
      this.ws.onVideoCorrected(this.me).subscribe((video: any) => {
        const userId = video.user_id ?? video.from ?? video.userId;
        const videoId = video.id ?? video.videoId;
        this.apiService.getUserData(userId, this.me).subscribe({
          next: (res: any) => {
            this.notifications.push({
              type: 'VIDEO_CORRECTED',
              from: userId,
              fromName: res.user.name,
              payload: { videoId: videoId, status: video.status },
              extraData: res
            });
          },
          error: err => console.error('Error fetching user data:', err)
        });
      })
    );
  }
  
  checkRealTimeMessages() {
    this.sub.add(
      this.router.events.pipe(startWith(null as unknown as NavigationEnd), filter(ev => ev === null || ev instanceof NavigationEnd),
        map(() => !this.router.url.startsWith('/chat')),
        distinctUntilChanged(),
        switchMap(shouldNotify => shouldNotify
            ? this.ws.onChatMessage(this.me)   
            : EMPTY
        )
      ).subscribe(chat => {
        const otherId = chat.from === this.me ? chat.to : chat.from;
        this.apiService.getUserData(otherId, this.me).subscribe({
          next: (res: any) => this.notifications.push({
            type: 'chat',
            from: otherId,
            fromName: res.user.name,
            payload: { text: chat.text },
            extraData: res
          }),
          error: err => console.error('Error fetching user data:', err)
        });
      })
    );
  }


  getIncomingFriendRequests(){
    this.sub.add(
      this.ws.onFriendRequest(this.me).subscribe(req => {
        this.apiService.getUserData(req.from, this.me).subscribe({
          next: (response: any) => {
            this.notifications.push({
              type: 'FRIEND_REQUEST',
              from: req.from,
              fromName: response.user.name,
              payload: { status: req.status },
              extraData: response
            });
          },
          error: (err: any) => {
            console.log('Error en notificaciones: ', err);
          }
        });
      })
    );
  }

  getUnacceptedFriendRequests(){
    this.apiService.getPendingFriendRequest(this.me).subscribe({
      next: (response: any) => {
        const amigos: any[] = response.amigos;
        for(const amigo of amigos){
          console.log('AMIGO:', amigo);
          this.notifications.push({
            type: 'FRIEND_REQUEST',
            from: amigo.user_id,
            fromName: amigo.user.name,
            payload: { status: amigo.status },
            extraData: amigo
          });
        }
      },
      error: (err: any) => {

      }
    });
  }

  getAcceptedFriendRequests(){
    this.sub.add(
      this.ws.onAcceptedFriendRequest(this.me).subscribe(req => {
        this.apiService.getUserData(req.from, this.me).subscribe((res: any) => {
          this.notifications.push({
            type: 'FRIEND_ACCEPTED',
            from: req.from,
            fromName: res.user.name,
            payload: { status: req.status },
            extraData: res
          });
        });
      })
    );
  }

  goToUserProfile(request: any){
    let userDataFrom = request.extraData.user;
    let userVideosFrom = this.videoManager.mapVideos(request.extraData.videos);

    this.router.navigate(['/profile', userDataFrom.id], {state: { userDataFrom, userVideosFrom }});
  }

  checkAcceptViaProfile(){
    this.sub.add(
      this.friendService.accepted$.subscribe(({ from }) => {
        this.notifications = this.notifications.filter(n => !(n.type === 'FRIEND_REQUEST' && n.from === from));
      })
    );
  }

  checkDenyViaProfile(){
    this.sub.add(
      this.friendService.rejected$.subscribe(({ from }) => {
        this.notifications = this.notifications.filter(n => !(n.type === 'FRIEND_REQUEST' && n.from === from));
      })
    );
  }

  /** cerrar panel al pinchar fuera */
  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement;
    if (this.panelOpen && !target.closest('.notif-container')) {
      this.panelOpen = false;
    }
  }

  acceptFriend(request: Notification) {
    this.notifications = this.notifications.filter(n => !(n.type === 'FRIEND_REQUEST' && n.from === request.from));
    this.friendService.acceptFriend(request, this.me);
  }

  dismiss(request: any) {
    this.notifications = this.notifications.filter(x => x !== request);
    this.friendService.dismiss(request, this.me);
  }

  dismissA(request: any) {
    this.notifications = this.notifications.filter(x => x !== request);
  }

  deleteVideoCorrected(){
    this.notifications = this.notifications.filter(n => n.type !== 'VIDEO_CORRECTED');
  }

  goToChat(chat: Notification){
    this.router.navigate(['/chat'], { state: { chatWith: chat.from, chatWithName: chat.fromName } });
    this.dismissA(chat);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
