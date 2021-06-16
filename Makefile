.PHONY: ps down

up:
	docker-compose --env-file ./.env.production build --no-cache
	-docker-compose --env-file ./.env.production up -d

ps:
	docker-compose --env-file ./.env.production ps

down:
	-docker-compose --env-file ./.env.production down
