import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext } from "../context";
import { LoginInput, RegisterInput, User } from "../types";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User)
  user(
    @Arg("userId") userId: string,
    @Ctx() { dataSources: { users } }: MyContext
  ) {
    return users.getUser(userId);
  }

  @Query(() => [User])
  users(@Ctx() { dataSources: { users } }: MyContext) {
    return users.getUsers();
  }

  @Authorized()
  @Query(() => User)
  async me(
    @Ctx() { userId, dataSources: { users } }: MyContext
  ): Promise<User> {
    const user = await users.getUser(userId!);
    return user!;
  }

  @Mutation(() => Boolean)
  async register(
    @Args() { email, password }: RegisterInput,
    @Ctx() { dataSources: { users } }: MyContext
  ): Promise<Boolean> {
    const userExists = await users.getUserByEmail(email);
    if (userExists)
      throw new Error("there is already an account with that email");
    const hashedPassword = await bcrypt.hash(password, 12);
    users.createUser(email, hashedPassword);
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args() { email, password }: LoginInput,
    @Ctx() { dataSources: { users } }: MyContext
  ): Promise<LoginResponse> {
    const user = await users.getUserByEmail(email);
    if (!user) throw new Error("could not find user");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("bad password");
    return {
      accessToken: jwt.sign({ userId: user._id }, process.env.SECRET!, {
        expiresIn: "15m",
      }),
    };
  }
}
