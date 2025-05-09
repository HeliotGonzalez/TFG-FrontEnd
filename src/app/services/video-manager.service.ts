import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from './auth-service.service';
import { Video } from '../models/video';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VideoManagerService {
  videos: Video[] = [];

  constructor(private router: Router, private apiService: ApiService, private sanitizer: DomSanitizer, private authService: AuthService) { }

  private handleVideosStream(stream$: Observable<any>, fuente: string): Observable<Video[]> {
    return stream$.pipe(
      tap(response => console.log(`Respuesta de ${fuente}:`, response)),
      map((response: any) => Array.isArray(response)
        ? this.mapVideos(response)
        : []),
      catchError(error => {
        console.error(`Error en ${fuente}:`, error);
        return of([]);
      })
    );
  }

  public mapVideos(raw: any[]): Video[] {
    return raw.map(video => ({
      id:               video.id,
      descripcion:      video.significado?.descripcion  || '',
      url:              video.url,
      embedUrl:         this.getSafeUrl(this.getEmbedUrl(video.url)),
      etiquetas:        (video.significado?.etiquetas ?? [])
                          .map((tag: any) => ({ nombre: tag.nombre })),
      likes:            video.likes,
      dislikes:         video.dislikes,
      isInDictionary:   video.inDictionary  || false,
      didIlikeIt:       video.myReaction === 'like',
      didIDislikeIt:    video.myReaction === 'dislike',
      authorName:       video.user?.username  || 'Desconocido',
      nombre:           video.palabra,
      comentario: video.comentario || '',
    }));
  }

  getVideos(descripcion: string): Observable<Video[]> {
    const stream$ = this.apiService.getVideos(descripcion, this.ensureAuthenticated());
    return this.handleVideosStream(stream$, 'getVideos');
  }

  getPersonalDictionary(): Observable<Video[]> {
    const stream$ = this.apiService.getPersonalDictionary(this.ensureAuthenticated());
    return this.handleVideosStream(stream$, 'getPersonalDictionary');
  }

  testYourself(): Observable<Video[]> {
    const stream$ = this.apiService.testYourself(this.ensureAuthenticated());
    return this.handleVideosStream(stream$, 'testYourself');
  }

  getVideosUncorrected(): Observable<Video[]> {
    const stream$ = this.apiService.getVideosUncorrected();
    return this.handleVideosStream(stream$, 'getVideosUncorrected');
  }

  getVideosCorrected(): Observable<Video[]> {
    const stream$ = this.apiService.getVideosCorrected(this.ensureAuthenticated());
    return this.handleVideosStream(stream$, 'getVideosCorrected');
  }

  getRecentlyUploadedVideos(): Observable<Video[]> {
    const stream$ = this.apiService.getRecentlyUploadedVideos(this.ensureAuthenticated());
    return this.handleVideosStream(stream$, 'getRecentlyUploadedVideos');
  }

  getVideosByThemes(tags: string[]): Observable<Video[]> {
    const stream$ = this.apiService.getVideosByThemes(this.ensureAuthenticated(), tags);
    return this.handleVideosStream(stream$, 'getVideosByThemes');
  }

  getMyFriendsVideos(): Observable<Video[]>{
    const stream$ = this.apiService.getMyFriendsVideos(this.ensureAuthenticated());
    return this.handleVideosStream(stream$, 'getMyFriendsVideos');
  }


  // Verifica que el usuario esté autenticado y redirige en caso contrario.
  public ensureAuthenticated(): number {
    let userID = -1;
    this.authService.currentUser$.subscribe(user => {
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
