import fetch from "node-fetch";
import { Arg, Query, Resolver } from "type-graphql";
import { getAnimeDetailsById } from "../queries";
import { Anime, AnimeDetails } from "../types";

@Resolver()
export class AnimeResolver {
  @Query(() => [Anime])
  async anime(@Arg("page") page: number): Promise<Anime[]> {
    const res = await fetch(`https://api.jikan.moe/v4/anime?page=${page}`);
    const body = await res.json();
    const anime: Anime[] = body.data.map((anime: any) => ({
      malId: anime.mal_id,
      image: anime.images.jpg.image_url,
    }));
    return anime;
  }

  @Query(() => AnimeDetails)
  async animeById(@Arg("malId") malId: number): Promise<AnimeDetails> {
    return getAnimeDetailsById(malId);
  }
}
