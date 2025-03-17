import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class HeaderComponent {
  dropdownOpen = false;

  constructor(public authService: AuthService, private router: Router, private el: ElementRef) {}

  // Abre el dropdown y evita la propagación para que no se cierre inmediatamente.
  openDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.dropdownOpen) {
      this.dropdownOpen = true;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Cierra el dropdown si se hace click fuera del componente
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Si el click se hace fuera del header, cierra el dropdown
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
