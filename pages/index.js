import React from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import posts from '../services/data';

const postsList = posts.map(post => <Post {...post} cut key={post.id} />);

const Index = () => (
  <Layout>
    {postsList}
  </Layout>
);

export default Index;
