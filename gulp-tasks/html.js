var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    cleanDest = require('gulp-clean-dest'),
    exec = require('gulp-exec'),
    gzip = require('gulp-gzip'),
    config = require('./config')

// htmlmin for english site
gulp.task('en', [], function() {
    return gulp.src(config.en.src)
        .pipe(cleanDest(config.en.out))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(exec('cp ./public/build/en/sitemap.xml ./public/dest/silviosiefke.com/htdocs/'))
        .pipe(gulp.dest(config.en.out));
});

// htmlmin for french site
gulp.task('fr', [], function() {
    return gulp.src(config.fr.src)
        .pipe(cleanDest(config.fr.out))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(exec('cp ./public/build/fr/sitemap.xml ./public/dest/silviosiefke.fr/htdocs/'))
        .pipe(gulp.dest(config.fr.out));
});

// htmlmin for german site
gulp.task('de', [], function() {
    return gulp.src(config.de.src)
        .pipe(cleanDest(config.de.out))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(exec('cp ./public/build/de/sitemap.xml ./public/dest/silviosiefke.de/htdocs/'))
        .pipe(gulp.dest(config.de.out));
});

// gulp minified html sites and copy dest
gulp.task('html', ['de', 'en', 'fr'], function() {});
