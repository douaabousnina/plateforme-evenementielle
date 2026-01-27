import { output, signal, inject, Directive, input, effect } from '@angular/core';
import { FormValidationService } from '../../../features/reservation/services/form-validation.service';

// each field => value & error
export type FieldConfig = {
  [key: string]: { value: ReturnType<typeof signal<string>>; error: ReturnType<typeof signal<string>> };
};

// an abstract class for any form => ensure consistency & DRY code
@Directive() // on a dependency injection & no template or selector => directive
export abstract class BaseFormComponent<T> {
  abstract fields: FieldConfig;
  abstract fieldNames: string[];

  triggerValidation = input<boolean>(false);

  formData = output<T>();
  validationStatus = output<boolean>();
  showErrors = signal<boolean>(false);

  validation = inject(FormValidationService);

  constructor() {
    // Watch for external validation trigger
    effect(() => {
      if (this.triggerValidation()) {
        this.validateAll();
      }
    });
  }

  onFieldBlur(field: string, value: string): void {
    this.fields[field].value.set(value);
    this.validateField(field);
    this.emitFormData();
    this.checkIfAllValid();
  }

  validateAll(): void {
    this.showErrors.set(true);
    let isAllValid = true;

    for (const field of this.fieldNames) {
      if (!this.validateField(field)) {
        isAllValid = false;
      }
    }

    this.validationStatus.emit(isAllValid);
  }

  private checkIfAllValid(): void {
    let isAllValid = true;
    for (const field of this.fieldNames) {
      const value = this.fields[field].value();
      const { isValid } = this.validation.validate(value, field, true);
      if (!isValid) {
        isAllValid = false;
        break;
      }
    }
    this.validationStatus.emit(isAllValid);
  }

  validateField(field: string): boolean {
    const value = this.fields[field].value();
    const { isValid, error } = this.validation.validate(value, field, true);
    this.fields[field].error.set(error);
    return isValid;
  }

  private emitFormData(): void {
    const data = this.buildFormData();
    this.formData.emit(data as T);
  }

  // abstract method to construct the output data..
  abstract buildFormData(): T;
}
