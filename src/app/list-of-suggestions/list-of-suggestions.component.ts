import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Suggestion } from '../models/suggestion';
import { Paginated } from '../models/paginated';
import Swal from 'sweetalert2';

@Component({
  selector:   'app-list-of-suggestions',
  standalone: true,
  imports:    [CommonModule],
  templateUrl:'./list-of-suggestions.component.html',
  styleUrls:  ['./list-of-suggestions.component.css']
})
export class ListOfSuggestionsComponent implements OnInit {

  suggestions: Suggestion[] = [];
  meta!: Paginated<Suggestion>;

  page = 1;
  perPage = 10;

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.loadPage(1); }

  loadPage(p: number): void {
    this.api.getSuggestions(p, this.perPage).subscribe({
      next: r => {
        console.log('Sugerencias cargadas:', r.data);
        this.suggestions = r.data;
        this.meta        = r;
        this.page        = r.current_page;
      },
      error: e => console.error('Error cargando sugerencias:', e)
    });
  }

  hideSuggestion(id: number){
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción ocultará la sugerencia y no volverá a ser visible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ocultar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.api.hideSuggestion(id).subscribe({
          next: () => {
            Swal.fire('Ocultada', 'La sugerencia ha sido ocultada correctamente.', 'success');
            this.loadPage(this.page);
          },
          error: e => {
            console.error('Error ocultando sugerencia:', e);
            Swal.fire('Error', 'No se pudo ocultar la sugerencia.', 'error')
          }
        });
      }
    });
  }

  get canPrev(): boolean { return !!this.meta?.prev_page_url; }
  get canNext(): boolean { return !!this.meta?.next_page_url; }
}
