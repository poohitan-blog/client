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
    app.render(req, res, '/admin/edit-post', Object.assign({}, req.query, { path: req.params.post_path }));
  });

  return router;
};
