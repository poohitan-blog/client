import pluralize from 'pluralize';

import { current } from '../config';
import deserialize from '../utils/deserialize';
import request from '../utils/request';

import Post from '../models/post';
import PostTranslation from '../models/post-translation';
import Page from '../models/page';
import TrashPost from '../models/trash-post';
import User from '../models/user';

const API_URL = current.apiURL;
const INLINE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg'];

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

async function upload(files, cookies) {
  const images = files.filter((file) => INLINE_IMAGE_TYPES.includes(file.type));
  const restFiles = files.filter((file) => !images.includes(file));

  const imagesFormData = new FormData();
  images.forEach((image) => imagesFormData.append('image', image));

  const restFilesFormData = new FormData();
  restFiles.forEach((file) => restFilesFormData.append('file', file));

  const headers = { Cookie: cookies };

  const uploadImages = !images.length
    ? Promise.resolve([])
    : request({
      url: `${API_URL}/images`,
      headers,
      body: imagesFormData,
      method: 'POST',
      formData: true,
    });

  const uploadRestFiles = !restFiles.length
    ? Promise.resolve([])
    : request({
      url: `${API_URL}/files`,
      headers,
      body: restFilesFormData,
      method: 'POST',
      formData: true,
    });

  return Promise.all([
    uploadImages,
    uploadRestFiles,
  ])
    .then(([uploadedImages, uploadedFiles]) => [...uploadedImages, ...uploadedFiles]);
}

const posts = {
  find: (query, cookies) => find({ model: Post, query }, cookies),
  findOne: (path, cookies) => findOne({ model: Post, param: path }, cookies),
  findSimilar: (path) => {
    const url = `${API_URL}/posts/${path}/similar`;

    return request({ url });
  },
  update: (path, body, cookies) => update({ model: Post, param: path, body }, cookies),
  create: (body, cookies) => create({ model: Post, body }, cookies),
  remove: (path, cookies) => remove({ model: Post, param: path }, cookies),
};

const postTranslations = {
  find: (query, cookies) => find({ model: PostTranslation, query }, cookies),
  findOne: (id, cookies) => findOne({ model: PostTranslation, param: id }, cookies),
  update: (id, body, cookies) => update({ model: PostTranslation, param: id, body }, cookies),
  create: (body, cookies) => create({ model: PostTranslation, body }, cookies),
  remove: async (postPath, language, cookies) => {
    const { translations } = await posts.findOne(postPath);
    const { id } = translations.find((translation) => translation.lang === language);

    return remove({ model: PostTranslation, param: id }, cookies);
  },
};

const pages = {
  find: (cookies) => find({ model: Page }, cookies),
  findOne: (path, cookies) => findOne({ model: Page, param: path }, cookies),
  update: (path, body, cookies) => update({ model: Page, param: path, body }, cookies),
  create: (body, cookies) => create({ model: Page, body }, cookies),
  remove: (path, cookies) => remove({ model: Page, param: path }, cookies),
};

const trashPosts = {
  find: (query, cookies) => find({ model: TrashPost, query }, cookies),
  findOne: (id, cookies) => findOne({ model: TrashPost, param: id }, cookies),
  findRandom: (cookies) => findOne({ model: TrashPost, param: 'random' }, cookies),
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
  postTranslations,
  pages,
  trashPosts,
  users,
  search,
  tags,
  upload,
};

export default API;
