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
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { azSortData } from '../../utils/az-sort';
import { StatsService } from '../../services/stats.service';
import { StudentForm } from './student-form';
import { Avatar } from '../shared/avatar/avatar';
import { SkeletonTable } from '../shared/skeleton-table/skeleton-table';
import { EmptyState } from '../shared/empty-state/empty-state';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-students-list',
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
  templateUrl: './students-list.html',
  styleUrl: './students-list.scss'
})
export class StudentsList implements OnInit {
  private service = inject(StudentService);
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

  students = signal<Student[]>([]);
  loading = signal(false);
  search = signal('');
  displayedColumns = ['name', 'studentNumber', 'grade', 'actions'];
  dataSource = (() => {
    const ds = new MatTableDataSource<Student>([]);
    ds.sortData = (data, sort) => azSortData(data, sort, (item: Student, key: string) => {
      if (key === 'fullName') return `${item.firstName} ${item.lastName}`;
      return (item as any)[key];
    });
    return ds;
  })();

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const all = this.students();
    if (!q) return all;
    return all.filter(s =>
      String(s.studentNumber).includes(q) ||
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
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
        this.students.set(data);
        this.syncDataSource();
        this.loading.set(false);
        this.stats.refresh();
      },
      error: () => {
        this.snack.open('Şagirdləri yükləmək alınmadı', 'Bağla', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.syncDataSource();
  }

  openAdd(): void {
    const ref = this.dialog.open(StudentForm, { data: { student: null } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.service.create(result).subscribe({
        next: () => {
          this.snack.open('Şagird əlavə edildi', 'Bağla', { duration: 2000 });
          this.load();
        },
        error: err => this.snack.open(err.error ?? 'Şagirdi əlavə etmək alınmadı', 'Bağla', { duration: 3000 })
      });
    });
  }

  openEdit(student: Student): void {
    const ref = this.dialog.open(StudentForm, { data: { student } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      const { studentNumber, ...rest } = result;
      this.service.update(student.studentNumber, rest).subscribe({
        next: () => {
          this.snack.open('Şagird məlumatları yeniləndi', 'Bağla', { duration: 2000 });
          this.load();
        },
        error: () => this.snack.open('Şagirdi yeniləmək alınmadı', 'Bağla', { duration: 3000 })
      });
    });
  }

  remove(student: Student): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        message: `${student.firstName} ${student.lastName} (#${student.studentNumber}) şagirdi silinəcək.`,
        warning: 'Bu şagirdə aid bütün imtahan qeydləri silinəcək.',
        confirmText: 'Sil',
        cancelText: 'Ləğv et',
        variant: 'danger'
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.service.delete(student.studentNumber).subscribe({
        next: () => {
          this.snack.open('Şagird silindi', 'Bağla', { duration: 2000 });
          this.load();
        },
        error: () => this.snack.open('Şagirdi silmək alınmadı', 'Bağla', { duration: 3000 })
      });
    });
  }
}
