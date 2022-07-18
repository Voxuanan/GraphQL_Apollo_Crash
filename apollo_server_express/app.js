const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
require("dotenv").config();

// Load schema & resolvers
const typeDefs = require("./schema/schema");
const resolvers = require("./resolver/resolver");

// load DB methods
const mongoDataMethods = require("./data/db");

const URI = process.env.MONGO_URL;
mongoose.connect(
    URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) throw err;
        console.log("Connected to MongoDB");
    }
);

async function startApolloServer(typeDefs, resolvers) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ mongoDataMethods }),
    });
    const app = express();
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    app.listen(4000, () => {
        console.log(`http://localhost:4000${server.graphqlPath}`);
    });
}

startApolloServer(typeDefs, resolvers);
