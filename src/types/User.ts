import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  _id?: string;

  @Field()
  email: string;

  password: string;
}
