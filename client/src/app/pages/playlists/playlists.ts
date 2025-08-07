import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlists',
  imports: [CommonModule],
  templateUrl: './playlists.html',
  styleUrl: './playlists.css'
})
export class Playlists {
  selectedImage: string | null = null;

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  openModal() {
    this.selectedImage = null; // Reset image when opening modal
    const modal = document.getElementById('add_playlist_modal') as HTMLDialogElement;
    modal.classList.add('modal-open');
    modal.showModal();
  }

  closeModal() {
    const modal = document.getElementById('add_playlist_modal') as HTMLDialogElement;
    // Aggiungi attributo per animazione di chiusura
    modal.setAttribute('closing', 'true');
    modal.classList.remove('modal-open');
    
    // Aspetta l'animazione prima di chiudere davvero
    setTimeout(() => {
      modal.close();
      modal.removeAttribute('closing');
    }, 300);
  }

  createPlaylistAndClose() {
    // Qui potresti aggiungere la logica per creare la playlist
    console.log('Creating playlist with image:', this.selectedImage);
    
    // Chiudi con animazione
    this.closeModal();
  }
}
