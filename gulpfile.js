var gulp = require('gulp');
var babel = require('gulp-babel');
var src_dir = './js/**/*.js'
gulp.task('default', function () {
  return gulp.src(src_dir)
    .pipe(babel())
    .pipe(gulp.dest('./out'));
});
gulp.task('watch', function(){
    gulp.watch(src_dir, ['default']);
});
