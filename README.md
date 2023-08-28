
# Pafin Tech Assignment

This is a simple NestJS project that demonstrates CRUD (Create, Read, Update, Delete) operations for managing user information. The project uses a PostgreSQL database to store user data and provides API endpoints for managing users.

## Features

- Create a new user
- Retrieve user information
- Update user information
- Delete a user

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have at least those components on your workstation:

- NodeJS (v16.19.1)
- YARN (1.22.19)
- PostgreSQL 15

### 1.2 Project configuration

Start by cloning this project on your workstation.

``` sh
git clone https://github.com/NBristy/pafin-assignment.git
```

The next thing will be to install all the dependencies of the project.

```sh
yarn
```

### 1.3 Configure the Database

Once the dependencies are installed, you can now configure your project by creating a new `.env` file containing your environment variables used for development.

Create a .env file in the root directory of your project and add your database-related environment variables. Please use the following template for `.env` file.
```sh
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=username
DB_PASSWORD=password
DB_DATABASE=mydatabase
```

### 1.4 How to run
Launch the development server

```sh
yarn start:dev
```

You can now head to `http://localhost:3000/api` and see your API Swagger docs.

## 2. How to test

You can test the API by running the following command

```sh
yarn test
```

## 3. Project structure

This is the structure of the project.

```sh
src/
├── auth/
│   ├── auth.controller.spec.ts
│   ├── auth.controller.ts
│   ├── auth.dto.ts
│   ├── auth.module.ts
│   ├── auth.service.spec.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   └── jwt.strategy.ts
├── entity/
│   └── user.entity.ts
├── migration/
├── user/
│   ├── user.controller.spec.ts
│   ├── user.controller.ts
│   ├── user.dto.ts
│   ├── user.module.ts
│   ├── user.service.spec.ts
│   └── user.service.ts
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```