"use strict";

// Import styles
import "../scss/main.scss";

import React from "react";
import ReactDOM from "react-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import Project from "./components/Project";

const domContainer = document.querySelector("#project-editor");
const projectId = domContainer.dataset.id;

const client = new ApolloClient({
  uri: "http://localhost:3000/__graphql"
});

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <Project projectId={projectId} />
    </div>
  </ApolloProvider>
);

domContainer ? ReactDOM.render(<App />, domContainer) : false;
