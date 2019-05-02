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
  users(parent, args, { db }, info) {
    if (!args.name) return db.users;

    return db.users.filter((user) => user.name.toLowerCase().includes(args.name.toLowerCase()));
  },
  posts(parent, args, { db }, info) {
    if (args.published === undefined) return db.posts;

    return db.posts.filter((post) => post.published === args.published);
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  }
};

export { Query as default };