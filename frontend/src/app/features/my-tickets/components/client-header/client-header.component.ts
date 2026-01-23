
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-client-header',
    standalone: true,
    imports: [RouterLink],
    template: `
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-[#1a1d2d]/90 backdrop-blur-md border-b border-[#e7e9f3] dark:border-gray-800">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        
        <!-- Logo & Search -->
        <div class="flex items-center gap-8 flex-1">
          <a routerLink="/" class="flex items-center gap-3 text-primary dark:text-blue-400 hover:opacity-80 transition-opacity">
            <div class="size-8 bg-primary text-white rounded-lg flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">confirmation_number</span>
            </div>
            <h2 class="text-[#0d101c] dark:text-white text-xl font-bold tracking-tight">
              EventTicket
            </h2>
          </a>
          
          <div class="hidden md:flex max-w-md w-full relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-[#4b589b] dark:text-gray-400">search</span>
            </div>
            <input 
              class="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-[#e7e9f3] dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm transition-all" 
              placeholder="Rechercher un événement, un artiste..." 
              type="text"
            />
          </div>
        </div>
        
        <!-- Nav Links & Actions -->
        <div class="flex items-center gap-6">
          <nav class="hidden lg:flex items-center gap-6">
            <a routerLink="/" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors">
              Accueil
            </a>
            <a routerLink="/events" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors">
              Événements
            </a>
            <a routerLink="/create-event" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors">
              Créer un événement
            </a>
            <a routerLink="/help" class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors">
              Aide
            </a>
          </nav>
          
          <div class="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-6">
            <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
              <span class="material-symbols-outlined text-[20px]">notifications</span>
              <span class="absolute top-1.5 right-2 size-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span class="material-symbols-outlined text-[20px]">shopping_cart</span>
            </button>
            
            <div class="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[2px] cursor-pointer ml-2">
              <div class="h-full w-full rounded-full bg-white dark:bg-gray-900 p-[2px]">
                <img 
                  alt="Avatar utilisateur" 
                  class="rounded-full h-full w-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCacb9iujzE0BZczBYEckTUHa6AmOsEZ4ZNXsMCljiBnNJBdp2s1im5US4IYZH6z1-ydNuVoa5X4mSdiTwzwOfhyNvhscg5QtQ7zTCsS4xElgZ41OBtYYMsuLpiAg2hM_ynAuMC04ZyoPNxWBd2l4kHHh7ryBJEWkiByqan8mI1Kr0sNa3YZiJK0SnqYUnQ41iyY639rKfEkkDJwEFamTh9tq600LpAqDKwUKaMjlMe2HIwpusvFN2BIr4uZM26eJBkRvuEJiMy6A4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class ClientHeaderComponent { }