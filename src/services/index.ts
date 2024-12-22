import { IPost, IUserDefaultData } from "../types/globals";

export const getUpdatedFollows = (updates: Array<IPost>): Array<IUserDefaultData> => {
  const followsUsernames: Array<string> = [];
  const updatedFollows: Array<IUserDefaultData> = []

  updates.forEach((post: IPost) => {
    if (!followsUsernames.includes(post.author.username)) {
      updatedFollows.push(post.author);
      followsUsernames.push(post.author.username);
    }
    post.activeImage = 0;
  });

  return updatedFollows
}
