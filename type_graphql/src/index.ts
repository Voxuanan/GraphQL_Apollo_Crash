import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [RegisterResolver],
    });
    const apolloServer = new ApolloServer({ schema });
    await apolloServer.start();

    const app = express();
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log("Sever started on http://localhost:4000/graphql");
    });
};

main();
