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
    modal.showModal();
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
