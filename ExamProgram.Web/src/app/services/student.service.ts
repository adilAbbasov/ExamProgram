import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/students`;

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.url);
  }

  get(number: number): Observable<Student> {
    return this.http.get<Student>(`${this.url}/${number}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.url, student);
  }

  update(number: number, student: Omit<Student, 'studentNumber'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${number}`, student);
  }

  delete(number: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${number}`);
  }
}
