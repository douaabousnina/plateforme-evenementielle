import { output, signal, inject, Directive, computed } from '@angular/core';
import { FormValidationService } from '../../../features/reservation/services/form-validation.service';

// each field => value & error
export type FieldConfig = {
  [key: string]: {
    value: ReturnType<typeof signal<string>>;
    error: ReturnType<typeof signal<string>>
  };
};

// an abstract class for any form => ensure consistency & DRY code
@Directive() // for dependency injection & no template or selector => directive
export abstract class BaseFormComponent<T> {
  abstract fields: FieldConfig;
  abstract fieldNames: string[];

  formData = output<T>();
  validationStatus = output<boolean>();

  showErrors = signal<boolean>(false);
  validation = inject(FormValidationService);

  // Computed signal for form validity
  isValid = computed(() => {
    for (const field of this.fieldNames) {
      const value = this.fields[field].value();
      const { isValid } = this.validation.validate(value, field, true);
      if (!isValid) {
        return false;
      }
    }
    return true;
  });

  onFieldBlur(field: string, value: string): void {
    this.fields[field].value.set(value);
    this.validateField(field);
    this.emitFormData();
    this.emitValidationStatus();
  }

  validateAll(): void {
    this.showErrors.set(true);

    for (const field of this.fieldNames) {
      this.validateField(field);
    }

    this.emitValidationStatus();
  }

  validateField(field: string): boolean {
    const value = this.fields[field].value();
    const { isValid, error } = this.validation.validate(value, field, true);
    this.fields[field].error.set(error);
    return isValid;
  }

  private emitValidationStatus(): void {
    this.validationStatus.emit(this.isValid());
  }

  private emitFormData(): void {
    const data = this.buildFormData();
    this.formData.emit(data as T);
  }

  // abstract method to construct the output data
  abstract buildFormData(): T;
}