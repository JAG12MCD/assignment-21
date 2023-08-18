// Schemas/resolvers.js
const {
    getSingleUser,
    createUser,
    login,
    saveBook,
    deleteBook
  } = require('../controllers/user-controller');
  
  const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (!context.user) {
          throw new Error('You must be logged in!');
        }
        return getSingleUser({ user: context.user });
      }
    },
    Mutation: {
      login: async (parent, { email, password }) => {
        const user = await login({ body: { email, password } });
        if (!user) {
          throw new Error('Login failed!');
        }
        return user;  // it will return { token, user }
      },
      addUser: async (parent, { username, email, password }) => {
        const user = await createUser({ body: { username, email, password } });
        if (!user) {
          throw new Error('User creation failed!');
        }
        return user;  // it will return { token, user }
      },
      saveBook: async (parent, args, context) => {
        if (!context.user) {
          throw new Error('You must be logged in!');
        }
        return saveBook({ user: context.user, body: args.input });
      },
      removeBook: async (parent, { bookId }, context) => {
        if (!context.user) {
          throw new Error('You must be logged in!');
        }
        return deleteBook({ user: context.user, params: { bookId } });
      }
    }
  };
  
  module.exports = resolvers;
  