import { Component } from '@angular/core';
import { HeaderVisibilityService } from '../services/header-visibility.service';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  imports: [RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private headerService: HeaderVisibilityService, private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.headerService.hide();
  }

  ngOnDestroy() {
    this.headerService.show();
  }

  obtenerValores(
    nombre: HTMLInputElement,
    username: HTMLInputElement,
    email: HTMLInputElement,
    password: HTMLInputElement,
    Rpassword: HTMLInputElement,
    proveniencia: HTMLSelectElement
  ) {
    // Verificamos que las contraseñas coincidan
    if (password.value !== Rpassword.value) {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar el usuario',
        text: 'Las contraseñas no coinciden.'
      });
      return;
    }
  
    // Preparamos los datos a enviar
    const data = [
      nombre.value,
      username.value,
      email.value,
      password.value,
      proveniencia.value
    ];
  
    // Guardamos el email en una variable para utilizarlo en la verificación OTP
    const userEmail = email.value;
  
    // Llamamos al método storeUser y nos suscribimos al Observable
    this.apiService.storeUser(data).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Verificación de código',
          text: 'Introduce el código que recibiste en tu correo',
          input: 'text',
          inputPlaceholder: 'Código OTP',
          showCancelButton: true,
          confirmButtonText: 'Verificar',
          preConfirm: async (otpCode) => {
            try {
              // Convertimos el Observable a Promise para esperar el resultado
              const response: any = await firstValueFrom(
                this.apiService.verifyOtp({ email: userEmail, otp: otpCode })
              );
              return response;
            } catch (error: any) {
              Swal.showValidationMessage(`Error: ${error.error?.error || error.message}`);
            }
          }
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Cuenta verificada',
              text: result.value.message
            }).then(() => {
              // Redirigimos al usuario a la página de login
              this.router.navigate(['/login']);
            });
          }
        });
      },
      error: (error: any) => {
        let errors: Record<string, string[]> = {};
  
        if (error.error && error.error.errors) {
          errors = error.error.errors;
        } else if (error.error && error.error.error) {
          errors = { general: [error.error.error] };
        } else {
          errors = { general: ['Ha ocurrido un error inesperado'] };
        }
  
        console.log(errors);
        this.showErrors(errors);
      }
    });
  }
  

  // Se muestran los errores obtenidos desde el backend
  showErrors(errors: Record<string, string[]>) {
    let errorMessages = '';
    const translations: Record<string, string> = {
      'The username has already been taken.': 'El nombre de usuario ya está en uso.',
      'The email has already been taken.': 'El correo electrónico ya está en uso.',
      'The password field must be at least 8 characters.': 'La contraseña debe tener al menos 8 caracteres.',
      'The email must be a valid email address.': 'El correo electrónico debe ser válido.'
    };
  
    Object.keys(errors).forEach(field => {
      errors[field].forEach((message: string) => {
        const translatedMessage = translations[message] || message;
        errorMessages += `<li>${translatedMessage}</li>`;
      });
    });
  
    Swal.fire({
      icon: 'error',
      title: 'Error al registrar el usuario',
      html: `<ul style="text-align: left;">${errorMessages}</ul>`
    });
  }
  
}
