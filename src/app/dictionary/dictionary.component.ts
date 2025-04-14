import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth-service.service';
import { Video } from '../models/video';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AfterViewInit } from '@angular/core';
import { VideoListComponent } from '../video-list/video-list.component';
import { FormsModule } from '@angular/forms';
import { VideoManagerService } from '../services/video-manager.service';
import { Etiqueta } from '../models/etiqueta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dictionary',
  imports: [VideoListComponent, FormsModule],
  templateUrl: './dictionary.component.html',
  styleUrl: './dictionary.component.css'
})
export class DictionaryComponent implements OnInit, AfterViewInit {
  videos: Video[] = [];
  userID: number = -1;
  searchTag: string = '';
  searchName: string = '';
  sortDirection: 'asc' | 'desc' = 'desc';  // Valor por defecto (puedes cambiarlo)
  originalVideos: Video[] = [];

  constructor(private apiService: ApiService, private videoManager: VideoManagerService, private authService: AuthService, private router: Router, private sanitizer: DomSanitizer) {
    this.userID = this.videoManager.ensureAuthenticated();
  }

  ngOnInit(): void {
    this.getPersonalDictionary();
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0); 
  }

  getPersonalDictionary(): void{
    this.videoManager.getPersonalDictionary().subscribe({
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

  applyAdvancedFilters(): void {
    // Si originalVideos aún no se ha asignado, guardamos el listado original
    if (!this.originalVideos.length) {
      this.originalVideos = [...this.videos];
    }
    
    // Iniciar filtrado con el listado original
    let filtered = this.originalVideos;
  
    // Filtrar por etiqueta (si se ingresó texto en el input correspondiente)
    if (this.searchTag && this.searchTag.trim() !== '') {
      filtered = filtered.filter(video =>
        // Se asume que 'etiquetas' es un arreglo de strings
        video.etiquetas && video.etiquetas.some((tag: Etiqueta) =>
          tag.nombre.toLowerCase().includes(this.searchTag.toLowerCase())
        )
      );
    }
  
    // Filtrar por nombre (si se ingresó texto en el input correspondiente)
    if (this.searchName && this.searchName.trim() !== '') {
      filtered = filtered.filter(video =>
        video.nombre && video.nombre.toLowerCase().includes(this.searchName.toLowerCase())
      );
    }
    
    // Ordenar según la dirección seleccionada (por cantidad de likes)
    filtered.sort((a, b) => {
      return this.sortDirection === 'asc'
        ? a.likes - b.likes
        : b.likes - a.likes;
    });
    
    // Asignamos el listado filtrado a la propiedad videos
    this.videos = filtered;
  }

  // Método para actualizar el criterio de ordenamiento
  onSortChange(event: any): void {
    this.sortDirection = event.target.value;
    this.applyAdvancedFilters();
  }
}
