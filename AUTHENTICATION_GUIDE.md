# Sistema di Autenticazione - Le Mie Canzoni

## Panoramica
Ho implementato un sistema completo di autenticazione con design bianco e pulito nella navbar per l'applicazione "Le Mie Canzoni". Il sistema include:

- **Navbar con design bianco**: Navbar pulita e moderna con sfondo bianco e accenti viola
- **Popup di scelta iniziale**: Quando l'utente non è autenticato, può cliccare "Accedi" nella navbar
- **Modal di Login**: Form per l'accesso con email e password (design bianco)
- **Modal di Registrazione**: Form per creare un nuovo account (design bianco)
- **Gestione profilo utente**: Visualizzazione della foto profilo e menu dropdown nella navbar quando autenticato
- **JWT Token Management**: Gestione automatica dei token JWT per le API

## Componenti Implementati

### 1. Auth Service (`src/app/shared/services/auth.ts`)
- Gestione login/logout
- Archiviazione e verifica JWT token
- Observable per lo stato dell'utente
- Interfacce TypeScript per User, LoginRequest, RegisterRequest

### 2. Navbar Component (`src/app/shared/navbar/`)
- **Design bianco e pulito**: Sfondo bianco con blur effect
- **Logo con icona musicale**: Logo con icona animata viola
- **Bottone "Accedi"** quando non autenticato (outline viola)
- **Profilo utente** con foto e menu dropdown quando autenticato
- **Menu dropdown** con opzioni Profilo, Impostazioni e Logout

### 3. Login Component (`src/app/shared/auth/login/`)
- **Design bianco**: Modal con sfondo bianco e bordi sottili
- Form reattivo con validazione
- Campi con focus ring viola
- Gestione errori con sfondo rosso chiaro
- Switch per passare alla registrazione

### 4. Register Component (`src/app/shared/auth/register/`)
- **Design bianco**: Modal con sfondo bianco coerente
- Form reattivo con validazione
- Controllo password match
- Gestione errori
- Switch per passare al login

### 5. HTTP Interceptor (`src/app/shared/interceptors/auth.interceptor.ts`)
- Aggiunge automaticamente il token JWT alle richieste HTTP
- Configurato nell'app.config.ts

## Design e Colori

### Navbar:
- **Sfondo**: Bianco semi-trasparente con blur effect
- **Testo**: Grigio scuro (#374151)
- **Accenti**: Viola (#7c3aed) per icone e bottoni
- **Hover**: Grigio chiaro per gli effetti hover

### Modali:
- **Sfondo**: Bianco puro
- **Bordi**: Grigio chiaro (#e5e7eb)
- **Focus**: Ring viola sui campi input
- **Bottoni**: Viola solido per azioni primarie
- **Errori**: Sfondo rosso chiaro con testo rosso scuro

## Funzionalità Principali

### Per Utenti Non Autenticati:
1. **Navbar pulita** con logo e bottone "Accedi" viola
2. Clic su "Accedi" apre popup di scelta
3. Modal di scelta con design bianco e bottoni chiari
4. Form di login/registrazione con validazione completa

### Per Utenti Autenticati:
1. **Foto profilo** nella navbar con nome utente
2. **Menu dropdown bianco** con opzioni:
   - Profilo (con icona)
   - Impostazioni (con icona)  
   - Logout (rosso, con icona)
3. Logout che pulisce il token e reimposta lo stato

## Configurazione API

Il sistema è configurato per comunicare con l'API backend su `http://localhost:3000/api`. 

### Endpoint richiesti:
- `POST /api/auth/login` - Login utente
- `POST /api/auth/register` - Registrazione utente

### Format delle risposte API:
```typescript
// Login/Register Response
{
  token: string,
  user: {
    id: string,
    email: string,
    username: string,
    profilePicture?: string
  }
}
```

## Gestione Token JWT

Il sistema decodifica automaticamente il token JWT per estrarre le informazioni utente. Il token deve contenere:
```json
{
  "id": "user_id",
  "email": "user@email.com", 
  "username": "username",
  "profilePicture": "url_to_picture",
  "exp": timestamp
}
```

## Styling e Design

### Navbar:
- Design minimalista con sfondo bianco e blur
- Logo con icona musicale animata
- Transizioni smooth per tutti gli elementi
- Responsive design per mobile e desktop

### Modali:
- Design pulito con sfondo bianco
- Bordi sottili e ombre delicate
- Form con focus states viola
- Bottoni con hover effects e ombre

### Animazioni:
- Slide down per dropdown menu
- Scale effects per avatar e logo
- Transform effects per bottoni
- Pulse animation per icona logo

## File Modificati/Creati

### Modificati per Design Bianco:
- `src/app/shared/navbar/navbar.ts` - Logica autenticazione
- `src/app/shared/navbar/navbar.html` - UI bianca con auth
- `src/app/shared/navbar/navbar.css` - Styling bianco e pulito
- `src/app/shared/auth/login/login.html` - Design bianco
- `src/app/shared/auth/register/register.html` - Design bianco
- `src/app/pages/home/home.ts` - Rimossa logica auth
- `src/app/pages/home/home.html` - Rimossa UI auth

### Creati:
- `src/app/shared/interceptors/auth.interceptor.ts`
- CSS aggiornato per tutti i componenti auth

## Note Implementative

1. **Design System**: Palette coerente bianco/grigio/viola
2. **Usabilità**: Navbar sempre visibile e accessibile
3. **Performance**: Blur effects con fallback per browser meno recenti
4. **Accessibilità**: Focus states chiari e navigation keyboard-friendly
5. **Responsive**: Design ottimizzato per mobile e desktop

### Vantaggi della Navbar:
- **Sempre visibile**: L'autenticazione è sempre accessibile
- **Non invasiva**: Non interrompe l'esperienza sulla home
- **Coerente**: Design unificato in tutta l'app
- **Professionale**: Aspetto pulito e moderno

Il sistema è pronto per essere testato con il tuo backend API! 🎵✨
