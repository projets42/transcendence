FROM alpine:3.19
RUN apk update && apk upgrade

# install postgresql
RUN apk --no-cache add postgresql

# export data directory path
ENV PGDATA /var/lib/postgresql/data

# create required directories for postgresql
# RUN mkdir -p /home/postgres && chown -R postgres:postgres /home/postgres
RUN mkdir -p /run/postgresql && chown -R postgres:postgres /run/postgresql/
RUN mkdir -p "$PGDATA" && chown -R postgres:postgres "$PGDATA"

# WORKDIR /home/postgres
# COPY req req
# COPY sql.sh sql.sh

# change user to postgres because root can't do initdb and postgres commands
USER postgres

# initialize database
# RUN initdb --auth-host=cert
RUN initdb

# launch server
CMD ["postgres"]
# CMD ["sh", "sql.sh"]