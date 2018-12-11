const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/redirects', (req, res) => {
    app.render(req, res, '/admin/redirects', req.query);
  });

  return router;
};
