import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Lesson } from '../../models/lesson.model';
import { Student } from '../../models/student.model';
import { Exam } from '../../models/exam.model';
import { LessonService } from '../../services/lesson.service';
import { StudentService } from '../../services/student.service';

export interface ExamFormData {
  exam: Exam | null;
}

@Component({
  selector: 'app-exam-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  templateUrl: './exam-form.html',
  styleUrl: './exam-form.scss'
})
export class ExamForm implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<ExamForm>);
  private lessonService = inject(LessonService);
  private studentService = inject(StudentService);

  isEdit: boolean;
  lessons: Lesson[] = [];
  students: Student[] = [];
  scores = [1, 2, 3, 4, 5];

  form = this.fb.group({
    lessonCode: ['', Validators.required],
    studentNumber: [null as number | null, Validators.required],
    examDate: [new Date(), Validators.required],
    score: [5, [Validators.required, Validators.min(1), Validators.max(5)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ExamFormData) {
    this.isEdit = data.exam !== null;
  }

  ngOnInit(): void {
    this.lessonService.getAll().subscribe(d => this.lessons = d);
    this.studentService.getAll().subscribe(d => this.students = d);

    if (this.data.exam) {
      this.form.patchValue({
        lessonCode: this.data.exam.lessonCode,
        studentNumber: this.data.exam.studentNumber,
        examDate: new Date(this.data.exam.examDate),
        score: this.data.exam.score
      });
      this.form.controls.lessonCode.disable();
      this.form.controls.studentNumber.disable();
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const d = raw.examDate!;
    const examDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.ref.close({
      lessonCode: raw.lessonCode,
      studentNumber: raw.studentNumber,
      examDate,
      score: raw.score
    });
  }

  cancel(): void {
    this.ref.close();
  }
}
