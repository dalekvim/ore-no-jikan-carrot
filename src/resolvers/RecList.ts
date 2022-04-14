import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../context";
import { editDistance } from "../fuzzySearch";
import { getAnimeById } from "../queries";
import { RecList } from "../types";

@Resolver()
export class RecListResolver {
  @Query(() => [RecList])
  recLists(
    @Ctx() { dataSources: { recLists } }: MyContext
  ): Promise<(RecList | null | undefined)[]> {
    return recLists.getRecLists();
  }

  @Query(() => RecList)
  recList(
    @Arg("recListId") recListId: string,
    @Ctx() { dataSources: { recLists } }: MyContext
  ): Promise<RecList> {
    return recLists.getRecList(recListId);
  }

  @Query(() => [RecList])
  async searchRecList(
    @Arg("title") title: string,
    @Ctx() { dataSources: { recLists } }: MyContext
  ): Promise<(RecList | null | undefined)[]> {
    const allRecLists = await recLists.getRecLists();
    return allRecLists.filter(
      (recList) => editDistance(title, recList!.title) <= title.length / 2
    );
  }

  @Authorized()
  @Mutation(() => Boolean)
  async createRecList(
    @Arg("title") title: string,
    @Ctx() { userId, dataSources: { users, recLists } }: MyContext
  ): Promise<Boolean> {
    const user = await users.getUser(userId!);
    return recLists.createEmptyRecList(title, user!);
  }

  @Authorized()
  @Mutation(() => Boolean)
  async addAnime(
    @Arg("recListId") recListId: string,
    @Arg("malId") malId: number,
    @Ctx() { userId, dataSources: { recLists } }: MyContext
  ): Promise<Boolean> {
    const recList = await recLists.getRecList(recListId);
    if (recList.createdBy._id != userId) return false;
    const anime = await getAnimeById(malId);
    await recLists.addAnime(recList, anime);
    return true;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteAnime(
    @Arg("recListId") recListId: string,
    @Arg("malId") malId: number,
    @Ctx() { userId, dataSources: { recLists } }: MyContext
  ) {
    const recList = await recLists.getRecList(recListId);
    if (recList.createdBy._id != userId) return false;
    const anime = await getAnimeById(malId);
    await recLists.deleteAnime(recList, anime);
    return true;
  }
}
