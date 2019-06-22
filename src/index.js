import { GraphQLServer } from 'graphql-yoga';
import { Query, Mutation, Subscription, User, Post, Comment } from './resolvers';
import prisma from './prisma';

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
    prisma
  }
});

server.start(() => console.log('SERVER RUNNING...'));