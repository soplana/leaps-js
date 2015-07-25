var gulp    = require('gulp'),
    babel   = require('gulp-babel'),
    include = require('gulp-include');

var src_dir = './es6/**/*.js'

gulp.task('default', function () {
  return gulp.src(src_dir)
    .pipe(include())
    .pipe(babel())
    .pipe(gulp.dest('./src'));
});
gulp.task('watch', function(){
    gulp.watch(src_dir, ['default']);
});
