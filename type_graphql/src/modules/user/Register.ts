import {
    Resolver,
    Query,
    Mutation,
    Arg,
    UseMiddleware,
    Subscription,
    Root,
    PubSub,
    PubSubEngine,
} from "type-graphql";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";
import { logger } from "../middleware/logger";

@Resolver()
export class RegisterResolver {
    // @Authorized()
    @UseMiddleware(isAuth, logger)
    @Query(() => String)
    async hello() {
        return "Hello World!";
    }

    @Mutation(() => User)
    async register(
        @Arg("data") { email, firstName, lastName, password }: RegisterInput,
        @PubSub() pubSub: PubSubEngine
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }).save();
        await pubSub.publish("NewUser", user);

        return user;
    }

    @Subscription({
        topics: "NewUser",
    })
    newUser(@Root() user: User): User {
        return user;
    }
}
