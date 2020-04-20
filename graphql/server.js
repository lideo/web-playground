const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./typedefs");
const resolvers = require("./resolvers");
const User = require("../models/user");
const Project = require("../models/project");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    // We include 'user' in the context for authenticated
    // requests. We check if the user is authenticated before
    // executing the resolvers.
    user: req.user,
    models: {
      Project,
      User
    }
  })
});

module.exports = server;
