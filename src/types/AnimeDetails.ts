import { Field, ObjectType } from "type-graphql";
import { Anime } from "./Anime";

@ObjectType()
export class AnimeDetails extends Anime {
  @Field()
  title: string;

  @Field()
  synopsis: string;
}
