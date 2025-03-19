import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alfabeto',
  imports: [RouterModule, CommonModule],
  templateUrl: './alfabeto.component.html',
  styleUrl: './alfabeto.component.css'
})
export class AlfabetoComponent {
  // Array con el alfabeto
  letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  currentLetter = 'A';
  NPalabras = 0;

  onLetterClick(letter: string) {
    console.log('Letra seleccionada:', letter);
    this.currentLetter = letter;
  }

  onRegisterWord(){
    return;
  }
}
