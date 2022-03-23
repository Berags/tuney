import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/Context";

/**
 * Checks if JWT is valid and continue with operations.
 * 
 * If JWT is invalid throws error
 * 
 * @param context Custom context object, used to access the payload
 * @param next Next operation
 * @throws If JWT is invalid or user is not logged in
 * @returns Promise
 */
export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
        throw new Error("User not authenticated!");
    }

    // authorization format: bearer adkklasdsdò.dakjdlaskjdlda.21123jkldjlsa

    try {
        const token = authorization.split(" ")[1];                      // Gets the JWT value
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET); // verify the JWT
        context.payload = payload as any;                               // extracts JWT Payload and puts it into context
    } catch (exception) {
        console.error(exception);
        throw new Error("Error while reading the token!");
    }

    return next();
}