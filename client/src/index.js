import ApolloBoost, { gql } from 'apollo-boost';

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
});

const getPosts = gql`
  query {
    posts {
      title
      body
      author {
        name
      }
    }
  }
`;

client.query({
  query: getPosts
}).then((res) => {
  let html = '';

  res.data.posts.forEach((post) => {
    html += `
      <div>
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <p style="font-style: italic;">${post.author.name}</p>
      </div>
    `;
  });

  document.getElementById('posts').innerHTML = html;
});