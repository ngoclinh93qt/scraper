#!/bin/bash

echo "Building and starting Docker services..."
docker-compose up --build -d

PRISMA_CONTAINER=$(docker ps --filter "name=scraper-backend" --format "{{.ID}}")

if [ -z "$PRISMA_CONTAINER" ]; then
  echo "Error: Could not find the scraper-backend container. Make sure the service name matches in your docker-compose.yml."
  exit 1
fi


#
# echo "start playwright"
# docker exec -it "$PRISMA_CONTAINER" npx playwright install
# docker exec -it "$PRISMA_CONTAINER" npx playwright install-deps
#


echo "All services are up and running!"
docker-compose ps
