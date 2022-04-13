import { RecLists, Users } from "../dataSources";

export type MyContext = {
  dataSources: {
    users: Users;
    recLists: RecLists;
  };
  userId: string | null | undefined;
};
