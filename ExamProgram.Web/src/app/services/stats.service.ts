import { Injectable, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LessonService } from './lesson.service';
import { StudentService } from './student.service';
import { ExamService } from './exam.service';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private lessons = inject(LessonService);
  private students = inject(StudentService);
  private exams = inject(ExamService);

  lessonsCount = signal(0);
  studentsCount = signal(0);
  examsCount = signal(0);

  refresh(): void {
    forkJoin({
      lessons: this.lessons.getAll(),
      students: this.students.getAll(),
      exams: this.exams.getAll()
    }).subscribe(({ lessons, students, exams }) => {
      this.lessonsCount.set(lessons.length);
      this.studentsCount.set(students.length);
      this.examsCount.set(exams.length);
    });
  }
}
