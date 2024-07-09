#!/bin/sh

# create admin
python manage.py createsuperuser --username $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL --noinput

# run server at 0.0.0.0:8000
python manage.py runserver 0.0.0.0:8000

# lancer python avec gunicorn wsgi
# gunicorn pong.wsgi
# gunicorn $PROJECT_NAME.wsgi