# Contributing to this Project

This document serves as a guide for developers who contribute to this project.

> **NOTE:** This document should be reviewed periodically for accuracy.

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route handlers (controller layer)
 |--docs\           # Swagger files (api doc)
 |--etc\            # Ancillary project support files.
 |--middlewares\    # Custom express middleware
 |--models\         # Mongoose models (data layer)
 |--routes\         # Express routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the application locally and navigate to `http://localhost:4000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/logout` - logout\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password\
`POST /v1/auth/send-verification-email` - send verification email\
`POST /v1/auth/verify-email` - verify email

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:userId` - get user (by identifier)\
`PUT /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user\
`PUT /v1/users/:userId/password` - update user to change password\
`PUT /v1/users/:userId/email` - update user to change email address\

**State routes**:\
`POST /v1/states` - create one to many state options\
`PUT /v1/states` - update a collection of state options\
`DELETE /v1/states` - delete a collection of state options\
`GET /v1/states` - get all states options\
`GET /v1/states/:stateId` - get state option (by identifier)\
`GET /v1/states/zipcodes/:zipCode` - get state option (by ZIP Code)\

**Quote routes**:\
`POST /v1/quotes/getestimatedquotation` - create an estimated quote\
`POST /v1/quotes/getactualquotation` - create an officially rated quote\
`GET /v1/quotes/getQuotationByUserId/:userId` - get all quotes for a user\
`GET /v1/quotes/:quoteId` - get quote (by identifier)\

**Job Category routes**:\
`POST /v1/jobcategories` - create one to many job category options\
`PUT /v1/jobcategories` - update a collection of job category options\
`DELETE /v1/jobcategories` - delete a collection of job category options\
`GET /v1/jobcategories` - get all job category options\
`GET /v1/jobcategories/:jobCategoryId` - get job category option (by identifier)\

**Limit routes**:\
`POST /v1/limits` - create one to many limits\
`PUT /v1/limits` - update a collection of limits\
`DELETE /v1/limits` - delete a collection of limits\
`GET /v1/limits` - get all limits\
`GET /v1/limits/limitId` - get limit (by identifier)\

**Complete Project routes**:\
`POST /v1/completeprojects` - create one to many complete project options\
`PUT /v1/completeprojects` - update a collection of complete project options\
`DELETE /v1/completeprojects` - delete a collection of complete project options\
`GET /v1/completeprojects` - get all complete project options\
`GET /v1/completeprojects/:completeProjectId` - get complete project option (by identifier)\

**Job Duration routes**:\
`POST /v1/jobdurations` - create one to many job duration options\
`PUT /v1/jobdurations` - update a collection of job duration options\
`DELETE /v1/jobdurations` - delete a collection of job duration options\
`GET /v1/jobdurations` - get all job durations\
`GET /v1/jobdurations/:jobDurationId` - get job duration (by identifier)\

**Crew routes**:\
`POST /v1/crews` - create one to many crew size options\
`PUT /v1/crews` - update a collection of crew size options\
`DELETE /v1/crews` - delete a collection of crew size options\
`GET /v1/crews` - get all crew size options\
`GET /v1/crews/:crewId` - get crew size option (by identifier)\

**Member routes**:\
`GET /v1/members` - get all members\
`GET /v1/members/:memberId` - get member (by identifier)\
`PUT /v1/members/updatemember/:memberId` - update member\

**Policy routes**:\
`PUT /v1/policies/updatepolicynumber` - update policy\
`GET /v1/policies` - get all policies\
`GET /v1/policies/:userId` - get all policies for a user\

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
const catchAsync = require('../utils/catchAsync');

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
};
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', validate(userValidation.createUser), userController.createUser);
```

## Authentication

To require authentication for certain routes, you can use the `auth` middleware.

```javascript
const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', auth(), userController.createUser);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /v1/auth/register`) or login (`POST /v1/auth/login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 30 minutes. You can modify this expiration time by changing the `JWT_ACCESS_EXPIRATION_MINUTES` environment variable in the .env file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /v1/auth/refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for 30 days. You can modify this expiration time by changing the `JWT_REFRESH_EXPIRATION_DAYS` environment variable in the .env file.

## Authorization

The `auth` middleware can also be used to require certain rights/permissions to access a route.

```javascript
const express = require('express');
const auth = require('../../middlewares/auth');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/users', auth('manageUsers'), userController.createUser);
```

In the example above, an authenticated user can access this route only if that user has the `manageUsers` permission.

The permissions are role-based. You can view the permissions/rights of each role in the `src/config/roles.js` file.

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require('<path to src>/config/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## Custom Mongoose Plugins

The app also contains 2 custom mongoose plugins that you can attach to any mongoose model schema. You can find the plugins in `src/models/plugins`.

```javascript
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    /* schema definition here */
  },
  { timestamps: true }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
```

### toJSON

The toJSON plugin applies the following changes in the toJSON transform call:

- removes \_\_v, createdAt, updatedAt, and any schema path that has private: true
- replaces \_id with id

### paginate

The paginate plugin adds the `paginate` static method to the mongoose schema.

Adding this plugin to the `User` model schema will allow you to do the following:

```javascript
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};
```

The `filter` param is a regular mongo filter.

The `options` param can have the following (optional) fields:

```javascript
const options = {
  sortBy: 'name:desc', // sort order
  limit: 5, // maximum results per page
  page: 2, // page number
};
```

The plugin also supports sorting by multiple criteria (separated by a comma): `sortBy: name:desc,role:asc`

The `paginate` method returns a Promise, which fulfills with an object having the following properties:

```json
{
  "results": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```

## Linting

Linting is performed with [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).
