import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { hash, compare } from "bcryptjs";
import { User } from "../entity/User";
import { Context } from "../types/Context";
import { createAccessToken, createRefreshToken } from "../utils/auth";
import { isAuth } from "../middleware/isAuthMiddleware";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "hi!";
    }

    /**
     * Test route to check if JWT is working properly
     * 
     * @param payload JWT payload 
     * @throws If JWT couldn't be parsed and validated
     * @returns "Goodbye " + userId if the user is logged in, throws error otherwise
     */
    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(
        @Ctx() { payload }: Context
    ) {
        return "Goodye" + payload.userId;
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return User.find();
    }

    /**
     * Checks if credentials are valid and logs in a user.
     * Generate JWT access token and set the refresh token.
     * 
     * @param email The user email
     * @param password The given user password to check
     * @param res The response object
     * @returns Access Token
     */
    @Mutation(() => LoginResponse)
    async login(
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
        @Ctx() { res }: Context
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error("Could not find user with given email!");
        }

        const valid = await compare(password, user.password);
        if (!valid) {
            throw new Error("Password is not valid!");
        }

        // Successfully logged in
        res.cookie(
            "jid",
            createRefreshToken(user), {
            httpOnly: true,
        })
        return {
            accessToken: createAccessToken(user),
        }
    }

    /**
     * User registration method, allow a user to create his account
     * 
     * @param email The user email
     * @param password The user password
     * @returns True if successfully registered the user, false otherwise
     */
    @Mutation(() => Boolean)
    async register(
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
    ): Promise<Boolean> {
        try {
            // (TODO): Check if email is already present
            const hashedPassword = await hash(password, 12);
            await User.insert({
                email,
                password: hashedPassword
            })
        } catch (exception) {
            console.error(exception);
            return false;
        }
        return true;
    }
}