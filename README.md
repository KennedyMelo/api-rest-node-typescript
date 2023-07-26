
# api-rest-node-typescript

A powerful and scalable REST API developed in Node.js with TypeScript. This project uses SQLite3 and PostgreSQL as databases, and includes features like JWT authentication, password encryption, data validation with Yup, migrations and seeds with Knex, authentication-protected endpoints, pagination, search filters, extensive Jest test suite, clean code, and a query builder.

## Features

- JWT authentication for secure user sessions
- Password encryption using cryptographic hash algorithms
- Data validation with Yup
- Migrations and seeds with Knex for easy database management
- Authentication-protected endpoints
- Pagination and search filters for efficient data retrieval
- Extensive test suite with Jest for ensuring code quality
- Clean architecture with providers, models, services, controllers, routes, tests, and middlewares
- Query builder for simplified database queries

## Getting Started

To get started with the project, follow the instructions below.

### Install the dependencies
```
$ yarn install
```

### set the enviroment variables in a .env file and put in the project root with the following content:
```
PORT=3333
NODE_ENV=dev

IS_LOCALHOST=true

ENABLED_CORS=[address list separated by ";"] or only * to allow every platform access.
JWT_SECRET=[any string]
```

# To Run:
```
$ yarn start
``` 

### This API was deployed in the Heroku, to access:
-  [https://api-node-typescript-cidades-a3f4e8a1b4eb.herokuapp.com/](https://api-node-typescript-cidades-a3f4e8a1b4eb.herokuapp.com/).
