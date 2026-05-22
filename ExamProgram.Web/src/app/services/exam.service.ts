import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Exam, ExamCreate, ExamUpdate } from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/exams`;

  getAll(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.url);
  }

  create(exam: ExamCreate): Observable<Exam> {
    return this.http.post<Exam>(this.url, exam);
  }

  update(id: number, exam: ExamUpdate): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, exam);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
