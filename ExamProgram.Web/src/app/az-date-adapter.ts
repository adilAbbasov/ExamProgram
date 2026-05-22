import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class AzDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: string): string {
    return formatDate(date, displayFormat, this.locale);
  }

  override parse(value: any): Date | null {
    if (typeof value !== 'string' || !value.trim()) return super.parse(value);
    const match = value.trim().match(/^(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})$/);
    if (!match) return super.parse(value);
    const [, day, month, year] = match;
    return new Date(+year, +month - 1, +day);
  }

  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const format = style === 'long' ? 'LLLL' : style === 'short' ? 'LLL' : 'LLLLL';
    return Array.from({ length: 12 }, (_, i) =>
      formatDate(new Date(2000, i, 1), format, this.locale)
    );
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'narrow') {
      return ['B', 'B.E', 'Ç.A', 'Ç', 'C.A', 'C', 'Ş'];
    }
    const format = style === 'long' ? 'EEEE' : 'EEE';
    return Array.from({ length: 7 }, (_, i) =>
      formatDate(new Date(2024, 0, 7 + i), format, this.locale)
    );
  }

  override getFirstDayOfWeek(): number {
    return 1;
  }
}
