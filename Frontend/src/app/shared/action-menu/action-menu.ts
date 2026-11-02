import { Component, ElementRef, inject, input, output, signal } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

export interface ActionMenuItem {
  id: string;
  label: string;
  icon: IconName;
  danger?: boolean;
}

// The prototype's "⋯" button with a small dropdown of actions.
@Component({
  selector: 'app-action-menu',
  imports: [Icon],
  templateUrl: './action-menu.html',
  styleUrl: './action-menu.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'open.set(false)',
  },
})
export class ActionMenu {
  readonly items = input.required<ActionMenuItem[]>();
  readonly label = input('Actions');
  readonly small = input(false);
  readonly selected = output<string>();

  protected readonly open = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected select(id: string): void {
    this.open.set(false);
    this.selected.emit(id);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
