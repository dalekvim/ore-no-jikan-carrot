import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Anime {
  @Field(() => ID)
  malId: number;

  @Field()
  image: string;
}
