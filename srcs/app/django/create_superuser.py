import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')
import django
django.setup()

from django.contrib.auth.models import User

if not User.objects.filter(username='admin').exists():
	User.objects.create_superuser(os.getenv('DJANGO_SUPERUSER_USERNAME'), os.getenv('DJANGO_SUPERUSER_EMAIL'), os.getenv('DJANGO_SUPERUSER_PASSWORD'))