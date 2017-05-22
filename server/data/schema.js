import { makeExecutableSchema } from 'graphql-tools';

import { Resolvers } from './resolvers';

export const Schema = [
  `
  scalar Date

  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User]! # users in the group
    messages(limit: Int, offset: Int): [Message] # messages sent to the group
  }

  type User {
    id: Int! # unique id for the user
    email: String! # we will also require a unique email per user
    username: String
    messages: [Message] # messages sent by user
    groups: [Group] # groups the user belongs to
    friends: [User] # user's contacts
    jwt: String # json web token for access
  }

  type Message {
    id: Int! # unique id for message
    to: Group! # group message was sent in
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
  }

  type Query {
    user(email: String, id: Int): User
    messages(groupId: Int, userId: Int): [Message]
    group(id: Int!): Group
  }

  type Mutation {
    createMessage(text: String!, groupId: Int!): Message
    createGroup(name: String!, userIds: [Int]): Group
    deleteGroup(id: Int!): Group
    leaveGroup(id: Int!): Group # let user leave group
    updateGroup(id: Int!, name: String): Group
    login(email: String!, password: String!): User
    signup(email: String!, password: String!, username: String): User
    addFriend(username: String!): User
  }

  type Subscription {
    # Subscription fires on every message added
    # for any of the groups with one of these groupIds
    messageAdded(groupIds: [Int]): Message
    groupAdded(userId: Int): Group
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`,
];

export const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

export default executableSchema;
