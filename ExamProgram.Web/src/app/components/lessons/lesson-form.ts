import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Lesson } from '../../models/lesson.model';

export interface LessonFormData {
  lesson: Lesson | null;
}

@Component({
  selector: 'app-lesson-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './lesson-form.html',
  styleUrl: './lesson-form.scss'
})
export class LessonForm {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<LessonForm>);

  isEdit: boolean;
  grades = Array.from({ length: 12 }, (_, i) => i + 1);

  form = this.fb.group({
    lessonCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    lessonName: ['', [Validators.required, Validators.maxLength(30)]],
    grade: [9, [Validators.required, Validators.min(1), Validators.max(12)]],
    teacherFirstName: ['', [Validators.required, Validators.maxLength(20)]],
    teacherLastName: ['', [Validators.required, Validators.maxLength(20)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: LessonFormData) {
    this.isEdit = data.lesson !== null;

    if (data.lesson) {
      this.form.patchValue(data.lesson);
      this.form.controls.lessonCode.disable();
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.ref.close(this.form.getRawValue());
  }

  cancel(): void {
    this.ref.close();
  }
}
