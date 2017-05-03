import GraphQLDate from 'graphql-date';
import { Group, Message, User } from './connectors';
import { pubsub } from '../subscriptions';

export const Resolvers = {
  Date: GraphQLDate,

  Query: {
    group(_, args) {
      return Group.find({ where: args });
    },
    messages(_, args) {
      return Message.findAll({
        where: args,
        order: [['createdAt', 'DESC']],
      });
    },
    user(_, args) {
      return User.findOne({ where: args });
    },
  },

  Mutation: {
    createMessage(_, { text, userId, groupId }) {
      return Message.create({
        userId,
        text,
        groupId,
      }).then(message => {
        pubsub.publish('messageAdded', message);
        return message;
      });
    },
    createGroup(_, { name, userId, userIds }) {
      return User.findOne({ where: { id: userId } }).then(user =>
        user.getFriends({ where: { id: { $in: !userIds ? [] : userIds } } }).then(friends =>
          Group.create({
            name,
            users: [user, ...friends],
          }).then(group => group.addUsers([user, ...friends]).then(() => group))
        )
      );
    },
    deleteGroup(_, { id }) {
      return Group.find({ where: id }).then(group =>
        group
          .getUsers()
          .then(users => group.removeUsers(users))
          .then(() => Message.destroy({ where: { groupId: group.id } }))
          .then(() => group.destroy())
      );
    },
    leaveGroup(_, { id, userId }) {
      return Group.findOne({ where: { id } }).then(group => {
        group.removeUser(userId);
        return group;
      });
    },
    updateGroup(_, { id, name }) {
      return Group.findOne({ where: { id } }).then(group => group.update({ name }));
    },
  },

  Subscription: {
    messageAdded(message) {
      return message;
    },
  },

  Group: {
    users(group) {
      return group.getUsers();
    },
    messages(group, args) {
      return Message.findAll({
        where: { groupId: group.id },
        order: [['createdAt', 'DESC']],
        limit: args.limit,
        offset: args.offset,
      });
    },
  },

  Message: {
    to(message) {
      return message.getGroup();
    },
    from(message) {
      return message.getUser();
    },
  },

  User: {
    messages(user) {
      return Message.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
      });
    },
    groups(user) {
      return user.getGroups();
    },
    friends(user) {
      return user.getFriends();
    },
  },
};

export default Resolvers;
