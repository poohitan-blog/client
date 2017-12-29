const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const config = require('./config').current;

const dev = config.environment !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.use(cookieParser());

    server.get('/archive', (req, res) => {
      app.render(req, res, '/archive', req.query);
    });

    server.get('/search', (req, res) => {
      app.render(req, res, '/search', req.query);
    });

    server.get('/trash', (req, res) => {
      app.render(req, res, '/trash', req.query);
    });

    server.get('/trash/:trash_post_id', (req, res) => {
      const queryParams = { id: req.params.trash_post_id };
      app.render(req, res, '/trash', queryParams);
    });

    server.get('/tag/:tag_name', (req, res) => {
      app.render(req, res, '/tag', { tag: req.params.tag_name });
    });

    server.get('/p/:path', (req, res) => {
      const queryParams = { path: req.params.path };
      app.render(req, res, '/post', queryParams);
    });

    server.get('/:path', (req, res) => {
      const queryParams = { path: req.params.path };
      app.render(req, res, '/page', queryParams);
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(config.port, (error) => {
      if (error) {
        throw error;
      }

      console.log(`> Listening on ${config.port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
