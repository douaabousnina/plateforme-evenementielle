export enum Role {
  CLIENT = 'CLIENT',
  ORGANIZER = 'ORGANIZER'
}

export enum Preference {
  THEATRE = 'THEATRE',
  FESTIVALS = 'FESTIVALS',
  CONCERTS = 'CONCERTS',
  EDUCATION = 'EDUCATION',
  CINEMA = 'CINEMA',
  SPORT = 'SPORT',
  TECH='TECH',
    ART='ART',
    FOOD='FOOD',
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword?: string; // Utilisé côté frontend seulement
  preferences?: Preference[];
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  email: string;
  role: Role;
  preferences?: Preference[];
}