import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { VideoManagerService } from '../services/video-manager.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-video-creator',
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './video-creator.component.html',
  styleUrl: './video-creator.component.css'
})
export class VideoCreatorComponent implements OnInit {
  @Input() significado: string = '';
  videoForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private videoManager: VideoManagerService, private route: ActivatedRoute, private location: Location) {
    this.videoForm = this.fb.group({
      videoUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      corregir: [false]
    });
  }

  ngOnInit(): void {
    this.significado = this.route.snapshot.params['significado'] || '';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.videoForm.valid) {
      this.apiService.storeVideo(this.videoForm.value.videoUrl, this.videoForm.value.corregir, this.significado, this.videoManager.ensureAuthenticated()).subscribe({
        next: (response) => {
          console.log('Video stored successfully:', response);
          Swal.fire({
            icon: 'success',
            title: 'Video almacenado',
            text: 'El video ha sido almacenado correctamente.',
            timer: 1500
          }).then(() => {
            this.location.back();
          });
        },
        error: (error) => {
          console.error('Error storing video:', error);
          Swal.fire({
            icon: 'error',
            title: 'Video no almacenado',
            text: 'El video no ha sido almacenado correctamente.',
            timer: 1500
          })
        }
      });
    }
  }

}
