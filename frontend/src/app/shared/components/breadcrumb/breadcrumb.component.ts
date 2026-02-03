
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbStep } from '../../../core/models/breadcrumb.model';

@Component({
    selector: 'app-breadcrumb',
    
    imports: [CommonModule, RouterLink],
    templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {
    steps = input.required<BreadcrumbStep[]>();
}