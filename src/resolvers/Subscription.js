import getUserId from '../utils/getUserId';

const Subscription = {
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post({
        where: {
          node: {
            post: {
              published: true
            }
          }
        }
      }, info);
    }
  },
  myPost: {
    subscribe(parent, args, { req, prisma }, info) {
      const userId = getUserId(req);

      return prisma.subscription.post({
        where: {
          node: {
            author: {
              id: userId
            }
          }
        }
      }, info);
    }
  },
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: postId
            }
          }
        }
      }, info);
    }
  }
};

export { Subscription as default };