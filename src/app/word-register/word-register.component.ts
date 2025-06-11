import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router, RouterModule} from '@angular/router';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-word-register',
  imports: [RouterModule],
  templateUrl: './word-register.component.html',
  styleUrl: './word-register.component.css'
})
export class WordRegisterComponent implements AfterViewInit{

  constructor(private apiService: ApiService, private router: Router) {}

  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  registrarPalabra(
    nombre: HTMLInputElement,
    descripcion: HTMLTextAreaElement,
    etiquetas: HTMLInputElement,
  ){
    if(this.compruebaValores(nombre, descripcion, etiquetas)){
      const data = {
        nombre: nombre.value,
        descripcion: descripcion.value,
        etiquetas: etiquetas.value
          .split(/\s*,\s*/)
          .filter(tag => tag !== "")
      };

      this.apiService.storeWord(data).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Palabra registrada',
            text: 'La palabra ha sido registrada con éxito.'
          });
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar la palabra',
            text: 'Ha ocurrido un error al registrar la palabra. Por favor, inténtelo de nuevo.'
          });
        }
      });
    }
  }

  compruebaValores(
    nombre: HTMLInputElement, 
    descripcion: HTMLTextAreaElement, 
    etiquetas: HTMLInputElement
  ): boolean {
    //Comprobar la longitud del campo 'nombre'
    if (!this.checkingLength(nombre, 'nombre', 1)){
      return false;
    }

    if (!this.checkingLength(descripcion, 'descripcion', 10)){
      return false;
    }
  
    // Comprobar que las etiquetas sean un conjunto de palabras separadas por comas
    // Separamos por comas, eliminamos espacios en blanco y filtramos elementos vacíos
    const listaEtiquetas = etiquetas.value.split(",")
      .map(etiqueta => etiqueta.trim())
      .filter(etiqueta => etiqueta.length > 0);
    
    if (listaEtiquetas.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el campo "etiquetas"',
        text: 'El campo "etiquetas" debe contener al menos una palabra separada por coma.'
      });
      return false;
    }
    
    // Si se requiere más validación, se puede recorrer la lista para aplicar más comprobaciones
    return true;
  }

  checkingLength (campo: any, nombre: string, longitud: number){
    if(campo.value.length > 250){
      Swal.fire({
        icon: 'error',
        title: 'Error en el campo',
        text: 'El campo ' + nombre + ' debe ser más corto (250 carácteres).'
      });

      return false;
    } else if (typeof campo.value !== "string" || campo.value.trim() === "" || campo.value.length < longitud){
      Swal.fire({
        icon: 'error',
        title: 'Error en el campo',
        text: 'El campo ' + nombre + ' es un texto vacío o muy corto.'
      });

      return false;
    }
    return true;
  }
}
