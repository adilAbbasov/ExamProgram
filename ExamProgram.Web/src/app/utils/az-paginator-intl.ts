import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class AzPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Hər səhifədə:';
  override nextPageLabel = 'Növbəti səhifə';
  override previousPageLabel = 'Əvvəlki səhifə';
  override firstPageLabel = 'Birinci səhifə';
  override lastPageLabel = 'Son səhifə';

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) return `0 / ${length}`;
    const start = page * pageSize;
    const end = Math.min(start + pageSize, length);
    return `${start + 1} – ${end} / ${length}`;
  };
}
