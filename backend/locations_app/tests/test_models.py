from django.test import TestCase
from django.contrib.auth import get_user_model
from locations_app.models import RecreationArea, RecreationType, LocationCategory, Favorite
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point

User = get_user_model()

class RecreationAreaModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='pass')
        self.category = LocationCategory.objects.create(name="Park")
        self.type1 = RecreationType.objects.create(name="Hiking")

    def test_create_recreation_area(self):
        area = RecreationArea(
            name="Test Park",
            description="Nice place",
            geom=Point(-80.0, 25.0),
            city="Miami",
            location_category=self.category,
            submitted_by=self.user,
        )
        area.full_clean()  # calls clean() and validates fields
        area.save()
        area.recreation_type.add(self.type1)

        self.assertEqual(area.name, "Test Park")
        self.assertFalse(area.is_official_data)
        self.assertEqual(area.submitted_by.username, 'tester')

    def test_clean_official_data_with_submitted_by_raises(self):
        area = RecreationArea(
            name="Official Park",
            geom=Point(-80.0, 25.0),
            city="Miami",
            is_official_data=True,
            submitted_by=self.user,
        )
        with self.assertRaises(ValidationError):
            area.full_clean()

    def test_favorite_unique_constraint(self):
        area = RecreationArea.objects.create(
            name="Fav Park",
            geom=Point(-80.0, 25.0),
            city="Miami",
            submitted_by=self.user,
        )
        favorite1 = Favorite.objects.create(user=self.user, location=area)
        with self.assertRaises(Exception):  # IntegrityError or ValidationError depending on DB/backend
            Favorite.objects.create(user=self.user, location=area)