FROM alpine:3.19
RUN apk update && apk upgrade

# install python 3.12 and its package manager pip
RUN apk --no-cache add python3 py3-pip

# install django and dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt --break-system-packages

WORKDIR /django
COPY . /django

# make database migrations to silence error
RUN python manage.py makemigrations
RUN python manage.py migrate

# create adim and run server
COPY runserv.sh runserv.sh
CMD ["sh", "./runserv.sh"]
