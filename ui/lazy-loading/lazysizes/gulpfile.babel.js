import babelify          from 'babelify';
import browserify        from 'browserify';
import gulp              from 'gulp';
import gulpCleanCss      from 'gulp-clean-css';
import gulpHtmlmin       from 'gulp-htmlmin';
import gulpImagemin      from 'gulp-imagemin';
import gulpPostcss       from 'gulp-postcss';
import gulpSourcemaps    from 'gulp-sourcemaps';
import gulpUglify        from 'gulp-uglify';
import gulpWebp          from 'gulp-webp';
import postcssCssnext    from 'postcss-cssnext';
import postcssImport     from 'postcss-import';
import stylelint         from 'stylelint';
import vinylBuffer       from 'vinyl-buffer';
import vinylSourceStream from 'vinyl-source-stream';

const dirs = {
  source: './source',
  dest  : './dist'
};

gulp.task('css', () => {
  return gulp.src(`${dirs.source}/assets/css/style.css`)
    .pipe(gulpSourcemaps.init())
    .pipe(gulpPostcss([
      postcssImport(),
      postcssCssnext({
        features: {
          rem: false
        }
      })
    ]))
    .pipe(gulpCleanCss())
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest(`${dirs.dest}/assets/css`));
});

gulp.task('html', () => {
  return gulp.src(`${dirs.source}/**/*.html`)
    .pipe(gulpHtmlmin({
      caseSensitive                : true,
      collapseBooleanAttributes    : true,
      collapseWhitespace           : true,
      minifyCSS                    : true,
      minifyJS                     : true,
      minifyURLs                   : true,
      removeAttributeQuotes        : true,
      removeCDATASectionsFromCDATA : true,
      removeComments               : true,
      removeCommentsFromCDATA      : true,
      removeEmptyAttributes        : true,
      removeOptionalTags           : true,
      removeRedundantAttributes    : true,
      removeScriptTypeAttributes   : true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype              : true
    }))
    .pipe(gulp.dest(`${dirs.dest}`));
});

gulp.task('images:content', () => {
  return gulp.src(`${dirs.source}/content/images/**/*.{gif,ico,jpg,jpeg,png}`)
    .pipe(gulpImagemin())
    .pipe(gulp.dest(`${dirs.dest}/content/images`));
});

gulp.task('images:webp', () => {
  return gulp.src(`${dirs.source}/content/images/**/*.{gif,ico,jpg,jpeg,png}`)
    .pipe(gulpWebp())
    .pipe(gulp.dest(`${dirs.dest}/content/images`));
});

gulp.task('js', () => {
  const b = browserify({
    entries: `${dirs.source}/assets/js/script.js`,
    transform: [babelify]
  });

  return b.bundle()
    .pipe(vinylSourceStream('script.js'))
    .pipe(vinylBuffer())
    .pipe(gulpSourcemaps.init())
    .pipe(gulpUglify())
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest(`${dirs.dest}/assets/js`));
});

gulp.task('lint:css', () => {
  return gulp.src(`${dirs.source}/assets/css/**/*.css`)
    .pipe(gulpPostcss([
      stylelint()
    ]));
})

gulp.task('watch', () => {
  gulp.watch(`${dirs.source}/**/*.html`, ['html']);
  gulp.watch(`${dirs.source}/assets/css/**/*.css`, ['lint:css', 'css']);
  gulp.watch(`${dirs.source}/assets/js/**/*.js`, ['js']);
  gulp.watch(`${dirs.source}/content/images/**/*.{gif,ico,jpg,jpeg,png}`, ['images']);
});

gulp.task('default', [
  'lint',
  'css',
  'html',
  'js',
  'images',
  'watch'
]);

gulp.task('lint', [
  'lint:css'
]);

gulp.task('images', [
  'images:content',
  'images:webp'
]);

gulp.task('build', [
  'lint',
  'css',
  'html',
  'images',
  'js'
]);
