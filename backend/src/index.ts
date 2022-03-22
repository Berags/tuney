import { AppDataSource } from "./data-source";
import "dotenv/config";
import express = require("express");
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import 'reflect-metadata';
import { UserResolver } from "./resolvers/user";

(async () => {
    const app = express();
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
        res.send("hello");
    })
    app.listen(4000, () => {
        console.log("express server started...");
    })
})()

// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)  
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))
