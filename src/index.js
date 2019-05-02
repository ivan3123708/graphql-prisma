import { GraphQLServer, PubSub } from 'graphql-yoga';
import { Query, Mutation, Subscription, User, Post, Comment } from './resolvers';
import db from './db';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    pubsub
  }
});

server.start(() => console.log('SERVER RUNNING...'));