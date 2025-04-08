import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Video } from '../models/video';
import { ApiService } from '../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth-service.service';
import { VideoListComponent } from '../video-list/video-list.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-video-displayer',
  imports: [CommonModule, VideoListComponent],
  templateUrl: './video-displayer.component.html',
  styleUrl: './video-displayer.component.css'
})

export class VideoDisplayerComponent {
  nombre: string = '';
  descripcion: string = '';
  videos: Video[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService, private sanitizer: DomSanitizer, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.nombre = params['nombre'];
      this.descripcion = params['descripcion'];
    });

    this.getVideos(this.descripcion);
  }

  getVideos(descripcion: string) {
    this.apiService.getVideos(descripcion, this.ensureAuthenticated()).subscribe({
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
            isInDictionary:  video.inDictionary|| false,
            didIlikeIt: video.myReaction === 'like',
            didIDislikeIt: video.myReaction === 'dislike',
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

  
  // Verifica que el usuario esté autenticado y redirige en caso contrario.
  private ensureAuthenticated(): number {
    let userID = -1;
    this.authService.currentUser$.subscribe(user => {
        if (!user) this.router.navigate(['/login']);
        if (user) userID = user.id;
    });
    return userID;
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

 
}
