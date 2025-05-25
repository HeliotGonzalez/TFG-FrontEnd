import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'send-suggestion.component.html',
  styleUrls: ['send-suggestion.component.css']
})
export class SendSuggestionComponent implements OnInit {
  suggestionForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.suggestionForm = this.fb.group({
      content: [ '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]
      ],
    });
  }

  /**
   * Envía la sugerencia al backend y muestra un mensaje de éxito.
   */
  onSubmit(): void {
    if (this.suggestionForm.invalid) {
      this.suggestionForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.submitted = false;


    this.apiService.sendSuggestion(this.suggestionForm.value.content).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
        this.suggestionForm.reset();
        Swal.fire({
          title: '¡Sugerencia enviada!',
          text: 'Gracias por tu sugerencia, la tendremos en cuenta.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (err) => {
        console.error('Error enviando sugerencia', err);
        this.loading = false;
        Swal.fire({
          title: 'Hubo un error',
          text: 'Hubo un problema al enviar tu sugerencia. Por favor, inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });

  }
}
