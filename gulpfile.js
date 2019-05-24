'use strict';

// https://github.com/jeromecoupe/webstoemp/blob/master/gulpfile.js

// modules
const { src, dest, watch, parallel, series } = require('gulp');
const del = require('del');
const  cp = require('child_process');
const  gc = require('gulp-postcss');
const  gs = require('gulp-sass');
const  ma = require('gulp-sourcemaps');
const  gp = require('gulp-plumber');
const  cc = require('gulp-concat');
const  ug = require('gulp-uglify');
const  hm = require('gulp-htmlmin');
const  ex = require('gulp-exec');
const  bu = require('gulp-bump');
const  gi = require('gulp-git');
const  pp = require('gulp-prompt');
const  fe = require('fs-extra');
const  ap = require('autoprefixer');
const  pf = require('postcss-flexibility');
const  po = require('postcss-opacity');
const  cn = require('cssnano');

// clean the build folders
function clean() {
  return del('./public/**');
}

// build the site
function hugo() {
  return cp.spawn('npx', ['hugo'], { stdio: "inherit" });
}

// style
function style() {
    return src('./static/static/scss/layout.scss')
    .pipe(gp())
    .pipe(ma.init())
    .pipe(gs({ outputStyle: "expanded" }))
    .pipe(gc([ ap(), pf(), po(), cn(), ]))
    .pipe(ma.write('.'))
    .pipe(dest('./static/static/css'));
}

// javascript
function script() {
  return src(['./bower_components/jquery/dist/jquery.js', './bower_components/svgxuse/svgxuse.js', './static/static/js/app.js'])
  .pipe(gp())
  .pipe(cc('site.js'))
  .pipe(dest('./static/static/js'))
  .pipe(ug())
  .pipe(dest('./static/static/js'))
}

// folder
function folder() {
  return cp.spawn('npx', ['./bin/folder.sh'], { stdio: "inherit" });
}

// html
function de() {
  return src('./public/build/de/**/*.html')
    .pipe(hm({collapseWhitespace: true}))
    .pipe(dest('./public/dest/silviosiefke.de/htdocs'))
    .pipe(ex('cp ./public/build/de/sitemap.xml ./public/dest/silviosiefke.de/htdocs/'))
    .pipe(ex('cp ./public/build/de/robots.txt ./public/dest/silviosiefke.de/htdocs/'));
}

function en() {
  return src('./public/build/en/**/*.html')
    .pipe(hm({collapseWhitespace: true}))
    .pipe(dest('./public/dest/silviosiefke.com/htdocs'))
    .pipe(ex('cp ./public/build/en/sitemap.xml ./public/dest/silviosiefke.com/htdocs/'))
    .pipe(ex('cp ./public/build/en/robots.txt ./public/dest/silviosiefke.com/htdocs/'));
}

function fr() {
  return src('./public/build/fr/**/*.html')
    .pipe(hm({collapseWhitespace: true}))
    .pipe(dest('./public/dest/silviosiefke.fr/htdocs'))
    .pipe(ex('cp ./public/build/fr/sitemap.xml ./public/dest/silviosiefke.fr/htdocs/'))
    .pipe(ex('cp ./public/build/fr/robots.txt ./public/dest/silviosiefke.fr/htdocs/'));
}

function ru() {
  return src('./public/build/ru/**/*.html')
    .pipe(hm({collapseWhitespace: true}))
    .pipe(dest('./public/dest/silviosiefke.ru/htdocs'))
    .pipe(ex('cp ./public/build/ru/sitemap.xml ./public/dest/silviosiefke.ru/htdocs/'))
    .pipe(ex('cp ./public/build/ru/robots.txt ./public/dest/silviosiefke.ru/htdocs/'));
}

// images
function images() {
  return cp.spawn('npx', ['./bin/images.sh'], { stdio: "inherit" });
}

// static
function assets() {
  return cp.spawn('npx', ['./bin/assets.sh'], { stdio: "inherit" });
}

// deploy
function deploy() {
  return cp.spawn('npx', ['./bin/deploy.sh'], { stdio: "inherit" });
}

// release
function bump() {
   return src(['./bower.json', './package.json'])
    .pipe(bu())
    .pipe(dest('./'));
}

function add() {
    return src('./')
      .pipe(gi.add());
}

function commit() {
    return src('./')
        .pipe(pp.prompt({
            type: 'input',
            name: 'commit',
            message: 'Commit message... '
        }, function(res) {
            return src(['./'], {
              buffer: false
            })
        .pipe(gi.commit(res.commit, {args: '-S -m'}));
    }));
}

function push() {
    return src('./')
      gi.push('origin', 'master', done);
}

// watch
function watchfiles() {
  return watch('./static/static/scss/**/*.scss', series('style'));
  return watch('./static/static/js/app.js', series('script'));
}


// jobs
// minify html as one task
const html = parallel(de, en, fr, ru);

// build task
const build = series(clean, hugo, folder, parallel(style, script, images, html), assets, deploy);

// git task
const git = series(bump, add, commit, push);

// watch task
const view = series(watchfiles);

// tasks
exports.clean   = clean;
exports.hugo    = hugo;
exports.style   = style;
exports.scripts = script;
exports.folder  = folder;
exports.images  = images;
exports.html    = html;
exports.assets  = assets;
exports.build   = build;
exports.deploy  = deploy;
exports.git     = git;
exports.watch   = view;
exports.default = watch;
