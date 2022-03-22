import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { hash } from "bcryptjs";
import { User } from "../entity/User";

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "hi!";
    }

    @Query(() => [User])
    users() {
        return User.find();
    }

    @Mutation(() => Boolean)
    async register(
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
    ) {
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