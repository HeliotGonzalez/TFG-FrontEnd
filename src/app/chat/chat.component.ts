import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import { WebsocketService } from '../services/websocket-service.service';
import { VideoManagerService } from '../services/video-manager.service';
import { User } from '../services/auth-service.service';
import { Message, UserToMessage} from '../models/message';
import { Router } from '@angular/router';

interface CachedUserMeta {
  name: string;
  avatar?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private pendingSelectId?: number;
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
          read: 1,
          ts: 0
        }));
    }

    return filtered;
  }

  constructor(private ws: WebsocketService, private api: ApiService, private vm: VideoManagerService, private router: Router, private location: Location) {
    this.me = this.vm.ensureAuthenticated();
    const navState = (this.router.getCurrentNavigation()?.extras.state || this.location.getState()) as
      { chatWith?: number; chatWithName?: string };

    if (navState?.chatWith) {
      this.pendingSelectId = navState.chatWith;
      if (navState.chatWithName) {
        this.usersMeta[navState.chatWith] = { name: navState.chatWithName };
      }
    }
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

        if (this.pendingSelectId && friends.some((f: User) => f.id === this.pendingSelectId)) {
          this.selectChat(this.pendingSelectId);
          this.pendingSelectId = undefined;
        }
      },
      error: err => console.error('Error cargando amigos', err)
    });
  }

  private loadConversationHistory(): void {
    this.api.getMyConversations(this.me).subscribe(rows => {
      console.log(rows);
      rows.forEach(row => this.pushMessage({
        id:   row.id,
        from: row.from,
        to: row.to,
        text: row.message,
        read: row.read,
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

    // 1) Guarda el mensaje en la conversación
    if (!this.conversations.has(other)) {
      this.conversations.set(other, []);
    }
    this.conversations.get(other)!.push(msg);

    // 2) Si proviene de “otro” y NO está abierto ese chat:
    if (msg.from !== this.me && msg.read === 0 && other !== this.selectedUserId) {
      this.unread[other] = (this.unread[other] || 0) + 1;
      return;
    }

    // 3) Si proviene de “otro” y SÍ está abierto ese chat:
    //    en ese caso, si read === 0, lo marcamos como leído
    if (msg.from !== this.me && msg.read === 0 && other === this.selectedUserId) {
      console.log('Aquí');
      this.markRead(other);
      return;
    }
  }

  /** Devuelve el ID de la otra persona en un mensaje */
  private getOtherUserId(m: Message): number {
    return m.from === this.me ? m.to : m.from;
  }

  /** trackBy para *ngFor */
  trackByTs = (_: number, msg: Message) => msg.ts;

  /** Selección de chat */
  selectChat(userId: number): void {
    if (!this.friends.some(f => f.id === userId)) return;
    this.selectedUserId = userId;

    // Marca todos los no leídos con ese usuario
    this.markRead(userId);
  }

  /** Marca como leídos todos los mensajes pendientes con userId */
  private markRead(otherId: number): void {
    const conv = this.conversations.get(otherId);
    if (!conv) return;

    // 1) Actualiza UI
    conv.forEach(m => { if (m.read === 0) m.read = 1; });
    this.unread[otherId] = 0;

    // 2) Notifica al backend
    this.api.markChatAsRead(this.me, otherId).subscribe({
      error: err => console.error('No se pudieron marcar como leídos', err)
    });
    
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
      read: 0,
      ts:   Date.now()
    });

    this.api.sendChatMessage(this.me, this.selectedUserId, text).subscribe({
      error: err => console.error('No se pudo enviar mensaje', err)
    });
  }
}