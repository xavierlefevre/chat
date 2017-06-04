# WhatsApp Clone with GraphQL

This repo contains my code while following the amazing tutorial of Simon Tucker about creating a WhatsApp clone with GraphQL and React Native.

## Project Install

### Clone the repository

```bash
git clone https://github.com/xavierlefevre/chat.git
```

### Install and launch the back-end

```bash
cd chat/server
yarn install
yarn start # To launch the server with fixtures for the moment, you can see the users in the terminal logs
```

### Install and launch the frond-end

```bash
cd chat/client
yarn install
react-native run-ios
```

## Roadmap

- [x] Simon Tucker Tuto: [Part 1: Setup](https://medium.com/@simontucker/building-chatty-a-whatsapp-clone-with-react-native-and-apollo-part-1-setup-68a02f7e11)
- [x] Simon Tucker Tuto: [Part 2: GraphQL Queries with Express](https://medium.com/@simontucker/building-chatty-part-2-graphql-queries-with-express-6dce83b39479)
- [x] Simon Tucker Tuto: [Part 3: GraphQL Queries with React-Appolo](https://medium.com/@simontucker/building-chatty-part-3-graphql-queries-with-react-apollo-e7e02c6dadc2)
- [x] Simon Tucker Tuto: [Part 4: GraphQL Mutations and Optimistic UI](https://medium.com/@simontucker/building-chatty-part-4-graphql-mutations-optimistic-ui-8dee7778a170)
- [x] Add FlowType to the Client
- [x] Add Prettier
- [x] Improve File Structure with Components, Containers and Styles
- [x] Simon Tucker Tuto: [Part 5: Pagination with GraphQL](https://medium.com/@simontucker/building-chatty-part-5-pagination-with-graphql-23a25fc9f0bf)
- [x] Simon Tucker Tuto: [Part 6: GraphQL Subscriptions](https://medium.com/@simontucker/building-chatty-part-6-graphql-subscriptions-b54df7d63e27)
- [x] Simon Tucker Tuto: [Part 7: GraphQL Authentication](https://medium.com/@simontucker/building-chatty-part-7-authentication-in-graphql-cd37770e5ab3)
- [x] New feature to see and add friends
- [x] Server locally in Docker
- [x] Docker Online
- [ ] Deploy on HockeyApp with Fastlane
- [ ] SQlite to PSQL
- [ ] Server side FlowType
- [ ] Test front end with Jest and Enzyme

## Stack

### Front-end
- React Native
- Redux
- Apollo Client
- Web Sockets

### Back-end
- SQlite
- Sequelize
- Express
- GraphQL
- JWT
- Web Sockets

### Hosting
- Scaleway
- Rancher
- Docker
