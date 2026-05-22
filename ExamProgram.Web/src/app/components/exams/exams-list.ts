import { Component, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Exam } from '../../models/exam.model';
import { ExamService } from '../../services/exam.service';
import { azSortData } from '../../utils/az-sort';
import { StatsService } from '../../services/stats.service';
import { ExamForm } from './exam-form';
import { Avatar } from '../shared/avatar/avatar';
import { SkeletonTable } from '../shared/skeleton-table/skeleton-table';
import { EmptyState } from '../shared/empty-state/empty-state';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-exams-list',
  imports: [
    DatePipe,
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
  templateUrl: './exams-list.html',
  styleUrl: './exams-list.scss'
})
export class ExamsList implements OnInit {
  private service = inject(ExamService);
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

  exams = signal<Exam[]>([]);
  loading = signal(false);
  search = signal('');
  displayedColumns = ['student', 'lesson', 'examDate', 'score', 'actions'];
  dataSource = (() => {
    const ds = new MatTableDataSource<Exam>([]);
    ds.sortData = azSortData;
    return ds;
  })();

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const all = this.exams();
    if (!q) return all;
    return all.filter(e =>
      e.lessonCode.toLowerCase().includes(q) ||
      e.lessonName.toLowerCase().includes(q) ||
      e.studentFullName.toLowerCase().includes(q)
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
        this.exams.set(data);
        this.syncDataSource();
        this.loading.set(false);
        this.stats.refresh();
      },
      error: () => {
        this.snack.open('İmtahanları yükləmək alınmadı', 'Bağla', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.syncDataSource();
  }

  openAdd(): void {
    const ref = this.dialog.open(ExamForm, { data: { exam: null } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.service.create(result).subscribe({
        next: () => {
          this.snack.open('İmtahan əlavə edildi', 'Bağla', { duration: 2000 });
          this.load();
        },
        error: err => this.snack.open(err.error ?? 'İmtahan əlavə etmək alınmadı', 'Bağla', { duration: 3000 })
      });
    });
  }

  openEdit(exam: Exam): void {
    const ref = this.dialog.open(ExamForm, { data: { exam } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.service.update(exam.examId, { examDate: result.examDate, score: result.score }).subscribe({
        next: () => {
          this.snack.open('İmtahan yeniləndi', 'Bağla', { duration: 2000 });
          this.load();
        },
        error: () => this.snack.open('İmtahanı yeniləmək alınmadı', 'Bağla', { duration: 3000 })
      });
    });
  }

  remove(exam: Exam): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        message: `${exam.studentFullName} - ${exam.lessonName} üzrə imtahan qeydi silinəcək.`,
        confirmText: 'Sil',
        cancelText: 'Ləğv et',
        variant: 'danger'
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.service.delete(exam.examId).subscribe({
        next: () => {
          this.snack.open('İmtahan silindi', 'Bağla', { duration: 2000 });
          this.load();
        },
        error: () => this.snack.open('İmtahanı silmək alınmadı', 'Bağla', { duration: 3000 })
      });
    });
  }

  scoreClass(score: number): string {
    if (score >= 4) return 'score-pass';
    if (score === 3) return 'score-mid';
    return 'score-fail';
  }
}
