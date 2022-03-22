import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/Context";

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
        throw new Error("User not authenticated!");
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
        context.payload = payload as any;
    } catch (exception) {
        console.error(exception);
        throw new Error("Error while reading the token!");
    }
    
    return next();
}