var gulp = require('gulp'),
    conventionalChangelog = require('gulp-conventional-changelog'),
    bump = require('gulp-bump'),
    git = require('gulp-git'),
    fs = require('fs'),
    runSequence = require('run-sequence'),
    prompt = require('gulp-prompt');

gulp.task('changelog', function() {
    return gulp.src('CHANGELOG.md', {
            buffer: false
        })
        .pipe(conventionalChangelog({
            preset: 'webroot'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-version', function() {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('git-add',[], function() {
    return gulp.src('./*')
      .pipe(git.add());
});

gulp.task('commit-changes', function() {
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
});

gulp.task('push-changes', function(done) {
    git.push('origin', 'master', done);
});

gulp.task('create-new-tag', function(done) {
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
});

gulp.task('release', function(callback) {
    runSequence('bump-version',
        'changelog',
        'git-add',
        'commit-changes',
        'push-changes',
        callback);
});
