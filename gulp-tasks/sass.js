var gulp       = require('gulp'),
    exec       = require('gulp-exec'),
    postcss    = require('gulp-postcss'),
    sass       = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    webpcss    = require("gulp-webpcss"),
    cssnext    = require('postcss-cssnext'),
    flex       = require('postcss-flexibility'),
    shortcss   = require('postcss-short'),
    opacity    = require('postcss-opacity'),
    cssnano    = require('cssnano'),
    config     = require('./config');

// sass for production task
gulp.task('prod-sass', gulp.series(function() {
    return gulp.src('./static/static/scss/layout.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./static/static/css/'));
}));

gulp.task('prod-css', gulp.series('prod-sass', function() {
    var plugins = [
        shortcss,
        flex,
        opacity,
        cssnext({
          warnForDuplicates: false,
          browsers: ['last 5 version']
        }),
        cssnano
    ];
    return gulp.src(config.css.src)
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.css.out));
}));

// sass for development
gulp.task('devel-sass', gulp.series(function() {
    return gulp.src(config.sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.sass.out))
}));
