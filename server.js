const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const fetch = require('isomorphic-unfetch');
const path = require('path');
const config = require('./config').current;

const dev = config.environment !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const migrationMap = require('./routes/migration-map.js');

const pagesRouter = require('./routes/pages.js');
const postsRouter = require('./routes/posts.js');
const trashRouter = require('./routes/trash.js');

const staticDirPath = config.environment === 'development' ? '../stuff' : '../../stuff';

app.prepare()
  .then(() => {
    const server = express();

    server.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, '/robots.txt')));
    server.get('/humans.txt', (req, res) => res.sendFile(path.join(__dirname, '/humans.txt')));

    server.use(migrationMap);
    server.use('/stuff', express.static(path.join(__dirname, staticDirPath)));

    server.get('/rss', async (req, res) => {
      const response = await fetch(`${config.apiURL}/rss`);
      const xml = await response.text();

      res.header({ 'Content-Type': 'application/rss+xml' }).send(xml);
    });

    server.use(cookieParser());

    server.use('/static/flags', express.static(path.join(__dirname, 'node_modules/flag-icon-css/flags'), { maxAge: 31557600000 }));

    server.get('/wardrobe', (req, res) => app.render(req, res, '/login', req.query));
    server.get('/archive', (req, res) => app.render(req, res, '/archive', req.query));
    server.get('/top', (req, res) => app.render(req, res, '/top', req.query));
    server.get('/search', (req, res) => app.render(req, res, '/search', req.query));
    server.get('/upload', (req, res) => app.render(req, res, '/admin/upload-files', req.query));

    server.get('/tag/:tag_name', (req, res) => {
      app.render(req, res, '/tag', Object.assign({}, req.query, { tag: req.params.tag_name }));
    });

    server.use(trashRouter(app));
    server.use(postsRouter(app));
    server.use(pagesRouter(app));

    server.get('*', (req, res) => handle(req, res));

    server.listen(config.port, (error) => {
      if (error) {
        throw error;
      }

      console.log(`Listening on ${config.port}`);
    });
  })
  .catch((error) => {
    console.error(error.stack);
    process.exit(1);
  });
