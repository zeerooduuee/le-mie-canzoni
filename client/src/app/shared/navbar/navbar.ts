import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../auth/login/login';
import { Register } from '../auth/register/register';
import { AuthService, User } from '../services/auth';
import { ProfiloService } from '../services/profilo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, Login, Register],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isAuthenticated = false;
  showAuthChoice = false;
  showLogin = false;
  showRegister = false;
  showUserMenu = false;
  
  private userSubscription: Subscription = new Subscription();
  private authSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private profiloService: ProfiloService
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authSubscription = this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    // Subscribe to current user
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      
      // Se l'utente è autenticato ma non ha la foto, carica il profilo completo
      if (user && !user.foto) {
        this.authService.loadUserProfile().subscribe({
          next: () => {
            // I dati del profilo sono stati caricati e l'utente è stato aggiornato automaticamente
          },
          error: (error) => {
            console.error('Errore nel caricamento del profilo:', error);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  openAuthChoice(): void {
    this.showAuthChoice = true;
  }

  closeAuthChoice(): void {
    this.showAuthChoice = false;
  }

  openLogin(): void {
    this.showAuthChoice = false;
    this.showLogin = true;
  }

  openRegister(): void {
    this.showAuthChoice = false;
    this.showRegister = true;
  }

  closeLogin(): void {
    this.showLogin = false;
  }

  closeRegister(): void {
    this.showRegister = false;
  }

  switchToRegister(): void {
    this.showLogin = false;
    this.showRegister = true;
  }

  switchToLogin(): void {
    this.showRegister = false;
    this.showLogin = true;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
  }

  getProfilePicture(): string {
    if (this.currentUser?.foto) {
      return this.profiloService.getFotoUrl(this.currentUser.foto);
    }
    return 'assets/images/ragazza-1.png';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-avatar.png';
  }
}
