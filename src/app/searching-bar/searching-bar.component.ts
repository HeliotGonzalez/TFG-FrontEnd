import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { VideoManagerService } from '../services/video-manager.service';

@Component({
  selector: 'app-searching-bar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './searching-bar.component.html',
  styleUrls: ['./searching-bar.component.css'] 
})
export class SearchingBarComponent {
  wordForm: FormGroup;
  words: any[] = [];
  
  @Input() styleVariant: string = '';
  @Output() searchResults: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private videoManager: VideoManagerService
  ) {
    this.wordForm = this.fb.group({
      word: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    this.apiService.getVideosByWord(this.wordForm.value.word).subscribe({
      next: (response: any) => {
        // Procesamos los datos recibidos
        this.words = response.map((word: any) => {
          if (word.significado?.highest_voted_video) {
            const video = word.significado.highest_voted_video;
            video.embedUrl = this.videoManager.getSafeUrl(this.videoManager.getEmbedUrl(video.url));
          }
          return word;
        });
        // Emitimos los resultados para el componente padre
        this.searchResults.emit(this.words);
      },
      error: (error: any) => {
        console.error('Error al cargar las palabras:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error: '
        });
      }
    });
  }
}
