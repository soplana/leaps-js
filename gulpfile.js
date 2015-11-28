var gulp       = require('gulp'),
    gulpBabel  = require('gulp-babel'),
    babel      = require('babelify'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    watchify   = require('watchify');


function compile(watch) {
  var bundler = watchify(
    browserify({
      entries: ['./src/main.js'],
      extensions: ['.js', '.json', '.es6'],
      paths: ['./src']
    }).transform(babel)
  );

  return bundler.bundle()
  .on('error', function(err) { console.error(err); this.emit('end'); })
  .pipe(source('leaps.js'))
  .pipe(gulp.dest('./'))
};

function testCompile(watch) {
  var bundler = watchify(
    browserify({
      entries: ['./src/test/main.js'],
      extensions: ['.js', '.json', '.es6'],
      paths: ['./src/test']
    }).transform(babel)
  );

  return bundler.bundle()
  .on('error', function(err) { console.error(err); this.emit('end'); })
  .pipe(source('test.js'))
  .pipe(gulp.dest('./src/test/'))
};


gulp.task('build', compile);
gulp.task('test',  testCompile);


gulp.task('watch', function(){
  gulp.watch('./src/*.js', ['build']);
  gulp.watch('./src/test/*.js', ['test']);
});
