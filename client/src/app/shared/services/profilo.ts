import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface ProfiloUtente {
  id: number;
  nome: string;
  email: string;
  sesso: string;
  foto: string | null;
  data_creazione: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProfiloService {
  private apiUrl = 'http://localhost:5000/utenti';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Ottieni dati profilo
  getProfilo(): Observable<ProfiloUtente> {
    return this.http.get<ProfiloUtente>(`${this.apiUrl}/profilo`, {
      headers: this.getHeaders()
    });
  }

  // Aggiorna profilo
  updateProfilo(data: { nome?: string; sesso?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/profilo`, data, {
      headers: this.getHeaders()
    });
  }

  // Upload foto profilo
  uploadFotoProfilo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload-foto-profilo`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    });
  }

  // Ottieni URL completo per la foto
  getFotoUrl(fotoPath: string | null): string {
    if (!fotoPath) {
    return '';
    }

    // Ritorna il path così com'è, Angular lo gestisce da /assets/ in su
    return `http://localhost:5000${fotoPath}`;
  }
}
