import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-my-ticket-card',
    standalone: true,
    imports: [DatePipe],
    template: `
    <div class="flex flex-col lg:flex-row w-full bg-white dark:bg-[#1a1d2d] rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-none dark:border dark:border-gray-700 overflow-hidden group/ticket hover:shadow-lg transition-shadow duration-300">
      
      <!-- Left: Image -->
      <div class="w-full lg:w-56 h-48 lg:h-auto relative">
        <div 
          class="absolute inset-0 bg-cover bg-center" 
          [style.background-image]="'url(' + ticket().imageUrl + ')'"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
        <div class="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur text-[#0d101c] dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {{ ticket().eventType }}
        </div>
      </div>
      
      <!-- Middle: Main Info -->
      <div class="flex-1 p-6 flex flex-col justify-between relative">
        <div class="flex flex-col gap-1 mb-4">
          <div class="flex items-center gap-2 text-primary dark:text-blue-400 font-bold text-sm uppercase tracking-wider mb-1">
            <span class="material-symbols-outlined text-base">calendar_month</span>
            {{ ticket().eventDate | date:'EEEE dd MMMM':'':'fr' }} • {{ ticket().eventTime }}
          </div>
          <h3 class="text-2xl font-bold text-[#0d101c] dark:text-white leading-tight">
            {{ ticket().eventName }}
          </h3>
          <div class="flex items-center gap-1 text-[#4b589b] dark:text-gray-400 text-sm mt-1">
            <span class="material-symbols-outlined text-lg">location_on</span>
            <span>{{ ticket().venue }}</span>
          </div>
        </div>
        
        <!-- Seat Info Grid -->
        <div class="grid grid-cols-3 gap-4 border-t border-dashed border-gray-200 dark:border-gray-700 pt-4 mt-auto">
          @if (ticket().seatInfo.gate) {
            <div class="flex flex-col">
              <span class="text-xs text-gray-400 font-medium uppercase">Porte</span>
              <span class="text-base font-bold text-[#0d101c] dark:text-white">
                {{ ticket().seatInfo.gate }}
              </span>
            </div>
          }
          @if (ticket().seatInfo.access) {
            <div class="flex flex-col">
              <span class="text-xs text-gray-400 font-medium uppercase">Accès</span>
              <span class="text-base font-bold text-[#0d101c] dark:text-white">
                {{ ticket().seatInfo.access }}
              </span>
            </div>
          }
          @if (ticket().seatInfo.section) {
            <div class="flex flex-col">
              <span class="text-xs text-gray-400 font-medium uppercase">{{ ticket().seatInfo.section }}</span>
              <span class="text-base font-bold text-[#0d101c] dark:text-white">
                {{ ticket().seatInfo.row }}
              </span>
            </div>
          }
          @if (ticket().seatInfo.row && !ticket().seatInfo.section) {
            <div class="flex flex-col">
              <span class="text-xs text-gray-400 font-medium uppercase">Rang</span>
              <span class="text-base font-bold text-[#0d101c] dark:text-white">
                {{ ticket().seatInfo.row }}
              </span>
            </div>
          }
          @if (ticket().seatInfo.zone) {
            <div class="flex flex-col">
              <span class="text-xs text-gray-400 font-medium uppercase">Zone</span>
              <span class="text-base font-bold text-[#0d101c] dark:text-white">
                {{ ticket().seatInfo.zone }}
              </span>
            </div>
          }
          @if (ticket().seatInfo.seat) {
            <div class="flex flex-col">
              <span class="text-xs text-gray-400 font-medium uppercase">Siège</span>
              <span class="text-base font-bold text-[#0d101c] dark:text-white">
                {{ ticket().seatInfo.seat }}
              </span>
            </div>
          }
        </div>
      </div>
      
      <!-- Divider (Ticket Rip) -->
      <div class="relative hidden lg:flex flex-col items-center justify-center w-8">
        <div class="h-full border-l-2 border-dashed border-gray-300 dark:border-gray-600"></div>
        <div class="ticket-notch -top-3 -left-[10px]"></div>
        <div class="ticket-notch -bottom-3 -left-[10px]"></div>
      </div>
      
      <!-- Right: Actions & QR Stub -->
      <div class="w-full lg:w-72 bg-gray-50 dark:bg-[#202436] p-6 flex flex-col items-center justify-center gap-4 border-t lg:border-t-0 lg:border-l border-dashed border-gray-200 dark:border-gray-700 relative">
        
        <!-- Mobile notches -->
        <div class="lg:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background-light dark:bg-background-dark z-10"></div>
        
        <!-- QR Code -->
        <div class="flex flex-col items-center text-center gap-2">
          <div class="bg-white p-2 rounded-lg shadow-sm">
            <span class="material-symbols-outlined text-[80px] text-gray-800 leading-none">qr_code_2</span>
          </div>
          <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Commande #{{ ticket().orderId }}
          </p>
        </div>
        
        <!-- View Button -->
        <button 
          (click)="viewTicket.emit(ticket().id)"
          class="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-500/20"
        >
          <span class="material-symbols-outlined text-xl">visibility</span>
          Voir le Billet
        </button>
        
        <!-- Action Icons -->
        <div class="flex items-center justify-center gap-3 w-full">
          <button 
            (click)="downloadTicket.emit(ticket().id)"
            class="p-2 text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-700 dark:text-gray-400 rounded-lg transition-all" 
            title="Télécharger PDF"
          >
            <span class="material-symbols-outlined">download</span>
          </button>
          <button 
            (click)="contactOrganizer.emit(ticket().id)"
            class="p-2 text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-700 dark:text-gray-400 rounded-lg transition-all" 
            title="Contacter l'organisateur"
          >
            <span class="material-symbols-outlined">mail</span>
          </button>
          <button 
            (click)="cancelTicket.emit(ticket().id)"
            class="p-2 text-gray-500 hover:text-red-600 hover:bg-white dark:hover:bg-gray-700 dark:text-gray-400 rounded-lg transition-all" 
            title="Annuler ma commande"
          >
            <span class="material-symbols-outlined">cancel</span>
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .ticket-notch {
      position: absolute;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #f6f6f8;
      z-index: 10;
    }
    :host-context(.dark) .ticket-notch {
      background-color: #101322;
    }
  `]
})
export class MyTicketCardComponent {
    ticket = input.required<any>();

    viewTicket = output<string>();
    downloadTicket = output<string>();
    contactOrganizer = output<string>();
    cancelTicket = output<string>();
}
