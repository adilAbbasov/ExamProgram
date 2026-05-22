import { MatSort } from '@angular/material/sort';

const azCollator = new Intl.Collator('az', { sensitivity: 'base', numeric: true });

export type SortAccessor<T> = (item: T, key: string) => any;

const defaultAccessor: SortAccessor<any> = (item, key) => (item as any)[key];

export function azSortData<T>(
  data: T[],
  sort: MatSort,
  accessor: SortAccessor<T> = defaultAccessor
): T[] {
  const active = sort.active;
  const direction = sort.direction;
  if (!active || direction === '') return data.slice();

  return data.slice().sort((a, b) => {
    const av = accessor(a, active);
    const bv = accessor(b, active);

    let cmp: number;
    if (av == null && bv == null) cmp = 0;
    else if (av == null) cmp = -1;
    else if (bv == null) cmp = 1;
    else if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
    else cmp = azCollator.compare(String(av), String(bv));

    return direction === 'asc' ? cmp : -cmp;
  });
}
