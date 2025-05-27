import { AfterViewInit, Component, OnInit } from '@angular/core';
import { VideoManagerService } from '../services/video-manager.service';
import { ApiService } from '../services/api.service';
import { Video } from '../models/video';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cheking-videos',
  imports: [CommonModule, FormsModule],
  templateUrl: './cheking-videos.component.html',
  styleUrl: './cheking-videos.component.css'
})
export class ChekingVideosComponent implements OnInit, AfterViewInit  {
  videos: Video[] = [];
  showComment: boolean = false;
  action: string = 'none';
  activeVideo: Video | null = null;
  activeAction: 'accept' | 'deny' | null = null;
  commentText: string = '';

  constructor(private videoManager: VideoManagerService, private apiService: ApiService) { }

  ngOnInit(): void {
      this.videoManager.getVideosUncorrected(this.videoManager.ensureAuthenticated()).subscribe({
        next: (response: Video[]) => {
          this.videos = response;
        },
        error: (error: any) =>{
          console.error('Error al cargar los videos:', error);
        }
      });
  }

  ngAfterViewInit(): void {
      scrollTo(0, 0);
  }

  openComment(video: Video, action: 'accept' | 'deny'): void {
    if (this.activeVideo?.id === video.id && this.activeAction === action) {
      this.activeVideo  = null;
      this.activeAction = null;
      this.commentText  = '';
      return;
    }

    this.activeVideo  = video;
    this.activeAction = action;
    this.commentText  = '';
  }

  sendDecision(): void {
    if (!this.activeVideo || !this.activeAction) { return; }

    const payload = {
      videoId : this.activeVideo.id,
      action  : this.activeAction,
      comment : this.commentText.trim()
    };

    console.log('Enviando decisión:', payload);

    this.apiService.correctVideo(payload).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Decisión enviada',
          text: `La decisión ha sido enviada correctamente.`,
          showConfirmButton: true,
          timer: 2000
        }).then(() => {
          this.videos = this.videos.filter(video => video.id !== this.activeVideo?.id);
          this.activeVideo  = null;
          this.activeAction = null;
          this.commentText  = '';
        });
      },
      error: (error: any) => {
        console.error('Error al enviar la decisión:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar la decisión. Por favor, inténtalo de nuevo más tarde.',
          showConfirmButton: true
        });
      }
    });


  }
}
