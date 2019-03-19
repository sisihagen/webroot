var source = './public/build';
var dest = './public/dest';
var assets = './static/static';
var de = './public/dest/silviosiefke.de/htdocs';
var en = './public/dest/silviosiefke.com/htdocs';
var fr = './public/dest/silviosiefke.fr/htdocs';
var ru = './public/dest/silviosiefke.ru/htdocs';
var static = './public/dest/static.silviosiefke.com/htdocs';

module.exports = {
  css: {
    src: assets + '/css/**/*',
    out: static + '/css'
  },
  de: {
    src: source + '/de/**/*.html',
    tmp: source + '/de/tmp',
    out: de
  },
  en: {
    src: source + '/en/**/*.html',
    tmp: source + '/en/tmp',
    out: en
  },
  fr: {
    src: source + '/fr/**/*.html',
    tmp: source + '/fr/tmp',
    out: fr
  },
  ru: {
    src: source + '/ru/**/*.html',
    tmp: source + '/ru/tmp',
    out: ru
  },
  fonts: {
    src: assets + '/fonts/**/*',
    out: static + '/fonts'
  },
  gzip: {
    options: {}
  },
  images: {
    src: assets + '/img/**/*',
    out: static + '/img'
  },
  sass: {
    src: assets + '/scss/**/*.scss',
    out: assets + '/css'
  },
  scripts: {
    out: static + '/js',
    dev: assets + '/js'
  },
  sprite: {
    src: './sprites/small/*.jpg',
    srcw: './sprites/small/*.webp',
    out: static + '/img/cover',
    css: assets + '/scss/_includes',
    bout: assets + '/img/cover'
  },
  webp: {
    src: assets + '/img/**/*.{jpg,png}',
    out: static + '/img',
    options: {}
  }
};
