const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/pages/new', (req, res) => {
    app.render(req, res, '/admin/edit-page', req.query);
  });

  router.get('/:page_path', (req, res) => {
    app.render(req, res, '/page', { ...req.query, path: req.params.page_path });
  });

  router.get('/:page_path/edit', (req, res) => {
    app.render(req, res, '/admin/edit-page', { ...req.query, path: req.params.page_path });
  });

  return router;
};
