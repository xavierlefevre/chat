import GraphQLDate from 'graphql-date';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { withFilter } from 'graphql-subscriptions';
import { map } from 'lodash';

import JWT_SECRET from '../config';
import { User } from './connectors';
import { groupLogic, messageLogic, userLogic } from './logic';
import { pubsub } from '../subscriptions';

const MESSAGE_ADDED_TOPIC = 'messageAdded';
const GROUP_ADDED_TOPIC = 'groupAdded';

export const Resolvers = {
  Date: GraphQLDate,

  Query: {
    group(_, args, ctx) {
      return groupLogic.query(_, args, ctx);
    },
    user(_, args, ctx) {
      return userLogic.query(_, args, ctx);
    },
  },

  Mutation: {
    createMessage(_, args, ctx) {
      return messageLogic.createMessage(_, args, ctx).then(message => {
        // Publish subscription notification with message
        pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });
        return message;
      });
    },
    createGroup(_, args, ctx) {
      return groupLogic.createGroup(_, args, ctx).then(group => {
        pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: group });
        return group;
      });
    },
    deleteGroup(_, args, ctx) {
      return groupLogic.deleteGroup(_, args, ctx);
    },
    leaveGroup(_, args, ctx) {
      return groupLogic.leaveGroup(_, args, ctx);
    },
    updateGroup(_, args, ctx) {
      return groupLogic.updateGroup(_, args, ctx);
    },
    login(_, { email, password }) {
      const lowerCaseEmail = email.toLowerCase();
      // find user by email
      return User.findOne({ where: { email: lowerCaseEmail } }).then(user => {
        if (user) {
          // validate password
          return bcrypt.compare(password, user.password).then(res => {
            if (res) {
              // create jwt
              const token = jwt.sign(
                { id: user.id, email: user.email, version: user.version },
                JWT_SECRET
              );
              user.jwt = token;
              return user;
            }
            return Promise.reject('password incorrect');
          });
        }
        return Promise.reject('email not found');
      });
    },
    signup(_, { email, password, username }) {
      // TODO: put a constraint on the column in the DB
      const lowerCaseEmail = email.toLowerCase();
      // find user by email
      return User.findOne({
        where: { email: lowerCaseEmail },
      }).then(existing => {
        if (!existing) {
          // hash password and create user
          return bcrypt
            .hash(password, 10)
            .then(hash =>
              User.create({
                email: lowerCaseEmail,
                password: hash,
                username: username || lowerCaseEmail,
                version: 1,
              })
            )
            .then(user => {
              const { id } = user;
              const token = jwt.sign(
                { id, lowerCaseEmail, version: 1 },
                JWT_SECRET
              );
              user.jwt = token;
              return user;
            });
        }
        return Promise.reject('email already exists');
      });
    },
    addFriend(_, args, ctx) {
      return userLogic.addFriend(_, args, ctx);
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED_TOPIC),
        (payload, args) =>
          Boolean(
            args.groupIds &&
              ~args.groupIds.indexOf(payload.messageAdded.groupId)
          )
      ),
    },
    groupAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GROUP_ADDED_TOPIC),
        (payload, args) =>
          Boolean(
            args.userId &&
              ~map(payload.groupAdded.users, 'id').indexOf(args.userId)
          )
      ),
    },
  },

  Group: {
    users(group, args, ctx) {
      return groupLogic.users(group, args, ctx);
    },
    messages(group, args, ctx) {
      return groupLogic.messages(group, args, ctx);
    },
  },

  Message: {
    to(message, args, ctx) {
      return messageLogic.to(message, args, ctx);
    },
    from(message, args, ctx) {
      return messageLogic.from(message, args, ctx);
    },
  },

  User: {
    email(user, args, ctx) {
      return userLogic.email(user, args, ctx);
    },
    friends(user, args, ctx) {
      return userLogic.friends(user, args, ctx);
    },
    groups(user, args, ctx) {
      return userLogic.groups(user, args, ctx);
    },
    jwt(user, args, ctx) {
      return userLogic.jwt(user, args, ctx);
    },
    messages(user, args, ctx) {
      return userLogic.messages(user, args, ctx);
    },
  },
};

export default Resolvers;
