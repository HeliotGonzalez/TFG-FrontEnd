import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from './auth-service.service';
import { Video } from '../models/video';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VideoManagerService {
  videos: Video[] = [];

  constructor(private router: Router, private apiService: ApiService, private sanitizer: DomSanitizer, private authService: AuthService) { }

  getVideos(descripcion: string): Observable<Video[]> {
    return this.apiService.getVideos(descripcion, this.ensureAuthenticated()).pipe(
      map((response: any) => {
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
            isInDictionary: video.inDictionary || false,
            didIlikeIt: video.myReaction === 'like',
            didIDislikeIt: video.myReaction === 'dislike',
            authorName: video.user?.username || 'Desconocido',
            nombre: video.palabra
          }));
          console.log('Videos mapeados:', this.videos);
          return this.videos;
        } else {
          console.error('La respuesta no es un arreglo:', response);
          return [];
        }
      }),
      catchError((error) => {
        console.error('Error fetching videos:', error);
        return of([]);
      })
    );
  }

  getPersonalDictionary(): Observable<Video[]> {
    return this.apiService.getPersonalDictionary(this.ensureAuthenticated()).pipe(
      map((response: any) => {
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
            isInDictionary: video.inDictionary || false,
            didIlikeIt: video.myReaction === 'like',
            didIDislikeIt: video.myReaction === 'dislike',
            authorName: video.user?.username || 'Desconocido',
            nombre: video.palabra
          }));
          console.log('Videos mapeados:', this.videos);
          return this.videos;
        } else {
          console.error('La respuesta no es un arreglo:', response);
          return [];
        }
      }),
      catchError((error) => {
        console.error('Error fetching videos:', error);
        return of([]);
      })
    );
  }

  // Verifica que el usuario esté autenticado y redirige en caso contrario.
  public ensureAuthenticated(): number {
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
