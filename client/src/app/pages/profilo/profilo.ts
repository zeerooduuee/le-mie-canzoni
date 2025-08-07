import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfiloService, ProfiloUtente } from '../../shared/services/profilo';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-profilo',
  imports: [CommonModule, FormsModule],
  templateUrl: './profilo.html',
  styleUrl: './profilo.css'
})
export class Profilo implements OnInit {
  selectedProfileImage: string | null = null;
  selectedFile: File | null = null;
  isUploading = false;
  uploadError: string | null = null;
  
  // Dati profilo
  profilo: ProfiloUtente | null = null;
  isLoading = true;
  
  // Form dati
  formData = {
    nome: '',
    email: '',
    sesso: ''
  };

  constructor(
    private profiloService: ProfiloService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfilo();
  }

  loadProfilo(): void {
    this.isLoading = true;
    this.profiloService.getProfilo().subscribe({
      next: (profilo) => {
        this.profilo = profilo;
        this.formData = {
          nome: profilo.nome,
          email: profilo.email,
          sesso: profilo.sesso
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento del profilo:', error);
        this.isLoading = false;
      }
    });
  }

  getFotoProfilo(): string {
    return this.profiloService.getFotoUrl(this.profilo?.foto || null);
  }

  getDataRegistrazione(): string {
    if (!this.profilo?.data_registrazione) return 'Data non disponibile';
    
    const data = new Date(this.profilo.data_registrazione);
    return data.toLocaleDateString('it-IT', { 
      year: 'numeric', 
      month: 'long'
    });
  }

  openPhotoModal() {
    this.selectedProfileImage = null;
    this.selectedFile = null;
    this.uploadError = null;
    const modal = document.getElementById('change_photo_modal') as HTMLDialogElement;
    modal.classList.add('modal-open');
    modal.showModal();
  }

  closePhotoModal() {
    const modal = document.getElementById('change_photo_modal') as HTMLDialogElement;
    modal.setAttribute('closing', 'true');
    modal.classList.remove('modal-open');
    
    setTimeout(() => {
      modal.close();
      modal.removeAttribute('closing');
      this.selectedProfileImage = null;
      this.selectedFile = null;
      this.uploadError = null;
    }, 300);
  }

  onProfileImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validazione file
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.uploadError = 'Formato file non supportato. Usa PNG, JPG, JPEG, GIF o WEBP.';
        return;
      }

      // Validazione dimensione (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.uploadError = 'Il file è troppo grande. Dimensione massima: 5MB.';
        return;
      }

      this.uploadError = null;
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProfileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  savePhotoAndClose() {
    if (!this.selectedFile) {
      this.uploadError = 'Seleziona prima una foto.';
      return;
    }

    this.isUploading = true;
    this.uploadError = null;

    this.profiloService.uploadFotoProfilo(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Foto caricata con successo:', response);
        this.isUploading = false;
        
        // Ricarica i dati del profilo per aggiornare la foto
        this.loadProfilo();
        
        this.closePhotoModal();
      },
      error: (error) => {
        console.error('Errore nell\'upload:', error);
        this.uploadError = error.error?.error || 'Errore durante il caricamento della foto.';
        this.isUploading = false;
      }
    });
  }

  updateProfilo(): void {
    const updateData: any = {};
    
    if (this.formData.nome !== this.profilo?.nome) {
      updateData.nome = this.formData.nome;
    }
    
    if (this.formData.sesso !== this.profilo?.sesso) {
      updateData.sesso = this.formData.sesso;
    }

    if (Object.keys(updateData).length === 0) {
      console.log('Nessuna modifica da salvare');
      return;
    }

    this.profiloService.updateProfilo(updateData).subscribe({
      next: (response) => {
        console.log('Profilo aggiornato:', response);
        this.loadProfilo(); // Ricarica i dati
      },
      error: (error) => {
        console.error('Errore nell\'aggiornamento:', error);
      }
    });
  }
}
