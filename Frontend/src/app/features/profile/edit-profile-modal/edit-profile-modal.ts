import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnDestroy, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  BIO_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PROFILE_PICTURE_MAX_BYTES,
  UserProfile,
} from '../../../core/models/profile.models';
import { ProfileService } from '../../../core/services/profile.service';
import { getApiErrorMessage } from '../../../core/utils/api-error';
import { IMAGE_TYPES, validateImage } from '../../../core/utils/image-validation';
import { Avatar } from '../../../shared/avatar/avatar';
import { Icon } from '../../../shared/icon/icon';
import { Modal } from '../../../shared/modal/modal';

type ProfileField = 'firstName' | 'lastName' | 'bio';

@Component({
  selector: 'app-edit-profile-modal',
  imports: [ReactiveFormsModule, Avatar, Icon, Modal],
  templateUrl: './edit-profile-modal.html',
  styleUrl: './edit-profile-modal.scss',
})
export class EditProfileModal implements OnInit, OnDestroy {
  private readonly profiles = inject(ProfileService);
  private readonly destroyRef = inject(DestroyRef);

  readonly profile = input.required<UserProfile>();
  readonly saved = output<UserProfile>();
  readonly closed = output<void>();

  protected readonly nameMaxLength = NAME_MAX_LENGTH;
  protected readonly bioMaxLength = BIO_MAX_LENGTH;
  protected readonly acceptedTypes = IMAGE_TYPES.join(',');

  // Limits mirror the backend UpdateProfileDto; the pattern rejects names that are only spaces.
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(NAME_MAX_LENGTH)]],
    lastName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(NAME_MAX_LENGTH)]],
    bio: ['', Validators.maxLength(BIO_MAX_LENGTH)],
  });
  private readonly bioValue = toSignal(this.form.controls.bio.valueChanges, { initialValue: '' });
  protected readonly bioLength = computed(() => this.bioValue().length);

  protected readonly picture = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly error = signal('');

  ngOnInit(): void {
    const { firstName, lastName, bio } = this.profile();
    this.form.setValue({ firstName, lastName, bio: bio ?? '' });
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    const validationError = validateImage(file, PROFILE_PICTURE_MAX_BYTES);
    this.error.set(validationError);

    if (!validationError) {
      this.revokePreview();
      this.picture.set(file);
      this.previewUrl.set(URL.createObjectURL(file));
    }
  }

  protected cancelNewPhoto(): void {
    this.revokePreview();
    this.picture.set(null);
  }

  protected showError(control: ProfileField): boolean {
    const field = this.form.controls[control];
    return field.invalid && field.touched;
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const { firstName, lastName, bio } = this.form.getRawValue();

    this.profiles
      .updateMyProfile({ firstName: firstName.trim(), lastName: lastName.trim(), bio: bio.trim(), profilePicture: this.picture() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => this.saved.emit(profile),
        error: (err) => {
          this.error.set(
            err instanceof HttpErrorResponse && err.status === 413
              ? 'This image is too large for the server. Try a smaller file.'
              : getApiErrorMessage(err, "Couldn't save your profile. Please try again."),
          );
          this.saving.set(false);
        },
      });
  }

  private revokePreview(): void {
    const url = this.previewUrl();
    if (url) {
      URL.revokeObjectURL(url);
      this.previewUrl.set(null);
    }
  }
}
