import { Component, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Lesson } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson.service';
import { azSortData } from '../../utils/az-sort';
import { StatsService } from '../../services/stats.service';
import { LessonForm } from './lesson-form';
import { Avatar } from '../shared/avatar/avatar';
import { SkeletonTable } from '../shared/skeleton-table/skeleton-table';
import { EmptyState } from '../shared/empty-state/empty-state';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-lessons-list',
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    Avatar,
    SkeletonTable,
    EmptyState
  ],
  templateUrl: './lessons-list.html',
  styleUrl: './lessons-list.scss'
})
export class LessonsList implements OnInit {
  private service = inject(LessonService);
  private stats = inject(StatsService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  sort = viewChild(MatSort);
  paginator = viewChild(MatPaginator);

  constructor() {
    effect(() => {
      const s = this.sort();
      if (s) this.dataSource.sort = s;
    });
    effect(() => {
      const p = this.paginator();
      if (p) this.dataSource.paginator = p;
    });
  }

  lessons = signal<Lesson[]>([]);
  loading = signal(false);
  search = signal('');
  displayedColumns = ['lessonCode', 'lessonName', 'grade', 'teacher', 'actions'];
  dataSource = (() => {
    const ds = new MatTableDataSource<Lesson>([]);
    ds.sortData = (data, sort) => azSortData(data, sort, (item: Lesson, key: string) => {
      if (key === 'teacherFullName') return `${item.teacherFirstName} ${item.teacherLastName}`;
      return (item as any)[key];
    });
    return ds;
  })();

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const all = this.lessons();
    if (!q) return all;
    return all.filter(l =>
      l.lessonCode.toLowerCase().includes(q) ||
      l.lessonName.toLowerCase().includes(q) ||
      `${l.teacherFirstName} ${l.teacherLastName}`.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.load();
  }

  private syncDataSource(): void {
    this.dataSource.data = this.filtered();
  }

  load(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: data => {
        this.lessons.set(data);
        this.syncDataSource();
        this.loading.set(false);
        this.stats.refresh();
      },
      error: () => {
        this.snack.open('Dərsləri yükləmək alınmadı', 'Bağla', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.syncDataSource();
  }

  openAdd(): void {
    const ref = this.dialog.open(LessonForm, { data: { lesson: null } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.service.create(result).subscribe({
        next: () => {
          this.snack.open('Dərs əlavə edildi', 'Bağla', { duration: 2000 });
          this.load();
        },
        error: err => this.snack.open(err.error ?? 'Dərs əlavə etmək alınmadı', 'Bağla', { duration: 3000 })
      });
    });
  }

  openEdit(lesson: Lesson): void {
    const ref = this.dialog.open(LessonForm, { data: { lesson } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const { lessonCode, ...rest } = result;
      this.service.update(lesson.lessonCode, rest).subscribe({
        next: () => {
          this.snack.open('Dərs yeniləndi', 'Bağla', { duration: 2000 });
          this.load();
        },
        error: () => this.snack.open('Dərsi yeniləmək alınmadı', 'Bağla', { duration: 3000 })
      });
    });
  }

  remove(lesson: Lesson): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        message: `"${lesson.lessonCode} - ${lesson.lessonName}" dərsi silinəcək.`,
        warning: 'Bu dərsə aid bütün imtahan qeydləri silinəcək.',
        confirmText: 'Sil',
        cancelText: 'Ləğv et',
        variant: 'danger'
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.service.delete(lesson.lessonCode).subscribe({
        next: () => {
          this.snack.open('Dərs silindi', 'Bağla', { duration: 2000 });
          this.load();
        },
        error: () => this.snack.open('Dərsi silmək alınmadı', 'Bağla', { duration: 3000 })
      });
    });
  }
}
