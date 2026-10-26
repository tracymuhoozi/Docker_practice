import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{ Observable }from'rxjs';

export interface Student {
  id?: number;
  registration_number: string;
  full_name: string;
  email: string;
  course: string;
  year_of_study: number;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  // Relative URL: nginx (in Docker) or the dev proxy forwards /api to Django.
  private url = '/api/students/';

  list(): Observable<Student[]> {
    return this.http.get<Student[]>(this.url);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(this.url, student);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}${id}/`);
  }
}
