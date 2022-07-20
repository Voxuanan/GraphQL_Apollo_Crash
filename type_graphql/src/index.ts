import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { createConnection } from "typeorm";
import * as session from "express-session";
import * as cors from "cors";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
// import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const main = async () => {
    const app = express();
    const httpServer = createServer(app);

    await createConnection();

    const schema = await buildSchema({
        resolvers: [__dirname + "/modules/**/*.ts"],
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId;
        },
    });
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });
    const serverCleanup = useServer({ schema }, wsServer);

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
        csrfPrevention: true,
        cache: "bounded",
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await apolloServer.start();

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
    httpServer.listen(4000, () => {
        console.log("Sever started on http://localhost:4000/graphql");
    });
};

main();
