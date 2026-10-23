from rest_framework import serializers

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "registration_number",
            "full_name",
            "email",
            "course",
            "year_of_study",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]