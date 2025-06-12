import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service.service';
import { VideoManagerService } from '../services/video-manager.service';
import { WebsocketService } from '../services/websocket-service.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterModule, CommonModule],
})
export class HeaderComponent {
  dropdownOpen = false;
  menuOpen = false;
  userID: number = 0;
  activeRoute: string = '';

  constructor(public authService: AuthService, private router: Router, private el: ElementRef, private videoManager: VideoManagerService, private websocketService: WebsocketService) {
    this.userID = this.videoManager.ensureAuthenticated();
  }

  goTo(route: string){
    if (route == 'homepage') this.activeRoute = '';
    this.activeRoute = route;
    this.router.navigate([route]);
    this.dropdownOpen = false;
    this.menuOpen = false;
  }

  search(){
    this.router.navigate(['/words-by-search']);
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
    this.websocketService.disconnect();
    this.dropdownOpen = false;
    this.menuOpen     = false;
    window.location.reload();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
