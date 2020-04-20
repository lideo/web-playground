const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Project {
    id: ID!
    name: String!
    html_code: String
    css_code: String
    js_code: String
  }

  input UpdateProjectInput {
    id: ID!
    name: String!
    html_code: String
    css_code: String
    js_code: String
  }


  type Query {
    project(id: ID!): Project!
  }

  type Mutation {
    updateProject(input: UpdateProjectInput): Project!
  }
`;

module.exports = typeDefs;
