var gulp = require('gulp');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('minify-js', function () {    
  return gulp.src(['src/scripts/*.js'])
      .pipe(uglify())
      .pipe(rename('soccer.min.js'))
      .pipe(gulp.dest('docs/'))
      .pipe(gulp.dest('dist/scripts'));
});

gulp.task('minify-css', function () {    
  return gulp.src(['src/styles/*.css'])
      .pipe(cleanCss())
      .pipe(rename('soccer.min.css'))
      .pipe(gulp.dest('docs/'))
      .pipe(gulp.dest('dist/styles'));
});

gulp.task('default', gulp.series('minify-js', 'minify-css'));