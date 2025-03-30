import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Video } from '../models/video';
import { ApiService } from '../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth-service.service';


@Component({
  selector: 'app-video-displayer',
  imports: [CommonModule],
  templateUrl: './video-displayer.component.html',
  styleUrl: './video-displayer.component.css'
})

export class VideoDisplayerComponent {
  descripcion: string = '';
  nombre: string = '';
  videos: Video[] = [];
  liked: { [key: number]: boolean } = {};
  disliked: { [key: number]: boolean } = {};

  constructor(private route: ActivatedRoute, private apiService: ApiService, private sanitizer: DomSanitizer, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.nombre = params['nombre'];
      this.descripcion = params['descripcion'];
    });

    this.getVideos(this.descripcion);
  }

  getVideos(descripcion: string) {
    this.apiService.getVideos(descripcion).subscribe({
      next: (response: any) => {
        console.log('Respuesta de la API:', response);
        if (response && Array.isArray(response)) {
          this.videos = response.map((video: any) => ({
            id: video.id, 
            descripcion: video.significado?.descripcion || '',
            url: video.url,
            embedUrl: this.getSafeUrl(this.getEmbedUrl(video.url)),
            etiquetas: video.significado?.etiquetas ? JSON.parse(video.significado.etiquetas) : [],
            likes: video.likes,
            dislikes: video.dislikes,
            authorName: video.user?.username || 'Desconocido',

          }));
          console.log('Videos mapeados:', this.videos);
        } else {
          console.error('La respuesta no es un arreglo:', response);
        }
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
      }
    });
  }

  toggleLike(id: number): void {
    const ID = this.ensureAuthenticated();
    const video = this.findVideo(id);
    if (!video) return;

    this.updateLikeState(video);
    this.sendVideoReaction(id, video.likes, video.dislikes, true , 'like', ID);
  }
  
  toggleDislike(id: number): void {
    const ID = this.ensureAuthenticated();
    const video = this.findVideo(id);
    if (!video) return;

    this.updateDislikeState(video);
    this.sendVideoReaction(id, video.likes, video.dislikes, false, 'dislike', ID);
  }

  // Verifica que el usuario esté autenticado y redirige en caso contrario.
  private ensureAuthenticated(): number {
    let userID = -1;
    this.authService.currentUser$.subscribe(user => {
        if (!user) this.router.navigate(['/login']);
        if (user) userID = user.id;
    });
    return userID;
  }
  
  // Busca el video por id y retorna el objeto; en caso de no existir, loguea el error.
  private findVideo(id: number): Video | undefined {
    const video = this.videos.find(v => v.id === id);
    if (!video) {
      console.error(`Video con id ${id} no encontrado`);
      return undefined;
    }
    return video;
  }
  
  // Actualiza el estado de "like" del video.
  private updateLikeState(video: Video): void {
    // Inicializa el estado si no existe aún
    if (this.liked[video.id] === undefined) {
      this.liked[video.id] = false;
    }
    if (this.disliked[video.id] === undefined) {
      this.disliked[video.id] = false;
    }

    if (this.liked[video.id]) {
      // Si ya tenía like, se desactiva y se decrementa el contador.
      this.liked[video.id] = false;
      video.likes--;
    } else {
      // Si estaba en dislike, se remueve y se decrementa.
      if (this.disliked[video.id]) {
        video.dislikes--;
        this.disliked[video.id] = false;
      }
      // Activa el like y actualiza el contador.
      this.liked[video.id] = true;
      video.likes++;
    }
  }

  // Actualiza el estado de "dislike" del video.
  private updateDislikeState(video: Video): void {
    // Inicializa el estado si no existe aún
    if (this.liked[video.id] === undefined) {
      this.liked[video.id] = false;
    }
    if (this.disliked[video.id] === undefined) {
      this.disliked[video.id] = false;
    }

    if (this.disliked[video.id]) {
      // Si ya tenía dislike, se desactiva y se decrementa el contador.
      this.disliked[video.id] = false;
      video.dislikes--;
    } else {
      // Si estaba en like, se remueve y se decrementa.
      if (this.liked[video.id]) {
        video.likes--;
        this.liked[video.id] = false;
      }
      // Activa el dislike y actualiza el contador.
      this.disliked[video.id] = true;
      video.dislikes++;
    }
  }
  
  // Envía la reacción a la API según corresponda.
  private sendVideoReaction(id: number, likes: number, dislikes: number, isLike: boolean, action: string, userID: number): void {
    const serviceCall = this.apiService.sendVideoLikes(id, likes, dislikes, action, userID);
  
    serviceCall.subscribe({
      next: (response: any) => {
        console.log(`${isLike ? 'Like' : 'Dislike'} toggled successfully:`, response);
      },
      error: (error: any) => {
        console.error(`Error toggling ${isLike ? 'like' : 'dislike'}:`, error);
      }
    });
  }
  
  /**
   * Transforma una URL normal de YouTube a la URL de embed.
   * Por ejemplo, convierte:
   * https://www.youtube.com/watch?v=VIDEO_ID
   * en:
   * https://www.youtube.com/embed/VIDEO_ID
   */
  getEmbedUrl(url: string): string {
    let videoId = '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      videoId = match[2];
    }
    return 'https://www.youtube.com/embed/' + videoId;
  }
  
  /**
   * Utiliza el sanitizer de Angular para evitar problemas de seguridad con las URLs de vídeo.
   */
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  saveToDictionary(video: Video): void {
    return;
  }

  reportVideo(video: Video): void {
    return;
  }
}
