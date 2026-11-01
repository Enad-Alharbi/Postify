import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { getApiErrorMessage } from '../../../core/utils/api-error';
import { Icon } from '../../../shared/icon/icon';
import { AuthShell } from '../auth-shell/auth-shell';

type RegisterField = 'firstName' | 'lastName' | 'email' | 'userName' | 'password';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, AuthShell, Icon],
  templateUrl: './register.html',
  styleUrls: ['../auth-form.scss', './register.scss'],
})
export class Register {
  private readonly auth = inject(AuthService);

  // Limits mirror the backend RegisterDto, except the password minimum, which is frontend-only.
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    userName: ['', [Validators.required, Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal(false);
  protected readonly showPassword = signal(false);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.error.set(getApiErrorMessage(err));
        this.loading.set(false);
      },
    });
  }

  protected showError(control: RegisterField): boolean {
    const field = this.form.controls[control];
    return field.invalid && field.touched;
  }

  protected hasError(control: RegisterField, error: string): boolean {
    return this.form.controls[control].hasError(error);
  }
}
