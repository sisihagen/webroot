var gulp      = require('gulp'),
    imagemin  = require('gulp-imagemin'),
    webp      = require('gulp-webp'),
    sprite    = require('gulp.spritesmith'),
    rename    = require('gulp-rename'),
    buffer    = require('vinyl-buffer'),
    merge     = require('merge-stream'),
    change    = require('gulp-changed'),
    config    = require('./config');

gulp.task('image', ['webp', 'sp'], function() {
    return gulp.src(config.images.src)
      .pipe(change(config.images.out))
      .pipe(imagemin({
          progressive: true
      }))
      .pipe(gulp.dest(config.images.out));
});

gulp.task('webp', [], function() {
    return gulp.src(config.webp.src)
      .pipe(change(config.webp.out))
      .pipe(webp(config.webp.options))
      .pipe(gulp.dest(config.webp.out));
});

// sprite for cover production mode
gulp.task('sp', function () {
  var spriteData = gulp.src(config.sprite.src).pipe(sprite({
    imgName: 'cover.jpg',
    cssName: 'cover.css',
    imgPath: '/static/img/cover/cover.jpg'
  }));

  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(gulp.dest(config.sprite.out));

  var cssStream = spriteData.css
    .pipe(rename('_cover.scss'))
    .pipe(gulp.dest(config.sprite.css));

  return merge(imgStream, cssStream);
});

// sprite for development
gulp.task('sd', function () {
  var spriteData = gulp.src(config.sprite.src).pipe(sprite({
    imgName: 'cover.jpg',
    cssName: 'cover.css',
    imgPath: '/static/static/img/cover/cover.jpg'
  }));

  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(gulp.dest(config.sprite.bout));

  var cssStream = spriteData.css
    .pipe(rename('_cover.scss'))
    .pipe(gulp.dest(config.sprite.css));

  return merge(imgStream, cssStream);
});
