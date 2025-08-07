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
    modal.showModal();
  }
}
