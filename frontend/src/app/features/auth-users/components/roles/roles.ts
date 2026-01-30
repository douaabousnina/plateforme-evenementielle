import { Component,EventEmitter, input, Input, output, Output } from '@angular/core';
import { Role } from '../../models/auth.model';


@Component({
  selector: 'app-roles',
  imports: [],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles {
  selectedRole=input<Role>(Role.CLIENT);
  roleChange = output<Role>();

  roles = [
    { label: 'Client', value: Role.CLIENT },
    { label: 'Organisateur', value: Role.ORGANIZER },
  ];

  selectRole(role: Role) {
    this.roleChange.emit(role);
  }

}