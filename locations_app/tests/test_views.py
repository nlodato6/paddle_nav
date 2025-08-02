from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from locations_app.models import RecreationArea, LocationCategory
from django.contrib.gis.geos import Point

User = get_user_model()

class RecreationAreaAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='pass')
        self.client = APIClient()
        self.client.login(username='tester', password='pass')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        self.category = LocationCategory.objects.create(name="Park")

        self.area = RecreationArea.objects.create(
            name="Test Park",
            geom=Point(-80.0, 25.0),
            city="Miami",
            submitted_by=self.user
        )

    def test_edit_location(self):
        url = reverse('edit_location', kwargs={'pk': self.area.pk})
        data = {
            'name': "Test Park Updated",
            'city': "Miami Beach",
            'geom': {'type': 'Point', 'coordinates': [-80.0, 25.0]},
            'location_category': self.category.id,
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], "Test Park Updated")

    def test_create_location(self):
        url = reverse('create_location')
        data = {
            'name': "New Park",
            'geom': {'type': 'Point', 'coordinates': [-81.0, 26.0]},
            'city': "Orlando",
            'location_category': self.category.id,
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], "New Park")

    def test_cannot_edit_official_data(self):
        official_area = RecreationArea.objects.create(
            name="Official Park",
            geom=Point(-80.0, 25.0),
            city="Miami",
            is_official_data=True,
        )
        url = reverse('edit_location', kwargs={'pk': official_area.pk})
        data = {'name': "Should Fail"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, 403)
