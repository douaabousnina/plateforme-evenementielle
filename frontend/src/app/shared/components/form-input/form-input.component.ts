import { Component, input, output, signal } from '@angular/core';

@Component({
    selector: 'app-form-input',
    
    templateUrl: './form-input.component.html',
})
export class FormInputComponent {
    label = input.required<string>();
    placeholder = input<string>();
    type = input<string>('text');
    value = input.required<string>();
    name = input.required<string>();
    maxlength = input<number>();
    icon = input<string>();
    helpText = input<string>();
    helpIcon = input<string>();
    disabled = input<boolean>(false);
    error = input<string>('');
    forceShowError = input<boolean>(false);

    blurred = output<string>();

    isTouched = signal<boolean>(false);

    onBlur(value: string): void {
        this.isTouched.set(true);
        this.blurred.emit(value);
    }
}