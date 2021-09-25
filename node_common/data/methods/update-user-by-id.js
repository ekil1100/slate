import * as Serializers from "~/node_common/serializers";

import { runQuery } from "~/node_common/data/utilities";

export default async (user) => {
  console.log("inside update user by id");
  return await runQuery({
    label: "UPDATE_USER_BY_ID",
    queryFn: async (DB) => {
      const query = await DB.from("users").where("id", user.id).update(user).returning("*");
      console.log({ query });

      const index = query ? query.pop() : null;
      return JSON.parse(JSON.stringify(index));
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: "UPDATE_USER_BY_ID",
      };
    },
  });
};
