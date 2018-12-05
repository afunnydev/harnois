const gulp = require('gulp');
const imagemin = require("gulp-imagemin");
const imageresize = require('gulp-image-resize');
const parallel = require("concurrent-transform");
var runSequence = require('run-sequence');
var del = require('del');
var exec = require('child_process').exec;
var newer = require('gulp-newer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

// image resizing variables
const imagexl = 2620;
const imagefull = 1920;
const imagehalf = 1024;
const imagequart = 600;
const imagethumb = 80;
const imageload = 20;
const jsFiles = [
                  'themes/beauharnois/assets/js/theme/jquery.min.js',
                  'themes/beauharnois/assets/js/theme/plugins.js',
                  'themes/beauharnois/assets/js/theme/tether.min.js',
                  'themes/beauharnois/assets/js/theme/bootstrap.min.js',
                  'themes/beauharnois/assets/js/theme/animsition.js',
                  'themes/beauharnois/assets/js/theme/owl.carousel.min.js',
                  'themes/beauharnois/assets/js/theme/countto.js',
                  'themes/beauharnois/assets/js/theme/equalize.min.js',
                  'themes/beauharnois/assets/js/theme/jquery.isotope.min.js',
                  'themes/beauharnois/assets/js/theme/owl.carousel2.thumbs.js',
                  'themes/beauharnois/assets/js/theme/jquery.cookie.js',
                  'themes/beauharnois/assets/js/theme/gmap3.min.js',
                  'themes/beauharnois/assets/js/theme/shortcodes.js',
                  'themes/beauharnois/assets/js/theme/jquery-validate.js',
                  'themes/beauharnois/assets/js/theme/main.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/jquery.themepunch.tools.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/jquery.themepunch.revolution.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/extensions/revolution.extension.actions.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/extensions/revolution.extension.carousel.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/extensions/revolution.extension.kenburn.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/extensions/revolution.extension.layeranimation.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/extensions/revolution.extension.migration.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/extensions/revolution.extension.navigation.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/extensions/revolution.extension.parallax.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/extensions/revolution.extension.slideanims.min.js',
                  'themes/beauharnois/assets/js/theme/rev-slider/extensions/revolution.extension.video.min.js',
                  'themes/beauharnois/assets/js/vendor/bites.js',
                  'themes/beauharnois/assets/js/main.js'
                ];

const jsSimple = [
                  'themes/beauharnois/assets/js/theme/jquery.min.js',
                  'themes/beauharnois/assets/js/theme/plugins.js',
                  'themes/beauharnois/assets/js/theme/tether.min.js',
                  'themes/beauharnois/assets/js/theme/bootstrap.min.js',
                  'themes/beauharnois/assets/js/theme/animsition.js',
                  'themes/beauharnois/assets/js/theme/owl.carousel.min.js',
                  'themes/beauharnois/assets/js/theme/countto.js',
                  'themes/beauharnois/assets/js/theme/equalize.min.js',
                  'themes/beauharnois/assets/js/theme/jquery.isotope.min.js',
                  'themes/beauharnois/assets/js/theme/owl.carousel2.thumbs.js',
                  'themes/beauharnois/assets/js/theme/jquery.cookie.js',
                  'themes/beauharnois/assets/js/theme/gmap3.min.js',
                  'themes/beauharnois/assets/js/theme/shortcodes.js',
                  'themes/beauharnois/assets/js/theme/jquery-validate.js',
                  'themes/beauharnois/assets/js/theme/main.js',
                  'themes/beauharnois/assets/js/vendor/bites.js',
                  'themes/beauharnois/assets/js/main.js'
                ];
const jsDest = 'themes/beauharnois/static/js';

 
// resize and optimize images
gulp.task("image-resize", () => {
  return gulp.src("themes/beauharnois/source-images/*.{jpg,png,jpeg,JPG}")
    .pipe(newer("themes/beauharnois/static/img"))
    .pipe(imagemin())
    .pipe(imageresize({ width: imagexl}))
    .pipe(gulp.dest("themes/beauharnois/static/xl/img"))
    .pipe(imageresize({ width: imagefull }))
    .pipe(gulp.dest("themes/beauharnois/static/img"))
    .pipe(imageresize({ width: imagehalf }))
    .pipe(gulp.dest("themes/beauharnois/static/half/img"))
    .pipe(imageresize({ width: imagequart }))
    .pipe(gulp.dest("themes/beauharnois/static/quart/img"))
    .pipe(imageresize({ width: imagethumb }))
    .pipe(gulp.dest("themes/beauharnois/static/thumb/img"))
    .pipe(imageresize({ width: imageload }))
    .pipe(gulp.dest("themes/beauharnois/static/load/img"));
});

// hugo production call
gulp.task("hugo", function (cb) {
  exec('hugo --cleanDestinationDir', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('sass', function () {
  return gulp.src('themes/beauharnois/assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('themes/beauharnois/static/css'));
});

gulp.task('scripts-normal', function() {
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts-simple', function() {
    return gulp.src(jsSimple)
        // .pipe(sourcemaps.init())
        .pipe(concat('main-simple.min.js'))
        .pipe(uglify())
        // .pipe(sourcemaps.write(jsDest))
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts', ['scripts-normal', 'scripts-simple']);

// watching
gulp.task("watch", function() {

  // browserSync.init({
  //     proxy: "http://localhost:1313/"
  // });

  gulp.watch('themes/beauharnois/source-images/*.{jpg,png,jpeg,gif}', ['image-resize'] );
  gulp.watch('themes/beauharnois/assets/scss/**/*.scss', ['sass']);
  gulp.watch('themes/beauharnois/assets/js/**/*.js', ['scripts']);
});

// watching images and resizing
gulp.task("dev",  function(callback) {
  runSequence('image-resize',
              'watch');
});

// optimizing images and calling hugo for production
gulp.task("prod",  function(callback) {
  runSequence('image-resize',
              'hugo');
});
