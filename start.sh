#!/bin/bash

echo "Building and starting Docker services..."
# docker build -t scraper-backend ./scraper-backend
# dockeri build -t media-viewer ./media-viewer
docker-compose up --build -d

PRISMA_CONTAINER=$(docker ps --filter "name=scraper-backend" --format "{{.ID}}")

if [ -z "$PRISMA_CONTAINER" ]; then
  echo "Error: Could not find the scraper-backend container. Make sure the service name matches in your docker-compose.yml."
  exit 1
fi

docker exec -it mysql_db mysql -uroot -proot -e "CREATE DATABASE scraper;"



echo "All services are up and running!"
docker-compose ps
