import { ApolloServer } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import http from 'http';
import express from 'express';
import { resolvers } from './resolvers.js';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
const prisma = new PrismaClient();
const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });
// interface MyContext {
//   dataSources: {
//     books: Products[];
//   };
// }
// express ----------------------
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
// const server = new ApolloServer<MyContext>({ ----- Types !!!
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// const server = new ApolloServer({
//   typeDefs: fs.readFileSync(
//     path.join(__dirname, '../schema.graphql'),
//     "utf8"
//   ),
//   resolvers
// })
// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
await server.start();
// Specify the path where we'd like to mount our server
app.use('/', cors(), express.json(), expressMiddleware(server, {
    context: async () => ({
        prisma,
    })
}));
// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
// Passing an ApolloServer instance to the `startStandaloneServer` function:
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
//   context: async () => ({
//     prisma,
//   }),
// });
console.log(`🚀 Server ready at http://localhost:4000/`);
