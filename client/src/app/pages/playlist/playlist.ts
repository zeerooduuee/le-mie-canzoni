import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  addedDate: string;
  coverColor: string;
}

@Component({
  selector: 'app-playlist',
  imports: [CommonModule],
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class Playlist {
  playlist = {
    id: 1,
    name: 'Pop Hits 2024',
    description: 'Le migliori hit pop del 2024 per ogni momento della giornata. Musica fresca e coinvolgente per restare sempre al passo con le tendenze.',
    creator: 'Il Tuo Nome',
    cover: 'assets/images/playlist-cover.jpg',
    totalSongs: 25,
    totalDuration: '1h 30min',
    totalPlays: '2.1M',
    isLiked: false
  };

  songs: Song[] = [
    {
      id: 1,
      title: 'Flowers',
      artist: 'Miley Cyrus',
      album: 'Endless Summer Vacation',
      duration: '3:20',
      addedDate: '5 giorni fa',
      coverColor: 'from-pink-400 to-purple-600'
    },
    {
      id: 2,
      title: 'Anti-Hero',
      artist: 'Taylor Swift',
      album: 'Midnights',
      duration: '3:32',
      addedDate: '1 settimana fa',
      coverColor: 'from-cyan-400 to-blue-600'
    },
    {
      id: 3,
      title: 'As It Was',
      artist: 'Harry Styles',
      album: 'Harry\'s House',
      duration: '2:47',
      addedDate: '2 settimane fa',
      coverColor: 'from-purple-500 to-indigo-600'
    },
    {
      id: 4,
      title: 'Bad Habit',
      artist: 'Steve Lacy',
      album: 'Gemini Rights',
      duration: '3:51',
      addedDate: '3 settimane fa',
      coverColor: 'from-violet-500 to-purple-600'
    },
    {
      id: 5,
      title: 'Unholy',
      artist: 'Sam Smith ft. Kim Petras',
      album: 'Gloria',
      duration: '2:36',
      addedDate: '1 mese fa',
      coverColor: 'from-emerald-500 to-teal-600'
    }
  ];

  currentlyPlaying: number | null = null;
  isPlaying: boolean = false;

  playPlaylist() {
    console.log('Playing playlist:', this.playlist.name);
    this.isPlaying = true;
    if (this.songs.length > 0) {
      this.currentlyPlaying = this.songs[0].id;
    }
  }

  playSong(songId: number) {
    console.log('Playing song ID:', songId);
    this.currentlyPlaying = songId;
    this.isPlaying = true;
  }
}
