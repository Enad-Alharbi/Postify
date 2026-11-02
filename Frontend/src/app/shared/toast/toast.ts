import { Component, inject } from '@angular/core';
import { Icon } from '../icon/icon';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [Icon],
  template: `
    <div aria-live="polite">
      @if (toast.message()) {
        <div class="toast" role="status">
          <span><app-icon name="check" [size]="18" /></span>{{ toast.message() }}
        </div>
      }
    </div>
  `,
  styles: `
    .toast {
      position: fixed;
      z-index: 150;
      right: 24px;
      bottom: 24px;
      min-height: 52px;
      padding: 0 18px 0 10px;
      border: 1px solid var(--line);
      border-radius: 13px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: white;
      box-shadow: var(--shadow-md);
      font-size: 13px;
      font-weight: 600;
      animation: rise 0.25s;
    }

    .toast > span {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: #e8f4ee;
      color: var(--success);
    }

    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
      }
    }

    @media (max-width: 600px) {
      .toast {
        left: 12px;
        right: 12px;
        bottom: 78px;
      }
    }
  `,
})
export class Toast {
  protected readonly toast = inject(ToastService);
}
