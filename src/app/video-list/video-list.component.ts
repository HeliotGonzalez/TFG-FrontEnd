import { Component, Input } from '@angular/core';
import { Video } from '../models/video';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth-service.service';
import Swal from 'sweetalert2';
import { VideoManagerService } from '../services/video-manager.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  imports: [CommonModule],
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent {
  @Input() videos: Video[] = [];
  descripcion: string = '';
  nombre: string = '';
  liked: { [key: number]: boolean } = {};
  disliked: { [key: number]: boolean } = {};

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router, private videoManager: VideoManagerService) {}

  toggleLike(id: number): void {
    const userID = this.ensureAuthenticated();
    const video = this.findVideo(id);
    if (!video) return;
    
    this.updateReactionState(video, 'like');
    this.sendVideoReaction(id, video.likes, video.dislikes, true, 'like', userID);
  }
  
  toggleDislike(id: number): void {
    const userID = this.ensureAuthenticated();
    const video = this.findVideo(id);
    if (!video) return;
    
    this.updateReactionState(video, 'dislike');
    this.sendVideoReaction(id, video.likes, video.dislikes, false, 'dislike', userID);
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
  
  private updateReactionState(video: Video, reaction: 'like' | 'dislike'): void {
    if (reaction === 'like') {
      if (video.didIlikeIt) {
        video.didIlikeIt = false;
        video.likes--;
      } else {
        if (video.didIDislikeIt) {
          video.didIDislikeIt = false;
          video.dislikes--;
        }
        video.didIlikeIt = true;
        video.likes++;
      }
    } else if (reaction === 'dislike') {
      if (video.didIDislikeIt) {
        video.didIDislikeIt = false;
        video.dislikes--;
      } else {
        if (video.didIlikeIt) {
          video.didIlikeIt = false;
          video.likes--;
        }
        video.didIDislikeIt = true;
        video.dislikes++;
      }
    }
  }
  
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

  saveToDictionary(video: Video): void {
    this.apiService.storeVideoInDictionary({ videoID: video.id, userID: this.ensureAuthenticated() }).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'El video ha sido guardado en tu diccionario.',
          timer: 2000
        })
        video.isInDictionary = true;
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Guardado',
          text: 'El video no ha podido ser guardado en tu diccionario. Inténtelo más tarde.',
          timer: 2000
        })
      }
    });
    return;
  }

  removeFromDictionary(video: Video){
    this.apiService.deleteVideoFromDictionary({ videoID: video.id, userID: this.ensureAuthenticated() }).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El video ha sido eliminado de tu diccionario.',
          timer: 2000
        })
        video.isInDictionary = false;
      },
      error: (error: any) => {
        console.error('Error al eliminar el video:', error);
        Swal.fire({
          icon: 'error',
          title: 'Eliminado',
          text: 'El video no ha podido ser eliminado de tu diccionario. Inténtelo más tarde.',
          timer: 2000
        })
      }
    });
    return;
  }

  reportVideo(video: Video): void {
    Swal.fire({
      title: 'Razón del reporte',
      input: 'textarea',
      inputLabel: 'Ingresa la razón del reporte',
      inputPlaceholder: 'Escribe aquí la razón...',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar una razón'
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.apiService.reportAVideo({ videoID: video.id, userID: this.ensureAuthenticated(), reason: result.value }).subscribe({
          next: (response: any) => {
            console.log('Respuesta del reporte:', response);
            Swal.fire({
              icon: 'success',
              title: 'Reportado',
              text: 'El video ha sido reportado.',
              timer: 2000
            })
          },
          error: (error: any) => {
            console.error('Error al reportar el video:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El video no ha podido ser reportado. Inténtelo más tarde.',
              timer: 2000
            })
          }
        });
      }
    });
  }

  cancelMyAction(video: Video, action: string){
    this.apiService.cancelMyAction({ videoID: video.id, userID: this.ensureAuthenticated(), action: action }).subscribe({
      next: (response: any) => {
        
        if (action === 'like') {
          video.didIlikeIt = false;
          video.likes--;

        } else if (action === 'dislike') {
          video.didIDislikeIt = false;
          video.dislikes--;
        }
      },
      error: (error: any) => {
        console.error('Error al cancelar la acción:', error);
      }
    });
    return;
  }

  navigateToTheme(tag: string) {
    this.router.navigate(['/themes', tag]);
  }

  goToUserProfile(name: string){
    this.apiService.getUserDataByName(name, this.videoManager.ensureAuthenticated()).subscribe({
      next: (response: any) => {
        let userDataFrom = response.user;
        let userVideosFrom = this.videoManager.mapVideos(response.videos);

        this.router.navigate(['/profile', userDataFrom.id], {state: { userDataFrom, userVideosFrom }});
      },
      error: (err: any) =>{
        console.log(err);
      }
    });
  }

  
}
