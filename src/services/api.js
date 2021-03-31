import { current } from 'config';
import request from 'utils/request';

const API_URL = current.apiURL;
const INLINE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg'];

const MODEL_PATHS = {
  POST: 'posts',
  POST_TRANSLATION: 'post-translations',
  PAGE: 'pages',
  TRASH_POST: 'trash-posts',
  USER: 'users',
  MOMENT: 'moments',
};

export async function authenticate(login, password) {
  return request({
    url: `${current.apiURL}/authenticate`,
    method: 'POST',
    body: {
      login,
      password,
    },
  });
}

function find(modelName) {
  return async (query, cookies) => {
    const url = `${API_URL}/${modelName}`;
    const { docs, meta } = await request({ url, query, cookies });

    return { docs, meta };
  };
}

function findOne(modelName) {
  return async (param, cookies) => {
    const url = `${API_URL}/${modelName}/${param}`;
    const doc = await request({ url, cookies });

    return doc;
  };
}

function update(modelName) {
  return async (param, body, cookies) => {
    const url = `${API_URL}/${modelName}/${param}`;
    const doc = await request({
      url,
      cookies,
      body,
      method: 'PATCH',
    });

    return doc;
  };
}

function create(modelName) {
  return async (body, cookies) => {
    const url = `${API_URL}/${modelName}`;
    const doc = await request({
      url,
      cookies,
      body,
      method: 'POST',
    });

    return doc;
  };
}

function remove(modelName) {
  return async (param, cookies) => {
    const url = `${API_URL}/${modelName}/${param}`;

    await request({
      url,
      cookies,
      method: 'DELETE',
    });

    return true;
  };
}

async function search(query, cookies) {
  const url = `${API_URL}/search`;
  const { docs, meta } = await request({ url, query, cookies });

  return { docs, meta };
}

async function upload(files, cookies, options = {}) {
  const { analyze = false } = options;

  const images = files.filter((file) => INLINE_IMAGE_TYPES.includes(file.type));
  const restFiles = files.filter((file) => !images.includes(file));

  const imagesFormData = new FormData();
  images.forEach((image) => imagesFormData.append('image', image));

  const restFilesFormData = new FormData();
  restFiles.forEach((file) => restFilesFormData.append('file', file));

  const uploadImages = !images.length
    ? Promise.resolve([])
    : request({
      url: `${API_URL}/images?analyze=${analyze}`,
      cookies,
      body: imagesFormData,
      method: 'POST',
      formData: true,
    });

  const uploadRestFiles = !restFiles.length
    ? Promise.resolve([])
    : request({
      url: `${API_URL}/files`,
      cookies,
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
  find: find(MODEL_PATHS.POST),
  findOne: findOne(MODEL_PATHS.POST),
  findSimilar: (path) => {
    const url = `${API_URL}/${MODEL_PATHS.POST}/${path}/similar`;

    return request({ url });
  },
  update: update(MODEL_PATHS.POST),
  create: create(MODEL_PATHS.POST),
  remove: remove(MODEL_PATHS.POST),
};

const postTranslations = {
  find: find(MODEL_PATHS.POST_TRANSLATION),
  findOne: findOne(MODEL_PATHS.POST_TRANSLATION),
  update: update(MODEL_PATHS.POST_TRANSLATION),
  create: create(MODEL_PATHS.POST_TRANSLATION),
  remove: async (postSlug, language, cookies) => {
    const { translations } = await posts.findOne(postSlug);
    const { id } = translations.find((translation) => translation.lang === language);

    return remove(MODEL_PATHS.POST_TRANSLATION)(id, cookies);
  },
};

const pages = {
  find: find(MODEL_PATHS.PAGE),
  findOne: findOne(MODEL_PATHS.PAGE),
  update: update(MODEL_PATHS.PAGE),
  create: create(MODEL_PATHS.PAGE),
  remove: remove(MODEL_PATHS.PAGE),
};

const trashPosts = {
  find: find(MODEL_PATHS.TRASH_POST),
  findOne: findOne(MODEL_PATHS.TRASH_POST),
  findRandom: (cookies) => findOne(MODEL_PATHS.TRASH_POST)('random', cookies),
  update: update(MODEL_PATHS.TRASH_POST),
  create: create(MODEL_PATHS.TRASH_POST),
  remove: remove(MODEL_PATHS.TRASH_POST),
};

const users = {
  find: find(MODEL_PATHS.USER),
  findOne: findOne(MODEL_PATHS.USER),
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

const moments = {
  find: find(MODEL_PATHS.MOMENT),
  findOne: findOne(MODEL_PATHS.MOMENT),
  update: update(MODEL_PATHS.MOMENT),
  create: create(MODEL_PATHS.MOMENT),
  remove: remove(MODEL_PATHS.MOMENT),
};

export const analytics = {
  trackPageView(path) {
    const url = `${API_URL}/analytics/page-view`;

    return request({
      url,
      method: 'POST',
      body: {
        path,
      },
    });
  },
  submitFlow(flow) {
    const url = `${API_URL}/analytics/flow`;

    global.navigator.sendBeacon(url, JSON.stringify(flow));
  },
};

export function sendFeedback(text) {
  const url = `${API_URL}/feedback`;

  return request({
    url,
    method: 'POST',
    body: {
      text,
    },
  });
}

const API = {
  authenticate,
  posts,
  postTranslations,
  pages,
  trashPosts,
  users,
  search,
  tags,
  moments,
  upload,
  analytics,
  sendFeedback,
};

export default API;
