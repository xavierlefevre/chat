# WhatsApp Clone with GraphQL

This repo contains my code while following the amazing tutorial of Simon Tucker about creating a WhatsApp clone with GraphQL and React Native.

## Project Install

### Clone the repository
```bash
git clone https://github.com/xavierlefevre/chat.git
```

### Install and launch the API
In `server`, make sure to create an `.env` file following the `.env.example`

```bash
cd chat/server
yarn
yarn start # To start the server on your machine with fixtures (users logged in terminal)
# or
yarn watch # Same as start, but watches changes
# or
yarn run up # To launch the local docker
```

### Install and launch the app
```bash
cd chat/client
yarn
react-native run-ios
```

## Deployment

### Deploy the API in production
- Build the image in docker hub
- Retrieve the image on the server
- Start the container with Rancher

### Deploy the app in hockey app
In `client/fastlane`, make sure to create an `.env` and `.env.prod` file following the examples

```bash
cd chat/client
fastlane prod
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
- [x] Deploy on HockeyApp with Fastlane
- [x] Finish transition to React Navigation
- [x] Update most packages except graphql for server and RN for front
- [x] Clean every file js, flow, etc.
- [x] **Review progressively new version of tutorial**
- [x] New subscription code
- [ ] Upgrade graphql
- [ ] Full test the app (Android + iOS devices)
- [ ] Upgrade react native
- [ ] Use Travis
- [ ] Automate server deployment
- [ ] Secure JWT key (no .env in image)
- [ ] Domain on server IP
- [ ] HTTPS
- [ ] Fastlane in a private repo
- [ ] Check the repo of Tycho
- [ ] Migration to psql
- [ ] How to do sql join with graphql
- [ ] Flow back-end
- [ ] Test front end with Jest and Enzyme
- [ ] Add notifications
- [ ] ElasticSearch for friend search
- [ ] Chatbot
- [ ] Infinite up loading
- [ ] Other listviews

## Stack

### Front-end
- React Native
- Redux
- Apollo Client
- Web Sockets
- Deployment
  - HockeyApp
  - Fastlane

### Back-end
- SQlite
- Sequelize
- Express
- GraphQL
- JWT
- Web Sockets
- Hosting and Deployment
  - Scaleway
  - Rancher
  - Docker
