import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  members =[{ 
      name: 'Heliot', 
      role: 'Desarrollador Full-Stack', 
      avatar: 'heliot.jpg' 
    }];


}
