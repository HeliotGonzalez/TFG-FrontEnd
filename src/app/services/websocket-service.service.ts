import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, timer, Subscription } from 'rxjs';
import { filter, takeUntil, switchMap } from 'rxjs/operators';
import { FriendRequest } from '../models/friend-request';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VideoManagerService } from './video-manager.service';

@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {
  private socket!: WebSocket;
  private destroy$ = new Subject<void>();
  private heartbeatTimer$!: Subscription;
  private reconnectAttempts = 0;

  public messages$ = new Subject<any>();
  public status$   = new BehaviorSubject<'CONNECTING'|'OPEN'|'CLOSED'|'ERROR'>('CLOSED');

  constructor(private videoManager: VideoManagerService) {
    this.connect(this.videoManager.ensureAuthenticated());
  }

  public connect(userId: number) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(`ws://localhost:8765/?user=${userId}`);
    this.status$.next('CONNECTING');

    this.socket.onopen = () => {
      this.status$.next('OPEN');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
    };
    
    this.socket.onmessage = ({ data }) => {
      try {
        this.messages$.next(JSON.parse(data));
        console.log('[WS RECEIVE]', data);
      } catch {
        console.warn('WS: invalid JSON', data);
      }
    };
    this.socket.onerror = () => this.status$.next('ERROR');
    this.socket.onclose = () => {
      this.status$.next('CLOSED');
      this.stopHeartbeat();
      // reconexión con back-off
      const delay = Math.min(30000, 1000 * 2**this.reconnectAttempts++);
      setTimeout(() => this.connect(userId), delay);
    };
  }

  /** envía heartbeats para no desconectarnos por inactividad */
  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer$ = timer(20000, 20000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: 'heartbeat' }));
        }
      });
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer$) this.heartbeatTimer$.unsubscribe();
  }

  public onFriendRequest(me: number): Observable<FriendRequest> {
    return this.messages$.pipe(
      filter(msg => msg.type === 'friend_request' && msg.to === me),
      map(msg => ({from: msg.from, status: msg.status}))
    );
  }

  public onAcceptedFriendRequest(me: number): Observable<FriendRequest> {
    return this.messages$.pipe(
      filter(msg => msg.type === 'friend-accepted' && msg.to === me),
      map(msg => ({from: msg.from, status: msg.status}))
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopHeartbeat();
    if (this.socket) this.socket.close();
  }
}
