# Blog-API

Backend for blog pet project. Under development.

## Stack:
1. Node.js
2. Express
3. MongoDB
4. Rest API

## Improvement plans:
1. Refactoring routes to make code more clean.
2. Connect Jest and create and set up testing.
3. Expand user and post fields by adding new functionality.


## Deployment Instructions:
1. Clone `$ git clone https://github.com/GutNick/Blog-API.git`
2. Go to directory `$ cd blog-api`
3. Install dependencies`$ npm install`
4. Run app `$ npm run start` for production, or `$ npm run dev` for development.
5. Connect to [localhost:3001](http://localhost:3001/) for testing and development.

## Routes
- `POST` `/signup` - create user.
- `POST` `/signin` - login.
- `GET` `/user` - get all users.
- `GET` `/user/:id` - get the specified user.
- `PATCH` `/user/:id` - update the specified user.
- `DELETE` `/user/:id` - delete the specified user.
- `POST` `post` - create post.
- `GET` `/post` - get all posts.
- `GET` `/post/:id` - get the specified user.
- `PATCH` `/post/:id` - update the specified user.
- `DELETE` `/post/:id` - delete the specified user.
