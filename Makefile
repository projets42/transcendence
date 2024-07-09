
IMAGE	=	django

all:
	docker compose build
	docker compose up -d

build:
	docker build -t $(IMAGE) .

run:
	docker run -d -p 8000:8000 $(IMAGE)

clean:
	docker compose down

fclean:	clean
	@docker rm -f $$(docker ps -qa) 2>/dev/null || echo "no container to delete"
	@docker image rm -f $$(docker image ls -q) 2>/dev/null || echo "no image to delete"
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || echo "no volume to delete"
	docker system prune -af --volumes

re: fclean all

rb: fclean build run

.PHONY: all build run fclean re