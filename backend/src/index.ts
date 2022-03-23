import "dotenv/config";
import 'reflect-metadata';
import express = require("express");
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { AppDataSource } from "./data-source";

const PORT = 4000 || process.env.PORT;
export const app = express();

(async () => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    });

    await AppDataSource.initialize();
    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.get('/', (req, res) => {
        res.send("hello this is tuney beta server");
    })

    app.listen(PORT, () => {
        console.log("🚀 Tuney server started on http://localhost:4000/");
    })
})();