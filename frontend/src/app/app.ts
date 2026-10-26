import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student, StudentService } from './student.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private service = inject(StudentService);

  students = signal<Student[]>([]);
  error = signal('');

  form: Student = this.emptyForm();

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.list().subscribe({
      next: (data) => this.students.set(data),
      error: () => this.error.set('Could not load students. Is the backend running?'),
    });
  }

  add(): void {
    this.error.set('');
    this.service.create(this.form).subscribe({
      next: () => {
        this.form = this.emptyForm();
        this.load();
      },
      error: (err) => {
        const detail = err?.error?.registration_number?.[0];
        this.error.set(detail ?? 'Could not save the student. Check the fields and try again.');
      },
    });
  }

  remove(student: Student): void {
    if (!student.id || !confirm(`Delete ${student.full_name}?`)) return;
    this.service.remove(student.id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Could not delete the student.'),
    });
  }

  private emptyForm(): Student {
    return { registration_number: '', full_name: '', email: '', course: '', year_of_study: 1 };
  }
}
