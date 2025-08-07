import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../auth/login/login';
import { Register } from '../auth/register/register';
import { AuthService, User } from '../services/auth';
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authSubscription = this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    // Subscribe to current user
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
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
    return this.currentUser?.foto || 'assets/images/default-avatar.png';
  }
}
