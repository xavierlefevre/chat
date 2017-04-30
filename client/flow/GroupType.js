// @flow
declare type GroupType = {
  name: string,
  id: number,
  users: Array<{
    id: number,
    username: string,
  }>,
  messages: Array<{
    id: number,
    to: {
      id: number,
    },
    from: {
      id: number,
      username: string,
    },
    createdAt: any,
    text: string,
  }>,
};
