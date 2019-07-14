import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import getUserId from '../utils/getUserId';
import hashPassword from '../utils/hashPassword';

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

    const token = generateToken(user.id);

    return {
      user,
      token
    };
  },
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    const token = generateToken(user.id);

    return {
      user,
      token
    };
  },
  async updateUser(parent, args, { req, prisma }, info) {
    const userId = getUserId(req);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

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