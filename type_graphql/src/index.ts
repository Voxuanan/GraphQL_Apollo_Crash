import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { createConnection } from "typeorm";
import * as session from "express-session";
import * as cors from "cors";

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [__dirname + "/modules/**/*.ts"],
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId;
        },
    });

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
    });
    await apolloServer.start();

    const app = express();
    app.use(
        cors({
            credentials: true,
            origin: "https://studio.apollographql.com",
        })
    );

    app.use(
        session({
            name: "test",
            secret: "testsecret",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
            },
        })
    );
    apolloServer.applyMiddleware({
        app,
        cors: { credentials: true, origin: "https://studio.apollographql.com" },
    });
    app.listen(4000, () => {
        console.log("Sever started on http://localhost:4000/graphql");
    });
};

main();
