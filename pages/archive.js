import React from 'react';
import Head from 'next/head';
import Wrapper from '../components/Wrapper';
import CompactPost from '../components/CompactPost';
import * as Data from '../services/data';

const postListMarkup = Data.posts.map((post, index) => {
  if (index) {
    return (<div key={post.id}><hr /><CompactPost {...post} /></div>);
  }

  return <CompactPost {...post} key={post.id} />;
});

const archivePage = () => (
  <Wrapper>
    <Head>
      <title>Архів</title>
    </Head>
    <div className="page-body">
      {postListMarkup}
    </div>
  </Wrapper>
);

export default archivePage;
