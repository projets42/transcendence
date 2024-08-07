NAME = transcendence

all: up

build:
	@echo "\033[34mBuilding configuration ${NAME}...\033[0m"
	@docker compose -f ./srcs/docker-compose.yml build

up:
	@echo "\033[34mLaunching configuration ${NAME}...\033[0m"
	@docker compose -f ./srcs/docker-compose.yml up -d

down:
	@echo "\033[34mStopping configuration ${NAME}...\033[0m"
	@docker compose -f ./srcs/docker-compose.yml down -v

clean: down
	@echo "\033[34mCleaning configuration ${NAME}...\033[0m"
	@docker system prune -a

fclean: down
	@echo "\033[34mTotal clean of all Docker configurations\033[0m"
	@if [ $$(docker ps -q | wc -l) -gt 0 ]; then \
	    docker stop $$(docker ps -qa); \
	fi
	@docker system prune --all --force --volumes
	@docker network prune --force
	@docker volume prune --force

re: down
	@echo "\033[34mRebuilding configuration ${NAME}...\033[0m"
	@docker compose -f ./srcs/docker-compose.yml up -d --build

.PHONY: all build down re clean fclean
