import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error('No user found');
    }

    const passMatch = await bcrypt.compare(args.data.password, user.password);

    if (!passMatch) {
      throw new Error('Incorrect password');
    }

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'mysecret')
    };
  },
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer');
    }

    const password = await bcrypt.hash(args.data.password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'mysecret')
    };
  },
  updateUser(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info);
  },
  deleteUser(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);

    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info);
  },
  createPost(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);

    return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info);
  },
  async updatePost(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    });

    if (!postExists) {
      throw new Error('Unable to update post');
    }

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id
          }
        }
      });
    }

    return prisma.mutation.updatePost({
      where: {
        id: args.id
      },
      data: args.data
    }, info);
  },
  async deletePost(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error('Unable to delete post');
    }

    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }
    }, info);
  },
  async createComment(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    });

    if (!postExists) {
      throw new Error('Unable to find post');
    }

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: args.data.post
          }
        }
      }
    }, info);
  },
  async updateComment(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error('Unable to update comment');
    }

    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    }, info);
  },
  async deleteComment(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error('Unable to delete comment');
    }

    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info);
  }
};

export { Mutation as default };