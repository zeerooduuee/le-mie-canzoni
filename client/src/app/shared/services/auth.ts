import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  nome: string;
  foto?: string;
}

export interface LoginResponse {
  token: string;
  nome: string;
  foto?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nome: string;
  sesso: string;
}

export interface LoginData {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<User | null>(this.getUserFromToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res: LoginResponse) => {
        // Save token to localStorage
        localStorage.setItem('token', res.token);
        
        // Update auth status
        this.authStatus.next(true);
        
        // Create user object and save to current user
        const user: User = {
          id: this.getIdFromToken(res.token),
          email: this.getEmailFromToken(res.token),
          nome: res.nome,
          foto: res.foto
        };
        
        this.currentUser.next(user);
        
        // Redirect to dashboard/home
        this.router.navigate(['/']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authStatus.next(false);
    this.currentUser.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      return !isExpired;
    } catch (e) {
      return false;
    }
  }

  private getUserFromToken(): User | null {
    const token = localStorage.getItem('token');
    if (!token || !this.hasToken()) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        nome: payload.nome || '',
        foto: payload.foto
      };
    } catch (e) {
      return null;
    }
  }

  private getIdFromToken(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return 0;
    }
  }

  private getEmailFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email;
    } catch (e) {
      return '';
    }
  }

  // HTTP Interceptor helper
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }
}
