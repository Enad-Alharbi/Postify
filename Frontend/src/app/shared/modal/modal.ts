import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, input, output, viewChild } from '@angular/core';
import { Icon } from '../icon/icon';

let nextId = 0;

const FOCUSABLE = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

// Dialog shell from the prototype: header with title and close, projected body and actions.
@Component({
  selector: 'app-modal',
  imports: [Icon],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  host: {
    '(document:keydown.escape)': 'requestClose()',
    '(keydown.tab)': 'trapFocus($event)',
    '(keydown.shift.tab)': 'trapFocus($event)',
  },
})
export class Modal implements OnInit, AfterViewInit, OnDestroy {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly wide = input(false);
  // Set to false while a request is running so the user can't dismiss it halfway.
  readonly closable = input(true);
  readonly closed = output<void>();

  protected readonly titleId = `modal-title-${nextId++}`;
  private readonly dialog = viewChild.required<ElementRef<HTMLElement>>('dialog');
  private previousFocus: HTMLElement | null = null;

  ngOnInit(): void {
    this.previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
  }

  ngAfterViewInit(): void {
    this.dialog().nativeElement.focus();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    this.previousFocus?.focus();
  }

  protected requestClose(): void {
    if (this.closable()) {
      this.closed.emit();
    }
  }

  // Keeps Tab / Shift+Tab cycling inside the dialog instead of reaching the page behind it.
  protected trapFocus(event: Event): void {
    const dialog = this.dialog().nativeElement;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => !element.hasAttribute('disabled') && element.offsetParent !== null,
    );

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const backwards = (event as KeyboardEvent).shiftKey;

    if (backwards && (active === first || active === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!backwards && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected onBackdropMouseDown(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.requestClose();
    }
  }
}
