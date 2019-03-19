var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    exec = require('gulp-exec'),
    gzip = require('gulp-gzip'),
    config = require('./config')

// htmlmin for english site
gulp.task('en', gulp.series(function(done) {
    return gulp.src(config.en.src)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.en.out))
        .pipe(exec('cp ./public/build/en/sitemap.xml ./public/dest/silviosiefke.com/htdocs/'));
    done();
}));

// htmlmin for french site
gulp.task('fr', gulp.series(function(done) {
    return gulp.src(config.fr.src)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.fr.out))
        .pipe(exec('cp ./public/build/fr/sitemap.xml ./public/dest/silviosiefke.fr/htdocs/'));
    done();
}));

// htmlmin for german site
gulp.task('de', gulp.series(function(done) {
    return gulp.src(config.de.src)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.de.out))
        .pipe(exec('cp ./public/build/de/sitemap.xml ./public/dest/silviosiefke.de/htdocs/'));
    done();
}));

gulp.task('ru', gulp.series(function(done) {
    return gulp.src(config.ru.src)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.ru.out))
        .pipe(exec('cp ./public/build/ru/sitemap.xml ./public/dest/silviosiefke.ru/htdocs/'));
    done();
}));

// gulp minified html sites and copy dest
gulp.task('html', gulp.series('de', 'en', 'fr', 'ru', function(done) { done(); }));
