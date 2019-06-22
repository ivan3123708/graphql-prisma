const Query = {
  me() {
    return {
      id: '123456',
      name: 'Mike',
      email: 'mike@mail,com',
      age: 27
    }
  },
  post() {
    return {
      id: '789456',
      title: 'Hello World',
      published: false
    }
  },
  users(parent, args, { prisma }, info) {
    const _args = {};

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
  posts(parent, args, { prisma }, info) {
    const _args = {};

    if (args.query) {
      _args.where = {
        OR: [{
          title_contains: args.query
        },
        {
          body_contains: args.query
        }]
      }
    }

    return prisma.query.posts(_args, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  }
};

export { Query as default };