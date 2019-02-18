var gulp      = require('gulp'),
    sprite    = require('gulp.spritesmith'),
    rename    = require('gulp-rename'),
    buffer    = require('vinyl-buffer'),
    merge     = require('merge-stream'),
    change    = require('gulp-changed'),
    exec      = require('gulp-exec'),
    config    = require('./config');

// sprite for cover production mode
gulp.task('sp', gulp.series(function () {
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
}));

// optimize images and copy to static folder
gulp.task('image', gulp.series('sp', function () {
    return gulp.src(config.webp.src)
      .pipe(exec('sh ./bin/images.sh'));
}));
