import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../auth/login/login';
import { Register } from '../auth/register/register';
import { Auth, User } from '../services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, Login, Register],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  currentUser: User | null = null;
  showAuthChoice = false;
  showLogin = false;
  showRegister = false;
  showUserMenu = false;
  
  private userSubscription: Subscription = new Subscription();

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
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
    return this.currentUser?.profilePicture || 'https://via.placeholder.com/40x40/9CA3AF/FFFFFF?text=' + (this.currentUser?.username?.charAt(0).toUpperCase() || 'U');
  }
}
