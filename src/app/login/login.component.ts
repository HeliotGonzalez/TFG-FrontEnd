import { Component } from '@angular/core';
import { HeaderVisibilityService } from '../services/header-visibility.service';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  constructor(private headerService: HeaderVisibilityService, private apiService: ApiService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.headerService.hide();
  }

  ngOnDestroy() {
    this.headerService.show();
  }

  login(
    email: HTMLInputElement,
    password: HTMLInputElement
  ){
    this.apiService.logIn(email.value, password.value).subscribe({
      next: (response: any) => {
        const user: User = response;
        this.authService.setUser(user);
        if (response instanceof Object) this.router.navigate(['/']);
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'Correo o contraseña incorrectos'
        });
      }
    });
    
  }

  async forgotPassword() {
    // 1. Solicitar el correo electrónico y enviar el correo de verificación
    const email = await this.askEmail.call(this);
    if (!email) {
      return; // Cancelado o error en el primer paso
    }
  
    // 2. Solicitar y verificar el código OTP
    const otpValid = await this.verifyOtp.call(this, email);
    if (!otpValid) {
      return; // Cancelado o error en la verificación OTP
    }
  
    // 3. Solicitar al usuario la nueva contraseña
    const newPassword = await this.askNewPassword.call(this);
    if (!newPassword) {
      return; // Cancelado o error al ingresar la contraseña
    }
  
    // 4. Enviar la nueva contraseña al backend para actualizarla
    await this.sendResetPassword.call(this, email, newPassword);
  }

  async askEmail(): Promise<string | null> {
    const { value: email } = await Swal.fire({
      title: 'Introduzca su correo electrónico',
      input: 'email',
      inputPlaceholder: 'Correo electrónico',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      preConfirm: async (email) => {
        try {
          // Se asume que forgotPassword retorna un Observable
          await firstValueFrom(this.apiService.forgotPassword(email));
          return email;
        } catch (error: any) {
          Swal.showValidationMessage(`Error: ${error.error?.error || error.message}`);
          return null;
        }
      }
    });
    return email || null;
  }
  
  async verifyOtp(email: string): Promise<boolean> {
    const { value: otpCode } = await Swal.fire({
      title: 'Verificación de código',
      text: 'Introduce el código que recibiste en tu correo',
      input: 'text',
      inputPlaceholder: 'Código OTP',
      showCancelButton: true,
      confirmButtonText: 'Verificar',
      preConfirm: async (otpCode) => {
        try {
          await firstValueFrom(this.apiService.verifyPasswordOtp(email, otpCode));
          return otpCode;
        } catch (error: any) {
          Swal.showValidationMessage(`Error: ${error.error?.error || error.message}`);
          return null;
        }
      }
    });
    return otpCode ? true : false;
  }
  
  async askNewPassword(): Promise<string | null> {
    const { value: formValues } = await Swal.fire({
      title: 'Restablecer contraseña',
      html:
        '<input id="swal-input1" type="password" class="swal2-input" placeholder="Nueva contraseña">' +
        '<input id="swal-input2" type="password" class="swal2-input" placeholder="Repetir contraseña">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Restablecer',
      preConfirm: () => {
        const password = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('swal-input2') as HTMLInputElement).value;
        if (!password || !confirmPassword) {
          Swal.showValidationMessage('Debe llenar ambos campos');
          return;
        }
        if (password !== confirmPassword) {
          Swal.showValidationMessage('Las contraseñas no coinciden');
          return;
        }
        
        if (password.length < 8) {
          Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres');
          return;
        }

        return { password };
      }
    });
    return formValues?.password || null;
  }
  
  async sendResetPassword(email: string, password: string): Promise<boolean> {
    try {
      await firstValueFrom(this.apiService.resetPassword({ email, password }));
      await Swal.fire({
        icon: 'success',
        title: 'Contraseña restablecida',
        text: 'Su contraseña ha sido actualizada correctamente'
      });
      // Redirigir al usuario, por ejemplo, a la página de login
      this.router.navigate(['/login']);
      return true;
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al restablecer la contraseña',
        text: error.error?.error || error.message
      });
      return false;
    }
  }
}
