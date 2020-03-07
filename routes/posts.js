const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/posts/new', (req, res) => {
    app.render(req, res, '/p/[slug]/edit', { ...req.query, action: 'new' });
  });

  // router.get('/p/:post_path', (req, res) => {
  //   app.render(req, res, '/post', { ...req.query, path: req.params.post_path });
  // });

  // router.get('/p/:post_path/edit', (req, res) => {
  //   app.render(req, res, '/p/[slug]/edit', { ...req.query, slug: req.params.post_path, action: 'edit' });
  // });

  // router.get('/p/:post_path/language/new', (req, res) => {
  //   app.render(req, res, '/p/[slug]/[language]/[action]', {
  // ...req.query, slug: req.params.post_path, action: 'new' });
  // });

  // router.get('/p/:post_path/translations/:translation_language/edit', (req, res) => {
  //   app.render(req, res, '/p/[slug]/translations/[action]', {
  //     ...req.query,
  //     post: req.params.post_path,
  //     language: req.params.translation_language,
  //     action: 'edit',
  //   });
  // });

  // router.get('/p/:post_path/:post_language', (req, res) => {
  //   app.render(req, res, '/p/[slug]/translations', {
  //     ...req.query,
  //     slug: req.params.post_path,
  //     language: req.params.post_language,
  //   });
  // });

  return router;
};
