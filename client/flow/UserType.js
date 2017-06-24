// @flow
/* eslint-disable no-undef */
declare type FriendType = {
  id: number,
  username: string,
};

declare type UserType = {
  id: number,
  email: string,
  username: string,
  friends: Array<FriendType>,
  groups: Array<{
    id: number,
    name: string,
  }>,
};
