import fetch from 'isomorphic-unfetch';
import config from '../config';

let cache = null;

async function fetchCommentsCount(previousData = {}, cursor = '') {
  if (cache) {
    return cache;
  }

  const { APIKey, shortname } = config.current.disqus;
  let url = `https://disqus.com/api/3.0/forums/listThreads.json?api_key=${APIKey}&forum=${shortname}`;

  if (cursor) {
    url += `&cursor=${cursor}`;
  }

  const response = await fetch(url);
  const json = await response.json();

  const commentsCountByPost = json.response.reduce((result, thread) => {
    const postPath = thread.identifiers[0];

    return Object.assign({}, result, {
      [postPath]: thread.posts,
    });
  }, previousData);

  if (json.cursor && json.cursor.hasNext) {
    return fetchCommentsCount(commentsCountByPost, json.cursor.next);
  }

  cache = commentsCountByPost;

  return commentsCountByPost;
}

export default fetchCommentsCount;
