import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Playlists } from './pages/playlists/playlists';
import { Playlist } from './pages/playlist/playlist';
import { Profilo } from './pages/profilo/profilo';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { 
    path: 'playlists', 
    component: Playlists,
    canActivate: [AuthGuard]
  },
  { 
    path: 'playlist', 
    component: Playlist,
    canActivate: [AuthGuard]
  },
  { 
    path: 'profilo', 
    component: Profilo,
    canActivate: [AuthGuard]
  },
  // Redirect any unknown paths to home
  { path: '**', redirectTo: '' }
];
