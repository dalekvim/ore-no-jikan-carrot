import { ApolloServer } from "apollo-server";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { authChecker } from "./auth/authChecker";
import { RecLists } from "./dataSources/RecLists";
import { Users } from "./dataSources/Users";
import { AnimeResolver } from "./resolvers/Anime";
import { RecListResolver } from "./resolvers/RecList";
import { UserResolver } from "./resolvers/User";

(async () => {
  const client = new MongoClient(process.env.MONGO_URI!);
  await client.connect();

  const schema = await buildSchema({
    resolvers: [UserResolver, RecListResolver, AnimeResolver],
    authChecker,
  });

  const server = new ApolloServer({
    schema,
    dataSources: () => ({
      users: new Users(client.db().collection("users")),
      recLists: new RecLists(client.db().collection("recLists")),
    }),
    context: ({ req }) => {
      const authorization = req.headers.authorization;
      if (!authorization) return {};
      try {
        const accessToken = authorization.split(" ")[1];
        const { userId } = jwt.verify(
          accessToken,
          process.env.SECRET!
        ) as jwt.JwtPayload;
        return { userId };
      } catch {
        return {};
      }
    },
  });

  server.listen(process.env.PORT || 4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
})();
