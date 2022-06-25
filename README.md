# Mission Underwriters - Quote API

## About

The Mission API component is a REST API application component. The component is authored in JavaScript with Node.js, Express, and Mongoose. Persistent data is stored in MongoDB.

## Contribute

Developers seeking additional information about contributing to this project should read the [Contribution Guide](./contributing.md).

## Postman

A Postman collection and environment are available for import into your Postman API client. They are located in the `/etc/postman` directory. View the Postman files [here](./etc/postman).

## Install

### Install the Prerequisites

This project has the following prerequisites which must be in place before installation of the project libraries.

> **NOTE:** We recommend installing Node Version Manager ([NVM](https://github.com/nvm-sh/nvm)) on developer machines to support multiple Node.js installations.

1. [Node.js 16](https://nodejs.org/en/download/)

### Install the Dependencies

To install the project dependencies on a development machine, issue the following commands at a terminal prompt.

```bash
# if using nvm, switch to project Node version...
nvm use

# install all project production and development dependencies...
npm install
```

## Configuration

### Configuring the Project

This project uses [dotenv](https://www.npmjs.com/package/dotenv) to supply configuration parameters to the project.

When the application starts, `dotenv` loads a file named `.env` from the directory where the process was invoked, typically the project base directory.

A `.env` file is a plain text file that consists of `key=value` pairs, each key representing a single configuration parameter.

> **NOTE:** All `dotenv` parameter values become strings when loaded by the application. Values like `123` or `true` are `"123"` and `"true"` respectively.

> **NOTE:** Sensitive information should **not** be committed to the SCM repository. Configuration values for hosted environments are injected by the CI/CD pipeline.

To initialize your local development environment `.env` file, a sample file named `.env.example` has been provided. Create your `.env` file by issuing the following command at a terminal prompt.

```bash
# first, copy the example file to .env
cp .env.example .env

# then, open .env and modify the configuration values as needed
```

### Configuration Values

| name                                  | default                                                                       | description                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| EMAIL_FROM                            | no-reply@missionunderwriters.com                                              | The email From address.                                           |
| SENDGRID_API_KEY                      |                                                                               | The SendGrid email service API key.                               |
| JWT_ACCESS_EXPIRATION_MINUTES         | 30                                                                            | The number of minutes after which a refresh token expires.        |
| JWT_REFRESH_EXPIRATION_DAYS           | 1                                                                             | The number of days after which a refresh token expires.           |
| JWT_RESET_PASSWORD_EXPIRATION_MINUTES | 10                                                                            | The number of minutes after which a reset password token expires. |
| JST_SECRET                            | jWtS3creT!                                                                    | The token secret key. Used to validate token authenticity.        |
| JWT_VERIFY_EMAIL_EXPIRATION_MINUTES   | 10                                                                            | The number of minutes after which a verify email token expires.   |
| MONBODB_URL                           |                                                                               | The MongoDB connection URL.                                       |
| NODE_ENV                              | development                                                                   | The environment name. One of: development, test, production.      |
| ORIGAMI_BASE_URL                      | https://staging-api.origamirisk.com/                                          | The Origami API base URL.                                         |
| ORIGAMI_ACCOUNT                       | Mission-dev                                                                   | The Origami API account name.                                     |
| ORIGAMI_USER                          |                                                                               | The Origami API authentication user name.                         |
| ORIGAMI_PASSWORD                      |                                                                               | The Origami API authentication password.                          |
| ORIGAMI_CLIENTNAME                    | Maxwell                                                                       | The Origami API client name. (i.e. program)                       |
| ORIGAMI_AUTHENTICATION_ENDPOINT       | OrigamiApi/Authentication/Authenticate                                        | The Origami API authentication endpoint.                          |
| ORIGAMI_CREATE_MEMBER_ENDPOINT        | OrigamiApi/api/Member                                                         | The Origami API create member endpoint.                           |
| ORIGAMI_CREATE_QUOTE_ENDPOINT         | OrigamiApi/api/Proposal                                                       | The Origami API create quote endpoint.                            |
| ORIGAMI_CREATE_COVERAGE_ENDPIONT      | OrigamiApi/api/ProposalCoverage?fireEvents=true&echoFields=ProposalCoverageID | The Origami API create coverage endpoint.                         |
| ORIGAMI_GET_RATE_ENDPOINT             | OrigamiApi/api/Rating/Rate                                                    | The Origami API fetch rate endpoint.                              |
| ORIGAMI_GET_MEMBER_ENDPOINT           | OrigamiApi/api/Member/Query                                                   | The Origami API fetch member endpoint.                            |
| ORIGAMI_UPDATE_MEMBER_ENDPOINT        | OrigamiApi/api/Member                                                         | The Origami API update member endpoint.                           |
| ORIGAMI_GET_POLICIES_ENDPOINT         | OrigamiApi/api/Policy/Query                                                   | The Origami API fetch policy endpoint.                            |
| ORIGAMI_UNDERWRITER_USER              | Keith Schreiner                                                               | The Origami underwriter user name.                                |
| PORT                                  | 4000                                                                          | The port on which the application listens for requests.           |

## Initialize the Database

This application component uses a MongoDB database as the persistent data store. The database consists of several collections, some of which contain transactional data and others, reference data.

There is a standard ingestion source file named `ingestion.js`. This is invoked with the following command.

```bash
# command format
node ingestion.js [mongodb-connection-url]

# if the connection url is omitted, the ingestion script loads
# MongoDB on localhost running in Docker Compose
node ingestion.js

# if you want to "point" to a specific MongDB, then do somthing like this
node ingestion.js mongodb://user:password@host/db_name
```

### Initialize Reference Data Collections

To initialize the reference data collections, issue the following commands at a terminal prompt.

```bash
# change directory to base directory for db initialization
cd src/ignore

# for each type of reference data, we will run an ingestion process

# States
cd states
node ingestion.js
cd .. # return to the base directory for db init

# Completed Projects
cd completeprojects
node ingestion.js
cd ..

# Crew Sizes
cd crewsizes
node ingestion.js
cd ..

# Job Categories
cd jobcategories
node ingestion.js
cd ..

# Job Durations
cd jobdurations
node ingestion.js
cd ..

# Limits
cd limits
node ingestion.js
cd ..

# Zip Codes
cd zipcodes
node ingestion.js
cd ..
```

## Run

> **NOTE:** NPM scripts are used to initiate many common activies.

To run the project on a development machine using Node directly, issue the following commands at a terminal prompt.

```bash
npm run start:dev
```

To run the project with an optimized production build, issue the following commands at a terminal prompt.

```bash
# first, install dependencies optimized for production...
npm ci --production

# next, start the application with 'pm2', a Node process manager...
npm start
```

## Test

### Unit Tests

To run unit tests, issue the following commands at a terminal prompt.

```bash
# run all tests
npm test

# run all tests in watch mode; i.e. rerun tests when source code files are saved
npm run test:watch

# run all tests and produce a code coverage report
npm run coverage
```

## Static Code Analysis

### Linting

Linting statically analyzes the code to identify common problems such as coding mistakes, optimizations, security problems, and bad code smells. Linting also ensures that coding standards are enforced. This project uses the de-facto standard JavaScript linter, [ESLint](eslint).

To perform linting activities, issue the following commands at a terminal prompt.

```bash
# run ESLint
npm run lint

# run ESLint and automatically fix errors
npm run lint:fix
```

### Code Formatter

The project utilizes the [Prettier](prettier) library to ensure coding standards are followed. Prettier may be run at the command line and as a code formatter plugin for most common editors, such as VS Code.

To run Prettier from the command line, issue the following commands at a terminal prompt.

```bash
# run prettier
npm run prettier

# fix prettier errors
npm run prettier:fix
```

## Docker

> **NOTE:** To use Docker with this project you must have [Docker installed](https://docs.docker.com/get-docker/) on the machine where Docker commands will be executed, e.g. your local machine and/or a CI/CD pipeline.

This application may be packaged and run as a Docker container. Or you may run the application **and** MongoDB with Docker Compose, see the section further below.

### Building the Docker Image

To build the Docker image, issue the following command at a terminal prompt.

```bash
docker build . -t mission/quote-api
```

This command builds a Docker container image named `mission/quote-api` with the tag `latest`.

### Running the Docker Container

To run the application with Docker, first build the Docker image following the instructions in the section above.

After creating the Docker image, issue the following command at a terminal prompt to start a new running container using that image.

```bash
docker container run --publish 4000:4000 -name quote-api mission/quote-api
```

The command above starts a new Docker container in the foreground (i.e. it is **not** detached). This is fine for local development when you may wish to have the application logs printed to the console; however, it should not be used in production.

To run the container in the background (i.e. detached), issue the following command at a terminal prompt.

```bash
docker container run --publish 4000:4000 --detached mission/quote-api
```

### Manage Docker Containers

To list running Docker containers on the machine, issue the following command at a terminal prompt.

```bash
docker container ls
```

To view **ALL** containers regardless of their status, issue the following command at a terminal prompt.

```bash
docker container ls --all
```

> **NOTE:** The container list provides the container name such as `sleepy_willow`, etc. The container name is used in some container management commands illustrated below.

To stop a running container, issue the following command at a terminal prompt.

```bash
docker container stop [CONTAINER]
```

To start a stopped container, issue the following command at a terminal prompt.

```bash
docker container start [CONTAINER]
```

To remove a stopped container, issue the following command at a terminal prompt.

```bash
docker container rm [CONTAINER]
```

To remove **ALL** stopped containers, issue the following command at a terminal prompt.

```bash
docker container prune
```

## Docker Compose

This project is Docker Compose ready. Use Docker Compose to run the project **and** MongoDB on your local machine without needing to install the database.

> **NOTE:** Requires that you have Docker and Docker Compose installed.

> **NOTE:** Requires that you manually initialize the MongoDB database using the scripts in `src/ignore` the first time the MongoDB container is started or after removing the MongoDB data volume.

### Start the Application

To start the application, issue the following command at a terminal prompt.

```bash
# start the API and DB components
docker compose up [--build] --detach
```

Include the `--build` option and Docker will rebuild the application Docker image using the latest code, using that image when running the application.

### Stop the Application

To stop the application, issue the following command at a terminal prompt.

```bash
# stop the API and DB components; preserving the MongoDB data
docker compose down
```

This command stops and removes the containers and cleans up ephemeral resources. The MongoDB data volume is **not** deleted.

### View Logs

To view the logs from running compose application, issue the following command at a terminal prompt.

```bash
# view and follow the logs from all containers
docker compose logs --follow
```

Press `ctrl-C` to return to the command prompt.

### Connect to MongoDB

> **Note:** Requires that the [MongoDB shell](https://www.mongodb.com/docs/mongodb-shell/install/) be installed.

To connect to the MongoDB container running within the Docker Compose environment, issue the following commands at a terminal prompt.

```bash
# connect to MongoDB as an admin
mongosh -u root -p admin

# list databases
show dbs

# switch to the Mission database
use mission

# list collections in the database
show collections

# list items in a collection, e.g. the states collection
db.states.find()

# clear the MongoDB shell
cls

# exit the MongoDB shell
exit
```

## Related Information

[Docker](docker)  
[ESLint](eslint)  
[Express](express)  
[MongoDB](mongo)  
[Node.js](node)  
[Node Version Manager](nvm)  
[Visual Studio Code](https://code.visualstudio.com/)

[docker]: https://docs.docker.com/get-docker/ 'Install Docker'
[eslint]: https://eslint.org/ 'ESLint'
[express]: https://expressjs.com/ 'Express'
[mongo]: https://www.mongodb.com/ 'MongoDB'
[node]: https://nodejs.org/en/download/ 'Install Node.js'
[nvm]: https://github.com/nvm-sh/nvm 'Install Node Version Manager'
