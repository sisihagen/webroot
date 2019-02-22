var gulp                  = require('gulp'),
    bump                  = require('gulp-bump'),
    git                   = require('gulp-git'),
    prompt                = require('gulp-prompt'),
    fs                    = require('fs'),
    runSequence           = require('run-sequence');

gulp.task('bump-version', gulp.series(function() {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
}));

gulp.task('git-add',  gulp.series(function() {
    return gulp.src('./')
      .pipe(git.add());
}));

gulp.task('commit-changes', gulp.series(function(done) {
    gulp.src('./')
        .pipe(prompt.prompt({
            type: 'input',
            name: 'commit',
            message: 'Please enter commit message...'
        }, function(res) {
            return gulp.src(['./'], {
                    buffer: false
                })
                .pipe(git.commit(res.commit, {args: '-S -m'}));
        }));
      done();
}));

gulp.task('push-changes', gulp.series(function(done) {
    git.push('origin', 'master', done);
}));

gulp.task('release', gulp.series(function(callback) {
    runSequence('bump-version',
        'git-add',
        'commit-changes',
        'push-changes',
        callback);
}));
