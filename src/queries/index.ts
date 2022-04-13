import fetch from "node-fetch";
import { Anime, AnimeDetails } from "../types";

export const getAnimeDetailsById = async (
  malId: number
): Promise<AnimeDetails> => {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
  const { data, message } = await res.json();
  if (!data) throw new Error(message);
  return {
    malId: data.mal_id,
    image: data.images.jpg.image_url,
    title: data.title,
    synopsis: data.synopsis,
  };
};

export const getAnimeById = async (malId: number): Promise<Anime> => {
  const animeDetails = await getAnimeDetailsById(malId);
  return {
    malId: animeDetails.malId,
    image: animeDetails.image,
  };
};
