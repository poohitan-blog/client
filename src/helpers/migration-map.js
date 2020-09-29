const postsMap = {
  '/p/41': '/p/ukulele-piezo-pickup',
  '/p/40': '/p/orbita-holodnyi-yar',
  '/p/39': '/p/new-year-with-homeless',
  '/p/36': '/p/read-2016',
  '/p/35': '/p/berlin-dresden-and-so-on',
  '/p/34': '/p/autumn-dzharylhach',
  '/p/33': '/p/bye-univer',
  '/p/32': '/p/code-for-food',
  '/p/31': '/p/read-2015',
  '/p/30': '/p/alleycat-lucas-brunelle',
  '/p/29': '/p/hrechka-diet',
  '/p/28': '/p/brevet-200-2015',
  '/p/27': '/p/time-treats',
  '/p/26': '/p/three-days-no-water',
  '/p/25': '/p/diy-furniture',
  '/p/21': '/p/read-2014',
  '/p/24': '/p/back-to-lpml',
  '/p/23': '/p/drum-stuff-2',
  '/p/20': '/p/yellow-singlespeed',
  '/p/19': '/p/thoughts-on-discrimination',
  '/p/18': '/p/sotka-2014',
  '/p/17': '/p/first-long-ride',
  '/p/16': '/p/math-parser-c-sharp',
  '/p/15': '/p/sweets-for-pedestrians',
  '/p/14': '/p/custom-mosquito-build',
  '/p/13': '/p/drum-stuff',
  '/p/12': '/p/disqus-comments-count',
  '/p/11': '/p/thoughts-on-bydlokod',
  '/p/10': '/p/bicycle-vs-public-transport',
  '/p/9': '/p/javascript-onbeforeunload',
  '/p/8': '/p/deterministic-chaos',
  '/p/6': '/p/vinnytsia-avto-moto-velo-foto-tele-radio-museum',
  '/p/5': '/p/tickets-collection',
  '/p/3': '/p/validator-restoration',
  '/p/2': '/p/koran-quotes',
  '/p/1': '/p/hello-world',
  '/p/paris-brest-paris-on-a-film': '/p/paris-brest-paris-through-a-film-camera',
};

const stuffList = ['shutup', 'uah/ru', 'uah/en', 'uah', 'tortynka', 'thats-a-paddlin', 'webcolors', 'comic-saaaaaaanns!!', 'google', 'homer', 'prehistoric-2', 'rainbow-sheep'];

const stuffMap = stuffList.reduce((accumulator, item) => ({
  ...accumulator,
  [`/${item}`]: `/stuff/${item}`,
}), {});

module.exports = {
  ...postsMap,
  ...stuffMap,
};
