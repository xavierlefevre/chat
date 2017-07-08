import { _ } from 'lodash';
import faker from 'faker';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';

const db = new Sequelize('chat', null, null, {
  dialect: 'sqlite',
  storage: './chat.sqlite',
  logging: false,
});

const GroupModel = db.define('group', {
  name: { type: Sequelize.STRING },
});
const MessageModel = db.define('message', {
  text: { type: Sequelize.STRING },
});
const UserModel = db.define('user', {
  email: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  version: { type: Sequelize.INTEGER },
});

UserModel.belongsToMany(GroupModel, { through: 'GroupUser' });
UserModel.belongsToMany(UserModel, { through: 'Friends', as: 'friends' });
MessageModel.belongsTo(UserModel);
MessageModel.belongsTo(GroupModel);
GroupModel.belongsToMany(UserModel, { through: 'GroupUser' });

// fake data
const GROUPS = 4;
const USERS_PER_GROUP = 5;
const MESSAGES_PER_USER = 5;
faker.seed(123); // get consistent data every time we reload app

db.sync({ force: true }).then(() => {
  _.times(GROUPS, () =>
    GroupModel.create({ name: faker.lorem.words(3) })
      .then(group =>
        _.times(USERS_PER_GROUP, () => {
          const password = faker.internet.password();
          return bcrypt.hash(password, 10).then(hash =>
            group
              .createUser({
                email: faker.internet.email().toLowerCase(),
                username: faker.internet.userName(),
                password: hash,
                version: 1,
              })
              .then(user => {
                console.log('{email, username, password}', `{${user.email}, ${user.username}, ${password}}`);
                _.times(MESSAGES_PER_USER, () =>
                  MessageModel.create({
                    userId: user.id,
                    groupId: group.id,
                    text: faker.lorem.sentences(3),
                  })
                );
                return user;
              })
          );
        })
      )
      .then(userPromises => {
        Promise.all(userPromises).then(users => {
          _.each(users, (current, i) => {
            _.each(users, (user, j) => {
              if (i !== j) {
                current.addFriend(user);
              }
            });
          });
        });
      })
  );

  bcrypt.hash('test', 10).then(hashl =>
    GroupModel.create({ name: 'Global Chat' }).then(group =>
      group
        .createUser({
          email: 'luma@test.com',
          username: 'luma',
          password: hashl,
          version: 1,
        })
        .then(userl => {
          console.log('{email, username, password}', `{${userl.email}, ${userl.username}, test}`);
          bcrypt.hash('test', 10).then(hashx =>
            group
              .createUser({
                email: 'xavier@test.com',
                username: 'xavier',
                password: hashx,
                version: 1,
              })
              .then(userx => {
                console.log('{email, username, password}', `{${userx.email}, ${userx.username}, test}`);
                userx.addFriend(userl);
              })
          );
        })
    )
  );
});

const Group = db.models.group;
const Message = db.models.message;
const User = db.models.user;

export { Group, Message, User };
