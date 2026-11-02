import { Injectable, signal } from '@angular/core';

const TOAST_DURATION_MS = 2500;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly text = signal('');
  readonly message = this.text.asReadonly();
  private timer: ReturnType<typeof setTimeout> | undefined;

  show(message: string): void {
    clearTimeout(this.timer);
    this.text.set(message);
    this.timer = setTimeout(() => this.text.set(''), TOAST_DURATION_MS);
  }
}
