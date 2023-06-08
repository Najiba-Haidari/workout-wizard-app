// const express = require('express');
// const {ApolloServer} = require('apollo-server-express')
// const path = require('path');
// const db = require('./config/connection');
// const {typeDefs, resolvers} = require('./schemas')
// const {authMiddleware} = require('./utils/auth')
// //const routes = require('./api')
// require('dotenv').config()
// const app = express();
// const PORT = process.env.PORT || 3001;
// const server = new ApolloServer({typeDefs, resolvers, context:authMiddleware})

// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
// // app.use(routes);

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/build')));
// }
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
//   });


// const startApolloServer = async () => {
//     await server.start();
//     server.applyMiddleware({app});

//     db.once('open', () => {
//         app.listen(PORT, () => {
//             console.log(`API server running on port ${PORT}!`);
//             console.log(`Use GraphQL at http://localhost:${PORT}${
//                 server.graphqlPath
//             }`);
//         })
//     })
// };
// startApolloServer()

// Import necessary modules
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
require('dotenv').config();

// Create an instance of the Express app
const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Middleware and static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apply Apollo Server middleware
server.applyMiddleware({ app });

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  // This should be placed after all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start the Apollo Server and database connection
const startApolloServer = async () => {
  await server.start();
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer();