# JWT Authentication with GraphQL, Apollo Server and MongoDB

- User authentication with GraphQL, Apollo Server and MongoDB with Mongoose ORM.
- Protected routes with context (req,res) middleware to verify access token per resolvers' needs.
- Access generated on login and register mutations, with refresh tokens generated and sent as a cookie.
- Verifying a refresh token takes place in its own route /refresh_token using cookie parser and returns a new access token upon success. AFAIK, decoding cookies is not possible using GraphQL, hence using Apollo Server Express.

## The why behind the tech

- GraphQL - Fun to use, reduces overfetching and underfetching, make as many network requests as we want.
- Apollo Server - Most popular and easiest to set up, note the package is Apollo Server Express which allows us to access Express routes for sending cookies. If you were running Apollo Server on its own, you'd have to [switch](https://www.apollographql.com/docs/apollo-server/integrations/middleware/#swapping-out-apollo-server). Fortunately its a pain-free process.
- MongoDB with Mongoose - Quick and easy to set up, little to no provisioning. However, this can easily be substituted for any database of choice. PlanetScale and Prisma ORM come to mind.
- JWT - As far as authentication goes, JWT is relatively easy to understand and implement. Coupled with refresh and access tokens, its a good solution for a small project of choice.

## Great, but how to consume this on the client?

Good question

## Production Ready?

No, just implement it in to your side project and maybe you'll learn something (like I did, this stuff is pretty cool but confusing at times)

## Installation

1. Clone repository.
2. Run npm install.
3. Create a MongoDB account, and set up MongoDB Cloud with the database. Follow [this guide](https://www.mongodb.com/docs/atlas/getting-started/) guide to do so.
4. An optional step, install MongoDB Compass, a desktop app to monitor your database. Connect via the connection string generated through MongoDB cloud.
5. Create a .env file that contains your port number, MONGO_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET secret.
6. Npm run start and head to /4000/graphql to experiement.
