import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, input, output, viewChild } from '@angular/core';
import { Icon } from '../icon/icon';

let nextId = 0;

// Dialog shell from the prototype: header with title and close, projected body and actions.
@Component({
  selector: 'app-modal',
  imports: [Icon],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  host: {
    '(document:keydown.escape)': 'requestClose()',
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

  protected onBackdropMouseDown(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.requestClose();
    }
  }
}
