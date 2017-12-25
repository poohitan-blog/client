import fetch from 'isomorphic-unfetch';
import pluralize from 'pluralize';

import config from '../config';
import deserialize from '../utils/deserialize';

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

async function findBy({ model, param }) {
  const modelName = pluralize(model.name);
  const response = await fetch(`${API_URL}/${modelName}/${param}`);
  const json = await response.json();
  const deserialized = deserialize(json, model.schema);

  return deserialized;
}

const posts = {
  findAll: () => findAll({ model: Post }),
  findByPath: path => findBy({ model: Post, param: path }),
};

const pages = {
  findAll: () => findAll({ model: Page }),
  findByPath: path => findBy({ model: Page, param: path }),
};

const trashPosts = {
  findAll: () => findAll({ model: TrashPost }),
  findById: id => findBy({ model: TrashPost, param: id }),
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
