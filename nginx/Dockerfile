FROM alpine:3.19
RUN apk update && apk upgrade && apk add nginx
RUN apk add openssl \
	&& openssl req -x509 -nodes -newkey rsa:2048 -keyout /etc/ssl/certs/certif.key -out /etc/ssl/certs/certif.csr -subj "/C=FR/ST=Charente/L=Angouleme/O=42/OU=42/CN=smalloir"
COPY conf/nginx.conf /etc/nginx/http.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
