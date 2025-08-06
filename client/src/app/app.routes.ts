import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Playlists } from './pages/playlists/playlists';
import { Playlist } from './pages/playlist/playlist';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'playlists', component: Playlists },
  { path: 'playlist/:id', component: Playlist },
];
