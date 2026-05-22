import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `<div class="avatar" [style.background]="bgColor()" [style.color]="textColor()">{{ initials() }}</div>`,
  styles: `
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 13px;
      flex-shrink: 0;
      user-select: none;
    }
  `
})
export class Avatar {
  name = input.required<string>();

  initials = computed(() => {
    const parts = this.name().trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  private palette = [
    ['#FCE7F3', '#9D174D'],
    ['#E0F2FE', '#075985'],
    ['#DCFCE7', '#166534'],
    ['#FEF3C7', '#92400E'],
    ['#EDE9FE', '#5B21B6'],
    ['#FFE4E6', '#9F1239'],
    ['#CFFAFE', '#155E75'],
    ['#FAE8FF', '#86198F']
  ];

  private hashIndex = computed(() => {
    let h = 0;
    const name = this.name();
    for (let i = 0; i < name.length; i++) {
      h = (h << 5) - h + name.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h) % this.palette.length;
  });

  bgColor = computed(() => this.palette[this.hashIndex()][0]);
  textColor = computed(() => this.palette[this.hashIndex()][1]);
}
