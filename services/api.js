import pluralize from 'pluralize';

import config from '../config';
import deserialize from '../utils/deserialize';
import request from '../utils/request';
import fetchCommentsCount from '../utils/fetch-comments-count';

import Post from '../models/post';
import Page from '../models/page';
import TrashPost from '../models/trash-post';
import User from '../models/user';

const API_URL = config.current.apiURL;

async function find({ model, query }, cookies) {
  const url = `${API_URL}/${pluralize(model.name)}`;
  const headers = cookies ? { Cookie: cookies } : {};
  const { docs, meta } = await request({ url, query, headers });

  return { docs: deserialize(docs, model.schema), meta };
}

async function findOne({ model, param }, cookies) {
  const url = `${API_URL}/${pluralize(model.name)}/${param}`;
  const headers = cookies ? { Cookie: cookies } : {};
  const doc = await request({ url, headers });

  return deserialize(doc, model.schema);
}

const posts = {
  find: (query, cookies) => find({ model: Post, query }, cookies),
  findOne: (path, cookies) => findOne({ model: Post, param: path }, cookies),
  fetchCommentsCount,
};

const pages = {
  find: cookies => find({ model: Page }, cookies),
  findOne: (path, cookies) => findOne({ model: Page, param: path }, cookies),
};

const trashPosts = {
  find: (query, cookies) => find({ model: TrashPost, query }, cookies),
  findOne: (id, cookies) => findOne({ model: TrashPost, param: id }, cookies),
};

const users = {
  find: (query, cookies) => find({ model: User, query }, cookies),
  findOne: (id, cookies) => findOne({ model: User, param: id }, cookies),
};

async function search(query, cookies) {
  const url = `${API_URL}/search`;
  const headers = cookies ? { Cookie: cookies } : {};
  const { docs, meta } = await request({ url, query, headers });

  const modelsBySearchResultType = {
    post: Post,
    page: Page,
    trashPost: TrashPost,
  };

  const deserialized = docs.map((doc) => {
    const searchResultModel = modelsBySearchResultType[doc.searchResultType];

    return deserialize(doc, searchResultModel.schema);
  });

  return { docs: deserialized, meta };
}

const API = {
  posts,
  pages,
  trashPosts,
  users,
  search,
};

export default API;
