from django.db import models


class Student(models.Model):
    registration_number = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(max_length=120)
    email = models.EmailField(blank=True)
    course = models.CharField(max_length=120)
    year_of_study = models.PositiveSmallIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["full_name"]

    def __str__(self):
        return f"{self.registration_number} - {self.full_name}"