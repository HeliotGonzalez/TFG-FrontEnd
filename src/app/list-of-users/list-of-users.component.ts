import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AppUser } from '../models/app-user';
import { Paginated } from '../models/paginated';
import { AuthService } from '../services/auth-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-of-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.css']
})
export class ListOfUsersComponent implements OnInit {
  users: AppUser[] = [];
  meta!: Paginated<AppUser>;

  // estado local
  page   = 1;
  perPage = 10;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void { this.loadPage(1); }

  loadPage(page: number): void {
    this.apiService.getUsers(page, this.perPage).subscribe({
      next: resp => {
        this.users = resp.data;
        this.meta  = resp;
        this.page  = resp.current_page;
      },
      error: err => console.error('Error cargando usuarios:', err)
    });
  }

  banUser(id: any){
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, banear usuario',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.banUser(id, this.authService.getCurrentUser()?.id).subscribe({
          next: resp => {
            console.log('Usuario baneado:', resp);
            this.loadPage(this.page);
          },
          error: err => console.error('Error cargando usuarios:', err)
        });
      }
    });
  }

  get canPrev(): boolean { return !!this.meta?.prev_page_url; }
  get canNext(): boolean { return !!this.meta?.next_page_url; }
}
