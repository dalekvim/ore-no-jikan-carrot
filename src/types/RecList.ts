import { Field, ID, ObjectType } from "type-graphql";
import { Anime } from "../types/Anime";
import { User } from "../types/User";

@ObjectType()
export class RecList {
  @Field(() => ID)
  _id?: string;

  @Field()
  title: string;

  @Field(() => User)
  createdBy: User;

  @Field(() => [Anime])
  anime: Anime[];
}
