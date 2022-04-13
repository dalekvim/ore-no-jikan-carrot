import { MongoDataSource } from "apollo-datasource-mongodb";
import { User } from "../types";

export class Users extends MongoDataSource<User> {
  getUser(userId: string) {
    return this.findOneById(userId);
  }
  async getUserByEmail(email: string) {
    return (await this.findByFields({ email }))[0];
  }
  getUsers() {
    return this.findByFields({});
  }
  createUser(email: string, password: string) {
    return this.collection.insertOne({ email, password });
  }
}
