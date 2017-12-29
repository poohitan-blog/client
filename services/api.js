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

async function find({ model, queryParams }) {
  const modelName = pluralize(model.name);
  let url = `${API_URL}/${modelName}`;

  if (queryParams) {
    url += `?${queryString.stringify(queryParams)}`;
  }

  const response = await fetch(url);
  const { docs, meta } = await response.json();
  const deserialized = deserialize(docs, model.schema);

  return { docs: deserialized, meta };
}

async function findOne({ model, param }) {
  const modelName = pluralize(model.name);
  const url = `${API_URL}/${modelName}/${param}`;

  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    throw json;
  }

  const deserialized = deserialize(json, model.schema);

  return deserialized;
}

async function search(queryParams) {
  const url = `${API_URL}/search?${queryString.stringify(queryParams)}`;
  const response = await fetch(url);
  const { docs, meta } = await response.json();

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
  find: queryParams => find({ model: Post, queryParams }),
  findOne: path => findOne({ model: Post, param: path }),
  fetchCommentsCount,
};

const pages = {
  find: () => find({ model: Page }),
  findOne: path => findOne({ model: Page, param: path }),
};

const trashPosts = {
  find: queryParams => find({ model: TrashPost, queryParams }),
  findOne: id => findOne({ model: TrashPost, param: id }),
};

const users = {
  find: queryParams => find({ model: User, queryParams }),
  findOne: id => findOne({ model: User, param: id }),
};

const API = {
  posts,
  pages,
  trashPosts,
  users,
  search,
};

export default API;
