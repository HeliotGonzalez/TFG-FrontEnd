import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Video } from '../models/video';
import { VideoListComponent } from '../video-list/video-list.component';
import { VideoManagerService } from '../services/video-manager.service';
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

  constructor(private route: ActivatedRoute, private videoManager: VideoManagerService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.nombre = params['nombre'];
      this.descripcion = params['descripcion'];
    });

    this.videoManager.getVideos(this.descripcion).subscribe({
      next: (response: Video[]) => {
        this.videos = response;
      },
      error: (err: any) => {
        console.log('error', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener los vídeos',
          text: 'La carga de vídeos falló. Inténtelo más tarde o contacte con un administrador'
        });
      }
    });
  }
}
