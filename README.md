# DHIS2 DWH
DHIS2 to data warehouse on a cron schedule

## Installation
* Create `.env` by copying `.env.example` at the root of the project
* Update the `.env` file with necessary credentials.
* Supported `DATABASE_DIALECT` are `mssql`, `mysql`, `mariadb` or `postgres`

## Usage (Docker)
* Install docker and docker-compose ([https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/))
* From the root of the project, run `docker-compose up`

## Usage (Manual)
* Install nodejs ([https://nodejs.org/en/](https://nodejs.org/en/))
* From the root of the project, run `npm install`
* Run `node app.js` from your command line.

