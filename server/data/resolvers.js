import GraphQLDate from 'graphql-date';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';
import { User } from './connectors';
import { groupLogic, messageLogic, userLogic } from './logic';
import { pubsub } from '../subscriptions';

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
        pubsub.publish('messageAdded', message);
        return message;
      });
    },
    createGroup(_, args, ctx) {
      return groupLogic.createGroup(_, args, ctx).then(group => {
        pubsub.publish('groupAdded', group);
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
      // find user by email
      return User.findOne({ where: { email } }).then(user => {
        if (user) {
          // validate password
          return bcrypt.compare(password, user.password).then(res => {
            if (res) {
              // create jwt
              const token = jwt.sign({ id: user.id, email: user.email, version: user.version }, JWT_SECRET);
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
      // find user by email
      return User.findOne({ where: { email } }).then(existing => {
        if (!existing) {
          // hash password and create user
          return bcrypt
            .hash(password, 10)
            .then(hash =>
              User.create({
                email,
                password: hash,
                username: username || email,
                version: 1,
              })
            )
            .then(user => {
              const { id } = user;
              const token = jwt.sign({ id, email, version: 1 }, JWT_SECRET);
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
    messageAdded(message) {
      // the subscription payload is the message.
      return message;
    },
    groupAdded(group) {
      return group;
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
