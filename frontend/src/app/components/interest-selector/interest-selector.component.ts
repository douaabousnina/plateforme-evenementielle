import { Component } from '@angular/core';

@Component({
  selector: 'app-interest-selector',
  imports: [],
  templateUrl: './interest-selector.component.html',
  styleUrl: './interest-selector.component.css'
})
export class InterestSelectorComponent {

  interests = ['Festival', 'Théâtre', 'Concerts', 'Sport', 'Tech', 'Art', 'Food', 'Éducation', 'Cinéma']; 
  selected: string[] = []; 
  toggleInterest(interest: string) { 
    if (this.selected.includes(interest)) { this.selected = this.selected.filter(i => i !== interest); } else { this.selected.push(interest); } }
}