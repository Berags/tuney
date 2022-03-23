import { sign } from "jsonwebtoken";
import { User } from "../entity/User";

export const createAccessToken = (user: User) => {
    return sign(
        { // JWT Payload
            userId: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn: "15m" // 15 minutes 
        }
    );
}

export const createRefreshToken = (user: User) => {
    return sign(
        { // JWT Payload
            userId: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET, // JID secret 
        {
            expiresIn: "7d" // 7 days 
        }
    );
}