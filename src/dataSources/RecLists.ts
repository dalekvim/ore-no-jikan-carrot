import { MongoDataSource } from "apollo-datasource-mongodb";
import { Anime, RecList, User } from "../types";

export class RecLists extends MongoDataSource<RecList> {
  async getRecList(recListId: string) {
    const recList = await this.findOneById(recListId);
    if (!recList) throw new Error("could not find recList");
    return recList;
  }
  getRecLists() {
    return this.findByFields({});
  }
  createEmptyRecList(title: string, createdBy: User) {
    this.collection.insertOne({ title, createdBy, anime: new Array() });
    return true;
  }
  addAnime(recList: RecList, anime: Anime) {
    if (
      recList.anime.map((recAnime) => recAnime.malId).indexOf(anime.malId) != -1
    )
      throw new Error("anime already in list");
    return this.collection.updateOne(
      { _id: recList._id },
      { $push: { anime } }
    );
  }
  deleteAnime(recList: RecList, anime: Anime) {
    return this.collection.updateOne(
      { _id: recList._id },
      {
        $pull: { anime },
      }
    );
  }
}
