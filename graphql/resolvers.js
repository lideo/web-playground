const { AuthenticationError } = require("apollo-server-express");
const he = require("he");

/**
 * Checks if the user is on the context object.
 * Continues to the next resolver if true.
 * @param {Function} next next resolver function ro run
 */
const authenticate = next => (parent, args, context, info) => {
  if (!context.user) {
    throw new AuthenticationError("User is not authenticated.");
  }
  return next(parent, args, context, info);
};

const getProjectByIdAndUser = async (projectModel, id, user) => {
  const project = await projectModel
    .findOne({
      _id: id,
      user: user.id
    })
    .populate("user")
    .exec();

  if (project == null) {
    throw new Error("Error retrieving project.");
  }

  project.html_code = he.decode(project.html_code);
  project.css_code = he.decode(project.css_code);
  project.js_code = he.decode(project.js_code);

  return project;
};


// TODO https://medium.com/paypal-engineering/graphql-resolvers-best-practices-cd36fdbcef55
// Leer: https://engineering.shopify.com/blogs/engineering/solving-the-n-1-problem-for-graphql-through-batching
// Leer: https://github.com/graphql/dataloader

const resolvers = {
  Query: {
    project: authenticate((parent, { id }) => ({ id }))
  },
  Mutation: {
    updateProject: authenticate(async (parent, { input }, { user, models }) => {
      try {
        await models.Project.updateOne(
          {
            _id: input.id,
            user: user.id
          },
          {
            $set: {
              name: input.name,
              html_code: input.html_code,
              css_code: input.css_code,
              js_code: input.js_code
            }
          }
        );

        const project = await getProjectByIdAndUser(
          models.Project,
          input.id,
          user
        );

        return project;
      } catch (err) {
        throw new Error("Error updating project.", err.message);
      }
    })
  },
  Project: {
    id: authenticate(async ({ id }) => {
      return id;
    }),
    name: authenticate(async ({ id }, args, { user, models }) => {
      const { name } = await getProjectByIdAndUser(models.Project, id, user);
      return name;
    }),
    html_code: authenticate(async ({ id }, args, { user, models }) => {
      const { html_code } = await getProjectByIdAndUser(
        models.Project,
        id,
        user
      );
      return html_code;
    }),
    css_code: authenticate(async ({ id }, args, { user, models }) => {
      const { css_code } = await getProjectByIdAndUser(
        models.Project,
        id,
        user
      );
      return css_code;
    }),
    js_code: authenticate(async ({ id }, args, { user, models }) => {
      const { js_code } = await getProjectByIdAndUser(models.Project, id, user);
      return js_code;
    })
  }
};

module.exports = resolvers;
