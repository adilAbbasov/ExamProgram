import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { LessonsList } from './components/lessons/lessons-list';
import { StudentsList } from './components/students/students-list';
import { ExamsList } from './components/exams/exams-list';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'lessons', pathMatch: 'full' },
      { path: 'lessons', component: LessonsList },
      { path: 'students', component: StudentsList },
      { path: 'exams', component: ExamsList }
    ]
  },
  { path: '**', redirectTo: '' }
];
