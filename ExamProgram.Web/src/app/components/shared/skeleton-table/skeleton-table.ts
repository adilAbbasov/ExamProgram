import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-table',
  template: `
    <div class="skeleton">
      <div class="skeleton-header">
        @for (col of cols(); track $index) {
          <div class="skel-cell header-cell"></div>
        }
      </div>
      @for (row of rows(); track $index) {
        <div class="skeleton-row">
          @for (col of cols(); track $index) {
            <div class="skel-cell"></div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .skeleton {
      width: 100%;
      background: var(--mat-sys-surface);
      border-radius: 12px;
      padding: 8px;
    }
    .skeleton-header, .skeleton-row {
      display: flex;
      gap: 16px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .skeleton-row:last-child { border-bottom: none; }
    .skel-cell {
      flex: 1;
      height: 14px;
      border-radius: 4px;
      background: linear-gradient(90deg, var(--mat-sys-surface-container) 0%, var(--mat-sys-surface-container-high) 50%, var(--mat-sys-surface-container) 100%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }
    .header-cell {
      height: 12px;
      opacity: 0.7;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
})
export class SkeletonTable {
  rows = input<number[]>([1, 2, 3, 4, 5]);
  cols = input<number[]>([1, 2, 3, 4, 5]);
}
