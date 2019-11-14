const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/posts/new', (req, res) => {
    app.render(req, res, '/admin/edit-post', req.query);
  });

  router.get('/p/:post_path', (req, res) => {
    app.render(req, res, '/post', Object.assign({}, req.query, { path: req.params.post_path }));
  });

  router.get('/p/:post_path/edit', (req, res) => {
    app.render(req, res, '/admin/edit-post', Object.assign({}, req.query, {
      path: req.params.post_path,
    }));
  });

  router.get('/p/:post_path/translations/new', (req, res) => {
    app.render(req, res, '/admin/edit-post-translation', Object.assign({}, req.query, {
      post: req.params.post_path,
    }));
  });

  router.get('/p/:post_path/translations/:translation_language/edit', (req, res) => {
    app.render(req, res, '/admin/edit-post-translation', Object.assign({}, req.query, {
      post: req.params.post_path,
      language: req.params.translation_language,
    }));
  });

  router.get('/p/:post_path/:post_language', (req, res) => {
    app.render(req, res, '/post', Object.assign({}, req.query, {
      path: req.params.post_path,
      language: req.params.post_language,
    }));
  });

  return router;
};
