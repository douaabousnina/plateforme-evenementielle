import { Component,EventEmitter, input, Input, output, Output } from '@angular/core';

export type UserRole = 'CLIENT' | 'ORGANIZER' ;

@Component({
  selector: 'app-roles',
  imports: [],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles {
  selectedRole=input<UserRole>('CLIENT');
  roleChange = output<UserRole>();

  roles = [
    { label: 'Client', value: 'CLIENT' as UserRole },
    { label: 'Organisateur', value: 'ORGANIZER' as UserRole },
  ];

  selectRole(role: UserRole) {
    this.roleChange.emit(role);
  }

}
