import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service.service';
import { VideoManagerService } from '../services/video-manager.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class HeaderComponent {
  dropdownOpen = false;
  menuOpen = false;
  userID: number = 0;
  activeRoute: string = '';

  constructor(public authService: AuthService, private router: Router, private el: ElementRef, private videoManager: VideoManagerService) {
    this.userID = this.videoManager.ensureAuthenticated();
  }

  goTo(route: string){
    if (route == 'homepage') this.activeRoute = '';
    this.activeRoute = route;
    this.router.navigate([route]);
    this.dropdownOpen = false;
    this.menuOpen = false;
  }

  openDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.dropdownOpen) {
      this.dropdownOpen = true;
    }
  }

  logout(): void {
    this.authService.logout();
    this.dropdownOpen = false;
    this.menuOpen     = false;
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
