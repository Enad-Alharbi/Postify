import { Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';
import { Modal } from '../modal/modal';

// The prototype's delete confirmation. Optional projected content shows a preview of what's being removed.
@Component({
  selector: 'app-confirm-dialog',
  imports: [Icon, Modal],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Yes, Delete');
  readonly loadingLabel = input('Deleting…');
  readonly loading = input(false);
  readonly error = input('');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
