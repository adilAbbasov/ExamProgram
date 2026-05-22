import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lesson } from '../models/lesson.model';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/lessons`;

  getAll(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.url);
  }

  get(code: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.url}/${code}`);
  }

  create(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.url, lesson);
  }

  update(code: string, lesson: Omit<Lesson, 'lessonCode'>): Observable<void> {
    return this.http.put<void>(`${this.url}/${code}`, lesson);
  }

  delete(code: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${code}`);
  }
}
