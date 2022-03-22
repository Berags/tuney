import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
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

    @Mutation(() => Boolean)
    async register(
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
    ): Promise<Boolean> {
        try {
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