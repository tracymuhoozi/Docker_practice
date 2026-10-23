from rest_framework.test import APITestCase

from .models import Student


class StudentApiTests(APITestCase):
    payload = {
        "registration_number": "KAB/2026/001",
        "full_name": "Tracy Muhoozi",
        "email": "tracy@example.com",
        "course": "Information Technology",
        "year_of_study": 3,
    }

    def test_create_and_list(self):
        res = self.client.post("/api/students/", self.payload, format="json")
        self.assertEqual(res.status_code, 201)
        res = self.client.get("/api/students/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 1)
        self.assertEqual(res.json()[0]["full_name"], "Tracy Muhoozi")

    def test_duplicate_registration_number_rejected(self):
        self.client.post("/api/students/", self.payload, format="json")
        res = self.client.post("/api/students/", self.payload, format="json")
        self.assertEqual(res.status_code, 400)

    def test_delete(self):
        student = Student.objects.create(**self.payload)
        res = self.client.delete(f"/api/students/{student.id}/")
        self.assertEqual(res.status_code, 204)
        self.assertEqual(Student.objects.count(), 0)