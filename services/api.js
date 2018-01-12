import pluralize from 'pluralize';

import { current } from '../config';
import deserialize from '../utils/deserialize';
import request from '../utils/request';
import fetchCommentsCount from '../utils/fetch-comments-count';

import Post from '../models/post';
import Page from '../models/page';
import TrashPost from '../models/trash-post';
import User from '../models/user';

const API_URL = current.apiURL;

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

async function update({ model, param, body }, cookies) {
  const url = `${API_URL}/${pluralize(model.name)}/${param}`;
  const headers = cookies ? { Cookie: cookies } : {};
  const doc = await request({
    url,
    headers,
    body,
    method: 'PATCH',
  });

  return deserialize(doc, model.schema);
}

async function create({ model, body }, cookies) {
  const url = `${API_URL}/${pluralize(model.name)}`;
  const headers = cookies ? { Cookie: cookies } : {};
  const doc = await request({
    url,
    headers,
    body,
    method: 'POST',
  });

  return deserialize(doc, model.schema);
}

async function remove({ model, param }, cookies) {
  const url = `${API_URL}/${pluralize(model.name)}/${param}`;
  const headers = cookies ? { Cookie: cookies } : {};

  await request({
    url,
    headers,
    method: 'DELETE',
  });

  return true;
}

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

const posts = {
  find: (query, cookies) => find({ model: Post, query }, cookies),
  findOne: (path, cookies) => findOne({ model: Post, param: path }, cookies),
  update: (path, body, cookies) => update({ model: Post, param: path, body }, cookies),
  create: (body, cookies) => create({ model: Post, body }, cookies),
  remove: (path, cookies) => remove({ model: Post, param: path }, cookies),
  fetchCommentsCount,
};

const pages = {
  find: cookies => find({ model: Page }, cookies),
  findOne: (path, cookies) => findOne({ model: Page, param: path }, cookies),
  update: (path, body, cookies) => update({ model: Page, param: path, body }, cookies),
  create: (body, cookies) => create({ model: Page, body }, cookies),
  remove: (path, cookies) => remove({ model: Page, param: path }, cookies),
};

const trashPosts = {
  find: (query, cookies) => find({ model: TrashPost, query }, cookies),
  findOne: (id, cookies) => findOne({ model: TrashPost, param: id }, cookies),
  update: (id, body, cookies) => update({ model: TrashPost, param: id, body }, cookies),
  create: (body, cookies) => create({ model: TrashPost, body }, cookies),
  remove: (id, cookies) => remove({ model: TrashPost, param: id }, cookies),
};

const users = {
  find: (query, cookies) => find({ model: User, query }, cookies),
  findOne: (id, cookies) => findOne({ model: User, param: id }, cookies),
};

const tags = {
  getAll: () => {
    const url = `${API_URL}/tags`;
    return request({ url });
  },
  getCloud: () => {
    const url = `${API_URL}/tags/cloud`;
    return request({ url });
  },
};

const API = {
  posts,
  pages,
  trashPosts,
  users,
  search,
  tags,
};

export default API;
