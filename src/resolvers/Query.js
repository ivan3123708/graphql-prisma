import getUserId from '../utils/getUserId';

const Query = {
  me(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);

    return prisma.query.user({
      where: {
        id: userId
      }
    }, info);
  },
  async post(parent, args, { req, prisma }, info) {
    const userId = getUserId(req, false);

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        },{
          author: {
            id: userId
          }
        }]
      }
    }, info);

    if (!posts.length) {
      throw new Error('Post not found');
    }

    return posts[0];
  },
  users(parent, args, { prisma }, info) {
    const _args = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      _args.where = {
        OR: [{
          name_contains: args.query
        },
        {
          email_contains: args.query
        }]
      }
    }

    return prisma.query.users(_args, info);
  },
  myPosts(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);

    const _args = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId
        }
      }
    };

    if (args.query) {
      _args.where.OR = [{
        title_contains: args.query
      }, {
        body_contains: args.query
      }];
    }

    return prisma.query.posts(_args, info);
  },
  posts(parent, args, { prisma }, info) {
    const _args = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        published: true
      }
    };

    if (args.query) {
      _args.where.OR = [{
        title_contains: args.query
      },
      {
        body_contains: args.query
      }];
    }

    return prisma.query.posts(_args, info);
  },
  comments(parent, args, { prisma }, info) {
    const _args = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    return prisma.query.comments(_args, info);
  }
};

export { Query as default };