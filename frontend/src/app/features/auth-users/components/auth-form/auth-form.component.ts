import { Component, Input, viewChild,inject, signal } from '@angular/core';
import { NgForm, FormsModule} from '@angular/forms';
import { AuthInputComponent } from '../auth-input/auth-input.component';
import { AuthButtonComponent } from '../auth-button/auth-button.component';
import { InterestSelectorComponent } from '../interest-selector/interest-selector.component';
import { AuthService } from '../../services/auth.service';
import { Preference, RegisterDto, Role } from '../../models/auth.model';
import { LoginDto } from '../../models/auth.model';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth-form',
  imports: [
    CommonModule,
    FormsModule, 
    AuthInputComponent, 
    AuthButtonComponent, 
    InterestSelectorComponent
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {
  @Input() userRole: Role = Role.CLIENT;
  @Input() isLogin = false;
  
  private authService = inject(AuthService);
  
  user = {
    email: '',
    password: '',
    confirmPassword: '',
    preferences: [] as Preference[]
  };
  
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  submitForm() {
    this.clearMessages();
    
    // Validation côté client
    if (!this.validateForm()) {
      return;
    }

    this.isLoading.set(true);

    if (this.isLogin) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private validateForm(): boolean {
    // Email vide
    if (!this.user.email) {
      this.errorMessage.set('L\'adresse email est requise');
      return false;
    }

    // Email invalide (validation simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      this.errorMessage.set('L\'adresse email n\'est pas valide');
      return false;
    }

    // Mot de passe vide
    if (!this.user.password) {
      this.errorMessage.set('Le mot de passe est requis');
      return false;
    }

    // Validation pour registration uniquement
    if (!this.isLogin) {
      // Confirmation du mot de passe
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage.set('Les mots de passe ne correspondent pas');
        return false;
      }

      // Force du mot de passe (même regex que backend)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%+*?&]{8,}$/;
      if (!passwordRegex.test(this.user.password)) {
        this.errorMessage.set('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)');
        return false;
      }

      // Préférences pour CLIENT
      if (this.userRole === Role.CLIENT && this.user.preferences.length === 0) {
        this.errorMessage.set('Veuillez sélectionner au moins une préférence');
        return false;
      }
    }

    return true;
  }

  private handleLogin() {
    const loginDto: LoginDto = {
      email: this.user.email,
      password: this.user.password
    };

    this.authService.login(loginDto).subscribe({
      next: () => {
        this.successMessage.set('Connexion réussie !');
        this.isLoading.set(false);
        // La redirection est gérée dans le service
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(this.extractErrorMessage(error));
        this.isLoading.set(false);
      }
    });
  }

  private handleRegister() {
    const registerDto: RegisterDto = {
      email: this.user.email,
      password: this.user.password,
      role: this.userRole,
      preferences: this.userRole === Role.CLIENT ? this.user.preferences : undefined
    };

    this.authService.register(registerDto).subscribe({
      next: () => {
        this.successMessage.set('Inscription réussie !');
        this.isLoading.set(false);
        // La redirection est gérée dans le service
      },
      error: (error: HttpErrorResponse) => {
        const errorMsg = this.extractErrorMessage(error);
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Extrait le message d'erreur de la réponse HTTP
   */
  private extractErrorMessage(error: HttpErrorResponse): string {
    // Si le backend renvoie un message personnalisé
    if (error.error?.message) {
      // Le message peut être une string ou un array
      if (Array.isArray(error.error.message)) {
        return error.error.message.join(', ');
      }
      return error.error.message;
    }

    // Messages par défaut selon le code d'erreur
    switch (error.status) {
      case 0:
        return 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.';
      case 400:
        return 'Données invalides. Veuillez vérifier vos informations.';
      case 401:
        return this.isLogin 
          ? 'Email ou mot de passe incorrect' 
          : 'Erreur lors de l\'inscription';
      case 403:
        return 'Accès refusé';
      case 404:
        return 'Service non disponible';
      case 409:
        return 'Cette adresse email est déjà utilisée';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      default:
        return 'Une erreur est survenue. Veuillez réessayer.';
    }
  }

  private clearMessages() {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  onPreferencesChange(preferences: Preference[]) {
    this.user.preferences = preferences;
  }
}