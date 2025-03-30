import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}
  
  storeUser(data: string[]) {
    return this.http.post(`${this.apiUrl}/register`, { data });
  }

  logIn(email: string, password: string) {
    return this.http.get(`${this.apiUrl}/login/${email}/${password}`);
  }

  verifyOtp(payload: { email: string, otp: string }) {
    return this.http.post(`${this.apiUrl}/verificar-otp`, { data: [payload.email, payload.otp] });
  } 

  verifyPasswordOtp(email: string, otp: string) {
    return this.http.get(`${this.apiUrl}/verificar-otp-password/${email}/${otp}`); 
  }

  forgotPassword(email: string) {
    return this.http.get(`${this.apiUrl}/forgot-password/${email}`);
  }

  resetPassword(payload: { email: string, password: string }) {
    return this.http.post(`${this.apiUrl}/reset-password`, { data: [payload.email, payload.password] });
  }

  storeWord(data: { nombre: string; descripcion: string; etiquetas: string[] }) {
    return this.http.post(`${this.apiUrl}/registerWord`, data);
  }

  getWords(letter: string){
    return this.http.get(`${this.apiUrl}/getWords/${letter}`);
  }

  getVideos(descripcion: string){
    return this.http.get(`${this.apiUrl}/getVideos/${descripcion}`);
  }

  sendVideoLikes(id: number, likes: number, dislikes: number, action: string, userID: number) {
    const data = { id, likes, dislikes, action, userID };
    console.log(data);
    return this.http.post(`${this.apiUrl}/videoLikes`, {data});
  }
    
}
