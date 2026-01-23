import { output, signal, input, effect, inject, Directive } from '@angular/core';
import { FormValidationService } from '../../../features/reservation/services/form-validation.service';

export type FieldConfig = {
  [key: string]: { value: ReturnType<typeof signal<string>>; error: ReturnType<typeof signal<string>> };
};

@Directive()
export abstract class BaseFormComponent<T> {
  abstract fields: FieldConfig;
  abstract fieldNames: string[];

  formData = output<T>();
  validationStatus = output<boolean>();
  triggerValidation = input<boolean>(false);
  showErrors = signal<boolean>(false);

  protected validation = inject(FormValidationService);

  constructor() {
    effect(() => {
      if (this.triggerValidation()) {
        this.validateAll();
      }
    });
  }

  onFieldBlur(field: string, value: string): void {
    this.fields[field].value.set(value);
    this.validateField(field);
  }

  protected validateAll(): void {
    this.showErrors.set(true);
    let isAllValid = true;

    for (const field of this.fieldNames) {
      if (!this.validateField(field)) {
        isAllValid = false;
      }
    }

    this.validationStatus.emit(isAllValid);

    if (isAllValid) {
      const data = this.buildFormData();
      this.formData.emit(data as T);
    }
  }

  protected validateField(field: string): boolean {
    const value = this.fields[field].value();
    const { isValid, error } = this.validation.validate(value, field, true);
    this.fields[field].error.set(error);
    return isValid;
  }

  protected abstract buildFormData(): T;
}
