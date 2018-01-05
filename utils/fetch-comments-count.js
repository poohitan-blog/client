import request from './request';
import { current } from '../config';

let cache = null;

async function fetchCommentsCount(previousData = {}, cursor) {
  if (cache) {
    return cache;
  }

  const { APIKey, shortname } = current.disqus;
  const url = 'https://disqus.com/api/3.0/forums/listThreads.json';
  const query = {
    api_key: APIKey,
    forum: shortname,
    cursor,
  };

  const json = await request({ url, query });

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
