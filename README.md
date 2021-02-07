# Red Team Dashboard

This was created to help coordinate information sharing for CCDC competitions.

## Architecture
### API
Express NodeJS with a Mongo datastore and RabbitMQ for distributing jobs
### Frontend
React frontend for users to work with
### Workers
Javascript wrapper for nmap, subscribes to a RabbitMQ to get jobs and posts results to the API

## Running
For ease there is a docker-compose.yml that should just work, other then the slack integration.  You should update the environment variables as appropriate.

On first execution, this will create a user named admin@local and ouput a random password to stdout. 


