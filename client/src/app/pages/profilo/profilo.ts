import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profilo',
  imports: [CommonModule],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css'
})
export class Profilo {
  selectedProfileImage: string | null = null;

  openPhotoModal() {
    this.selectedProfileImage = null; // Reset image when opening modal
    const modal = document.getElementById('change_photo_modal') as HTMLDialogElement;
    modal.classList.add('modal-open');
    modal.showModal();
  }

  closePhotoModal() {
    const modal = document.getElementById('change_photo_modal') as HTMLDialogElement;
    // Aggiungi attributo per animazione di chiusura
    modal.setAttribute('closing', 'true');
    modal.classList.remove('modal-open');
    
    // Aspetta l'animazione prima di chiudere davvero
    setTimeout(() => {
      modal.close();
      modal.removeAttribute('closing');
    }, 300);
  }

  savePhotoAndClose() {
    // Qui potresti aggiungere la logica per salvare la foto
    console.log('Saving photo:', this.selectedProfileImage);
    
    // Chiudi con animazione
    this.closePhotoModal();
  }

  onProfileImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProfileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
