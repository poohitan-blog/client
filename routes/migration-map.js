const express = require('express');

const postsMap = {
  41: '/p/ukulele-piezo-pickup',
  40: '/p/orbita-holodnyi-yar',
  39: '/p/new-year-with-homeless',
  36: '/p/read-2016',
  35: '/p/berlin-dresden-and-so-on',
  34: '/p/autumn-dzharylhach',
  33: '/p/bye-univer',
  32: '/p/code-for-food',
  31: '/p/read-2015',
  30: '/p/alleycat-lucas-brunelle',
  29: '/p/hrechka-diet',
  28: '/p/brevet-200-2015',
  27: '/p/time-treats',
  26: '/p/three-days-no-water',
  25: '/p/diy-furniture',
  21: '/p/read-2014',
  24: '/p/back-to-lpml',
  23: '/p/drum-stuff-2',
  20: '/p/yellow-singlespeed',
  19: '/p/thoughts-on-discrimination',
  18: '/p/sotka-2014',
  17: '/p/first-long-ride',
  16: '/p/math-parser-c-sharp',
  15: '/p/sweets-for-pedestrians',
  14: '/p/custom-mosquite-build',
  13: '/p/drum-stuff',
  12: '/p/disqus-comments-count',
  11: '/p/thoughts-on-bydlokod',
  10: '/p/bicycle-vs-public-transport',
  9: '/p/javascript-onbeforeunload',
  8: '/p/deterministic-chaos',
  6: '/p/vinnytsia-avto-moto-velo-foto-tele-radio-museum',
  5: '/p/tickets-collection',
  3: '/p/validator-restoration',
  2: '/p/koran-quotes',
  1: '/p/hello-world',
};

const router = express.Router();

router.get('/p/:post_old_id', (req, res, next) => {
  const newPostPath = postsMap[req.params.post_old_id];

  if (newPostPath) {
    return res.redirect(301, newPostPath);
  }

  return next();
});

const stuffList = ['shutup', 'uah', 'tortynka', 'thats-a-paddlin', 'webcolors', 'comic-saaaaaaanns!!', 'google', 'homer', 'prehistoric-2', 'rainbow-sheep'];

stuffList.forEach((stuffName) => {
  router.get(`/${stuffName}`, (req, res) => res.redirect(301, `/stuff/${stuffName}`));
});

module.exports = router;
