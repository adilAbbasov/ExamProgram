import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Student } from '../../models/student.model';

export interface StudentFormData {
  student: Student | null;
}

@Component({
  selector: 'app-student-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss'
})
export class StudentForm {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<StudentForm>);

  isEdit: boolean;
  grades = Array.from({ length: 12 }, (_, i) => i + 1);

  form = this.fb.group({
    studentNumber: [null as number | null, [Validators.required, Validators.min(1), Validators.max(99999)]],
    firstName: ['', [Validators.required, Validators.maxLength(30)]],
    lastName: ['', [Validators.required, Validators.maxLength(30)]],
    grade: [9, [Validators.required, Validators.min(1), Validators.max(12)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: StudentFormData) {
    this.isEdit = data.student !== null;

    if (data.student) {
      this.form.patchValue(data.student);
      this.form.controls.studentNumber.disable();
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
