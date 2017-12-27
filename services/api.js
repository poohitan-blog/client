import fetch from 'isomorphic-unfetch';
import pluralize from 'pluralize';
import queryString from 'query-string';

import config from '../config';
import deserialize from '../utils/deserialize';
import fetchCommentsCount from '../utils/fetch-comments-count';

import Post from '../models/post';
import Page from '../models/page';
import TrashPost from '../models/trash-post';
import User from '../models/user';

const API_URL = config.current.apiURL;

async function findAll({ model }) {
  const modelName = pluralize(model.name);
  const response = await fetch(`${API_URL}/${modelName}`);
  const json = await response.json();
  const deserialized = deserialize(json, model.schema);

  return deserialized;
}

async function findBy({ model, param, queryParams }) {
  const modelName = pluralize(model.name);
  let url = `${API_URL}/${modelName}`;

  if (param) {
    url += `/${param}`;
  }

  if (queryParams) {
    url += `?${queryString.stringify(queryParams)}`;
  }

  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    throw json;
  }

  const deserialized = deserialize(json, model.schema);

  return deserialized;
}

const posts = {
  findAll: () => findAll({ model: Post }),
  findByPath: path => findBy({ model: Post, param: path }),
  findByTag: tag => findBy({ model: Post, queryParams: { tag } }),
  fetchCommentsCount,
};

const pages = {
  findAll: () => findAll({ model: Page }),
  findByPath: path => findBy({ model: Page, param: path }),
};

const trashPosts = {
  findAll: () => findAll({ model: TrashPost }),
  findById: id => findBy({ model: TrashPost, param: id }),
  findByDate: date => findBy({ model: TrashPost, queryParams: { createdAt: date.toISOString() } }),
};

const users = {
  findAll: () => findAll({ model: User }),
  findById: id => findBy({ model: User, param: id }),
};

const API = {
  posts,
  pages,
  trashPosts,
  users,
};

export default API;
