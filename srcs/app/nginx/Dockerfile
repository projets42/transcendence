FROM    nginx:latest
EXPOSE  8443

# SSL certificate
RUN	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout etc/ssl/private/server.key -out etc/ssl/certs/server.crt \
        -subj "/C=FR/ST=Charente/L=Angouleme/O=42/OU=42/CN=smalloir"

# Copy nginx.conf file
COPY    ./conf/nginx.conf /etc/nginx/conf.d/default.conf