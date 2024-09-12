const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config').current;

const dev = config.environment !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const staticDirPath = config.environment === 'development' ? '../stuff' : '../../stuff';

app.prepare()
  .then(() => {
    const server = express();

    server.use('/stuff', express.static(path.join(__dirname, staticDirPath)));

    server.get('/rss', async (req, res) => {
      const response = await fetch(`${config.apiURL}/rss`);
      const xml = await response.text();

      res
        .header({
          'Content-Type': 'application/rss+xml',
          'Content-Disposition': 'attachment; filename="poohitan.com.xml',
        })
        .send(xml);
    });

    server.use(cookieParser());

    server.use('/static/flags', express.static(path.join(__dirname, 'node_modules/flag-icon-css/flags'), { maxAge: 31557600000 }));

    server.get('/*/pdf', (req, res) => {
      const pagePath = req.params[0];

      res.redirect(`${config.apiURL}/pdf/${pagePath}`);
    });

    server.get('*', (req, res) => handle(req, res));

    server.post('/api/auth/*', (req, res) => handle(req, res));

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
