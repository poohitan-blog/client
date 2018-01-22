const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/trash', (req, res) => {
    app.render(req, res, '/trash', req.query);
  });

  router.get('/trash/index.php', (req, res) => {
    app.render(req, res, '/trash', req.query);
  });

  router.get('/trash/new', (req, res) => {
    app.render(req, res, '/admin/edit-trash-post', req.query);
  });

  router.get('/trash/:trash_post_id', (req, res) => {
    app.render(req, res, '/trash', Object.assign({}, req.query, { id: req.params.trash_post_id }));
  });

  router.get('/trash/:trash_post_id/edit', (req, res) => {
    app.render(req, res, '/admin/edit-trash-post', Object.assign({}, req.query, { id: req.params.trash_post_id }));
  });

  return router;
};
