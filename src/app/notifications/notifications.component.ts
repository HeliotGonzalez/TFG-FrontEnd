import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../services/websocket-service.service';
import { VideoManagerService } from '../services/video-manager.service';
import { ApiService } from '../services/api.service';
import { Notification } from '../models/notification';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FriendServiceService } from '../services/friend-service.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  imports: [CommonModule]
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
    private friendService: FriendServiceService
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
    return this.notifications.filter(n => n.type === 'CHAT');
  }

  ngOnInit(): void {
    // Buscar por peticiones antiguas
    this.getUnacceptedFriendRequests();

    // Escuchar nuevas peticiones en tiempo real
    this.getIncomingFriendRequests();

    // Escuchar por peticiones acpetadas
    this.getAcceptedFriendRequests();

    /*
    this.sub.add(
      this.ws.onChatMessage(this.me).subscribe(chat => {
        this.notifications.push({
          type: 'CHAT',
          from: chat.from,
          payload: { text: chat.text }
        });
      })
    );
    */
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
