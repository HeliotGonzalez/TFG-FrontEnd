import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ApiService } from '../services/api.service';
import { WebsocketService } from '../services/websocket-service.service';
import { VideoManagerService } from '../services/video-manager.service';
import { User } from '../services/auth-service.service';
import { Message, UserToMessage} from '../models/message';

interface CachedUserMeta {
  name: string;
  avatar?: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  me = -1;
  searchText = '';
  conversations = new Map<number, Message[]>();
  selectedUserId: number | null = null;
  usersMeta: Record<number, CachedUserMeta> = {};
  unread: Record<number, number> = {};
  friends: User[] = [];

  get conversationList(): Message[] {
    const friendIds = new Set(this.friends.map(f => f.id));
    const latestMsgs = Array.from(this.conversations.values()).map(msgs => msgs[msgs.length - 1]);
    latestMsgs.sort((a, b) => b.ts - a.ts);

    const filtered = latestMsgs.filter(m => {
      const otherId = this.getOtherUserId(m);
      const otherName = this.usersMeta[otherId]?.name ?? '';
      return friendIds.has(otherId) && otherName.toLowerCase().includes(this.searchText.toLowerCase());
    });

    if (this.searchText.trim() && filtered.length === 0) {
      return this.friends.filter(f => f.name.toLowerCase().includes(this.searchText.toLowerCase()))
        .map<UserToMessage>(f => ({
          from: this.me,
          to: f.id,
          text: '',
          ts: 0
        }));
    }

    return filtered;
  }

  constructor(private ws: WebsocketService, private api: ApiService, private vm: VideoManagerService) {
    this.me = this.vm.ensureAuthenticated();
  }

  ngOnInit(): void {
    this.loadFriends();
    this.loadConversationHistory();
    this.subscribeToRealtimeMessages();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadFriends(): void {
    this.api.getFriends(this.me).subscribe({
      next: (friends: any) => {
        this.friends = friends;
        friends.forEach((u: User) => (this.usersMeta[u.id] = { name: u.name }));
      },
      error: err => console.error('Error cargando amigos', err)
    });
  }

  private loadConversationHistory(): void {
    this.api.getMyConversations(this.me).subscribe(rows => {
      rows.forEach(row => this.pushMessage({
        from: row.from,
        to: row.to,
        text: row.message,
        ts: new Date(row.created_at).getTime()
      }));
    });
  }

  private subscribeToRealtimeMessages(): void {
    this.subscriptions.add(
      this.ws.onChatMessage(this.me).subscribe(msg => this.pushMessage(msg))
    );
  }

  /** Añade un mensaje al mapa de conversaciones */
  private pushMessage(msg: Message): void {
    const other = this.getOtherUserId(msg);
    if (!this.conversations.has(other)) this.conversations.set(other, []);
    this.conversations.get(other)!.push(msg);
  }

  /** Devuelve el ID de la otra persona en un mensaje */
  private getOtherUserId(m: Message): number {
    return m.from === this.me ? m.to : m.from;
  }

  /** trackBy para *ngFor */
  trackByTs = (_: number, msg: Message) => msg.ts;

  /** Selección de chat */
  selectChat(userId: number): void {
    if (!this.friends.some(f => f.id === userId)) return; // Seguridad: sólo amigos
    this.selectedUserId = userId;
  }

  /** Envío de nuevo mensaje */
  send(rawText: string): void {
    if (!this.selectedUserId) return;
    const text = rawText.trim();
    if (!text) return;

    this.pushMessage({
      from: this.me,
      to:   this.selectedUserId,
      text,
      ts:   Date.now()
    });

    this.api.sendChatMessage(this.me, this.selectedUserId, text).subscribe({
      error: err => console.error('No se pudo enviar mensaje', err)
    });
  }
}