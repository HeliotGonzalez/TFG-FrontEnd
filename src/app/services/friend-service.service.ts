import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Notification } from '../models/notification';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FriendServiceService {

  constructor(private apiService: ApiService) { }

    acceptFriend(request: Notification, me: number) {
      this.apiService.acceptFriend(request.from, me).subscribe({
        next: (response: any) => {
          console.log('Amistad: ', response);
          Swal.fire({
            icon: 'success',
            title: 'Aceptado con éxito',
            text: `Ahora ${request.fromName} y tú sois amigos`
          });
        }, 
        error: (err: any) => {
          console.log('Amistad error: ', err);
          Swal.fire({
            icon: 'error',
            title: 'Ha sucedido un error',
            text: `Ha sucedido un error, inténtelo más tarde`
          });
        }
      });
    }

    dismiss(request: any, me: number) {
      this.apiService.denyRequest(request.from, me).subscribe({
        next: (response: any) => {
          console.log('Rechazo: ', response);
          Swal.fire({
            icon: 'success',
            title: 'Rechazado con éxito',
            text: `Se ha rechazado la solicitud de ${request.fromName}`
          });
        }, 
        error: (err: any) => {
          console.log('Rechazo error: ', err);
          Swal.fire({
            icon: 'error',
            title: 'Ha sucedido un error',
            text: `Ha sucedido un error, inténtelo más tarde`
          });
        }
      });
    }

    accept(from: number, me: number, name: String) {
      this.apiService.acceptFriend(from, me).subscribe({
        next: (response: any) => {
          console.log('Rechazo: ', response);
          Swal.fire({
            icon: 'success',
            title: 'Aceptado con éxito',
            text: `Ahora ${name} y tú sois amigos`
          });
        }, 
        error: (err: any) => {
          console.log('Rechazo error: ', err);
          Swal.fire({
            icon: 'error',
            title: 'Ha sucedido un error',
            text: `Ha sucedido un error, inténtelo más tarde`
          });
        }
      });
    }

    deny(from: number, me: number, name: String) {
      this.apiService.denyRequest(from, me).subscribe({
        next: (response: any) => {
          console.log('Rechazo: ', response);
          Swal.fire({
            icon: 'success',
            title: 'Rechazado con éxito',
            text: `Se ha rechazado la solicitud de ${name}`
          });
        }, 
        error: (err: any) => {
          console.log('Rechazo error: ', err);
          Swal.fire({
            icon: 'error',
            title: 'Ha sucedido un error',
            text: `Ha sucedido un error, inténtelo más tarde`
          });
        }
      });
    }
}
