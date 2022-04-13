import { AuthChecker, ResolverData } from "type-graphql";
import { MyContext } from "../context";

export const authChecker: AuthChecker<any> = async ({
  context: {
    userId,
    dataSources: { users },
  },
}: ResolverData<MyContext>) => {
  if (userId) {
    const user = await users.getUser(userId);
    return user ? true : false;
  }
  return false;
};
