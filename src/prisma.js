import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
  secret: 'sifra123'
});

export { prisma as default };

// const createPost = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });

//   if (!userExists) {
//     throw new Error('User not found.');
//   }

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, '{ author { id name email posts { id title body published } } }');

//   return post.author;
// }

// createPost('cjv6rz5g1001607709wxd7pgy', {
//   title: 'GSW',
//   body: 'Loosers',
//   published: true
// })
//   .then((data) => console.log(JSON.stringify(data, null, 2)))
//   .catch((err) => console.log(err.message));

// const updatePost = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId });

//   if (!postExists) {
//     throw new Error('Post not found.');
//   }

//   const post = await prisma.mutation.updatePost({
//     where: {
//       id: postId
//     },
//     data
//   }, '{ author { id name posts { title body } } }');

//   return post.author;
// }

// updatePost('cjwnxgr1g00a40751gajrugrt', {
//   title: 'Toronto Raptors - WE THE NORTH'
// })
//   .then((data) => console.log(JSON.stringify(data, null, 2)))
//   .catch((err) => console.log(err.message));