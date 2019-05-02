const Subscription = {
  post: {
    subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('POST');
    }
  },
  comment: {
    subscribe(parent, { postId }, { db, pubsub }, info) {
      const post = db.posts.find((post) => post.id === postId && post.published);

      if (!post) {
        throw new Error('Post not found');
      }

      return pubsub.asyncIterator(`COMMENT ${postId}`);
    }
  }
};

export { Subscription as default };