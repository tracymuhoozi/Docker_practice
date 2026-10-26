import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { Student } from './student.service';

const sample: Student = {
  id: 1,
  registration_number: '2024/BIT/001',
  full_name: 'Tracy Muhoozi',
  email: 'tracy@example.com',
  course: 'BCS',
  year_of_study: 3,
};

describe('App', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates the app and loads students on init', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    http.expectOne('/api/students/').flush([sample]);
    fixture.detectChanges();

    expect(fixture.componentInstance.students()).toEqual([sample]);
    expect(fixture.nativeElement.textContent).toContain('Tracy Muhoozi');
  });

  it('shows the empty state when there are no students', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    http.expectOne('/api/students/').flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No students yet');
  });

  it('shows an error message when the backend is unreachable', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    http.expectOne('/api/students/').error(new ProgressEvent('error'));
    fixture.detectChanges();

    expect(fixture.componentInstance.error()).toContain('Could not load students');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('posts the form and reloads the list when adding a student', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    http.expectOne('/api/students/').flush([]);

    fixture.componentInstance.form = { ...sample, id: undefined };
    fixture.componentInstance.add();

    const post = http.expectOne((r) => r.method === 'POST' && r.url === '/api/students/');
    expect(post.request.body.full_name).toBe('Tracy Muhoozi');
    post.flush(sample);

    http.expectOne('/api/students/').flush([sample]);
    expect(fixture.componentInstance.students().length).toBe(1);
    expect(fixture.componentInstance.form.full_name).toBe('');
  });

  it('shows the duplicate registration number error from the API', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    http.expectOne('/api/students/').flush([]);

    fixture.componentInstance.add();
    http
      .expectOne((r) => r.method === 'POST')
      .flush({ registration_number: ['student with this registration number already exists.'] }, { status: 400, statusText: 'Bad Request' });

    expect(fixture.componentInstance.error()).toContain('already exists');
  });
});