var gulp                  = require('gulp'),
    conventionalChangelog = require('gulp-conventional-changelog'),
    bump                  = require('gulp-bump'),
    git                   = require('gulp-git'),
    prompt                = require('gulp-prompt'),
    fs                    = require('fs'),
    runSequence           = require('run-sequence');

gulp.task('changelog', gulp.series(function() {
    return gulp.src('CHANGELOG.md', {
            buffer: false
        })
        .pipe(conventionalChangelog({
            preset: 'webroot'
        }))
        .pipe(gulp.dest('./'));
}));

gulp.task('bump-version', gulp.series(function() {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
}));

gulp.task('git-add',  gulp.series(function() {
    return gulp.src('./')
      .pipe(git.add());
}));

gulp.task('commit-changes', gulp.series(function() {
    gulp.src('./')
        .pipe(prompt.prompt({
            type: 'input',
            name: 'commit',
            message: 'Please enter commit message...'
        }, function(res) {
            return gulp.src([
                    '!node_modules/',
                    '!bower_components/',
                    '!php',
                    '!sprites',
                    '!data',
                    '!privat.sublime-project',
                    '!privat.sublime-workspace',
                    '!public',
                    './*'], {
                    buffer: false
                })
                .pipe(git.commit(res.commit, {args: '-S -m'}));
        }));
}));

gulp.task('push-changes', gulp.series(function(done) {
    git.push('origin', 'master', done);
}));

gulp.task('create-new-tag', gulp.series(function(done) {
    var version = getPackageJsonVersion();
    git.tag(version, 'Created Tag for version: ' + version, function(error) {
        if (error) {
            return done(error);
        }
        git.push('origin', 'master', {
            args: '--tags'
        }, done);
    });

    function getPackageJsonVersion() {
        return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
    };
}));

gulp.task('release', gulp.series(function(callback) {
    runSequence('bump-version',
        'changelog',
        'git-add',
        'commit-changes',
        'push-changes',
        callback);
}));
