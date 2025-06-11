import { Component, Input, OnInit} from '@angular/core';
import { Palabra } from '../models/palabra';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-word-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css'
})
export class WordListComponent implements OnInit {
  @Input() words: Palabra[] = [];
  NPalabras: number = -1;
  wordLimit: number = 5;

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['words']) {
      this.words = navigation.extras.state['words'];
      this.NPalabras = this.words.length;
    } else if (this.words.length > 0) {
      this.NPalabras = this.words.length;
    }
  }

  editMeaning(word: Palabra): void {
    let userID = this.authService.getCurrentUser()?.id || 0;
    if (userID === 0){
      this.router.navigate(['/login']);
    }

    Swal.fire({
      title: 'Editar significado',
      input: 'textarea',
      inputAttributes: { rows: '4', spellcheck: 'true' },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false, 
      preConfirm: (nuevoSignificado) => {
        if (!nuevoSignificado?.trim()) {
          Swal.showValidationMessage('El significado no puede estar vacío');
          return false; 
        }
        this.apiService.updateWord(word.nombre, userID, nuevoSignificado.trim(), word.significado.descripcion ).subscribe({
          next: () => {
            Swal.fire('¡Significado propuesto!', 'Será comprobado por un administrador', 'success');
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            console.error('Error al actualizar el significado:', err);
            Swal.showValidationMessage(`Error al actualizar: ${err.message || 'Error desconocido'}`);
            return false;
          }
        });
        return nuevoSignificado.trim();
      },
      allowOutsideClick: () => !Swal.isLoading() // no cerrar mientras carga
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire('¡Actualizado!', '', 'success');
      }
    });
  }

  loadMore(): void {
    this.wordLimit += 5;
  }
}
