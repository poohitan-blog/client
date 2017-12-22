import React from 'react';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';
import Post from '../components/Post';
import * as Data from '../services/data';

const postListMarkup = Data.posts.map(post => <Post {...post} cut key={post.id} />);

const Index = () => (
  <Wrapper>
    <Head>
      <title>poohitan</title>
    </Head>
    {postListMarkup}
  </Wrapper>
);

export default Index;
