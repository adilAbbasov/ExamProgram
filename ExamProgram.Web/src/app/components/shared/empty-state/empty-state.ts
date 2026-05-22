import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="empty-state">
      <div class="illustration">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
      @if (actionText()) {
        <button mat-flat-button (click)="action.emit()">
          <mat-icon>add</mat-icon>
          {{ actionText() }}
        </button>
      }
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 64px 32px;
      background: var(--mat-sys-surface);
      border-radius: 16px;
      border: 1px dashed var(--mat-sys-outline-variant);
    }
    .illustration {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .illustration mat-icon {
      font-size: 44px;
      width: 44px;
      height: 44px;
    }
    h3 {
      margin: 0 0 8px;
      font-weight: 600;
      font-size: 18px;
    }
    p {
      margin: 0 0 24px;
      color: var(--mat-sys-on-surface-variant);
      max-width: 400px;
      line-height: 1.5;
    }
  `
})
export class EmptyState {
  icon = input<string>('inbox');
  title = input.required<string>();
  description = input<string>('');
  actionText = input<string>('');
  action = output<void>();
}
