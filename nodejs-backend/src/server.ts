import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import cors from "cors";

const startServer = async () => {
  const app = express();

  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 9000 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:9000${server.graphqlPath}`,
    ),
  );
};

startServer();
