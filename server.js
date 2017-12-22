const express = require('express');
const next = require('next');
const config = require('./config').current;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const pageNames = ['about', 'archive', 'trash'];

app.prepare()
  .then(() => {
    const server = express();

    server.get('/archive', (req, res) => {
      app.render(req, res, '/archive');
    });

    server.get('/:path', (req, res) => {
      let actualPage;

      if (pageNames.includes(req.params.path)) {
        actualPage = '/page';
      } else {
        actualPage = '/post';
      }

      const queryParams = { path: req.params.path };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(config.port, (err) => {
      if (err) throw err;
      console.log(`> Listening on ${config.port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
