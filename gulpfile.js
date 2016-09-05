// Taken from tutorial at browsersync.io

var gulp          = require('gulp');
var browserSync   = require('browser-sync').create();
var sass          = require('gulp-sass');
var minifyCss     = require('gulp-minify-css');
var rename        = require('gulp-rename');
var twig          = require('gulp-twig');
var prettify      = require('gulp-prettify');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var data          = require('gulp-data');
var fs            = require('fs');
var path          = require('path');
var twigMarkdown  = require('twig-markdown');
var jsoncombine   = require("gulp-jsoncombine");
var prettyUrl     = require("gulp-pretty-url");

/**
 * Support Functions and Data
 */

var PUBLISHED_DIR = "published/"

/**
 * Gets data from global JSON file.
 */

function getGlobalJsonData(file) {
  return getFile('src/data/global.json');
}

/**
 * Gets data from JSON, depending on file path
 */
function getJsonData(file) {
  return getFile('src/data/' + path.basename(file.path) + '.json');
}

/**
 * Gets data from a filepath
 */
function getFile(path) {
  return JSON.parse(fs.readFileSync(path));
}

/**
 * Returns list of all values in dictionary.
 */
function values(dictionary) {
  list = [];
  for (var key in dictionary) {
    list.push(dictionary[key]);
  }
  return list;
}

/**
 * Returns slide.text_<size> and defaults to
 * slide.text otherwise.
 */
function getText(slide, attr) {
  if (attr in slide) {
   return slide[attr];
  }
  return slide.text;
}

/**
 * Computes the minimum of a list.
 */
function min(values) {
  smallest = values[0];
  for (var i=0; i < values.length; i++) {
    value = values[i];
    if (value < smallest) {
      smallest = value;
    }
  }
  return smallest;
}

function range(cap) {
    var i = 0;
    var numbers = [];
    while (i < cap) {
        numbers.push(i);
        i += 1;
    }
    return numbers;
}

// Define functions to use in Twig templates
twigFunctions = [
  {
    name: "getText",
    func: getText
  },
  {
    name: "values",
    func: values
  },
  {
    name: "min",
    func: min
  },
  {
    name: "range",
    func: range
  }
];

// Generate twig objects
function twigGenerator() {
  return twig({
    extend: twigMarkdown,
    functions: twigFunctions
  });
}

/**
 * Server, Gulp-specific Functions
 */

// Static Server + watching scss/html files
gulp.task('serve', ['preview'], function() {

  browserSync.init({
    server: "./" + PUBLISHED_DIR,
  });

  gulp.watch("src/data/global/*.json", ['global_json']);
  gulp.watch("src/static/**/*.*", ['copy']);
  gulp.watch("src/scss/**/*.scss", ['sass']);
  gulp.watch("src/js/**/*.js", ['js']);
  gulp.watch(["src/html/**/*.html", "src/data/*.json"], ['html'])
      .on('change', browserSync.reload);
});

gulp.task('preview',
          ['global_json', 'js', 'sass', 'html', 'copy', 'CNAME',
          'gitignore']);

gulp.task('copy', function() {
  return gulp.src("src/static/**/*.*", {base: "src"})
    .pipe(gulp.dest(PUBLISHED_DIR))
});

gulp.task('CNAME', function() {
    return gulp.src('CNAME').pipe(gulp.dest(PUBLISHED_DIR));
});

gulp.task('gitignore', function() {
    return gulp.src('.gitignore').pipe(gulp.dest(PUBLISHED_DIR));
});

// Compile sass into minified CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("src/scss/*.scss")
    .pipe(sass())
    .pipe(minifyCss({compatibility: 'ie8', keepBreaks: false}))
    .pipe(rename({suffix: '.min' }))
    .pipe(gulp.dest(PUBLISHED_DIR + "css"))
    .pipe(browserSync.stream());
});

// Compile Twig templates to HTML
gulp.task('html', function() {
  return gulp.src('src/html/*.html')
    .pipe(data(getGlobalJsonData))
    .pipe(data(getJsonData))
    .pipe(twigGenerator())
    .pipe(prettyUrl())
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest(PUBLISHED_DIR));
});

// Compile into minified JS & auto-inject into browsers
gulp.task('js', function() {
  return gulp.src("src/js/**/*.js")
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(PUBLISHED_DIR + "js"))
    .pipe(browserSync.stream());
});

// Combine all global JSON files into one.
gulp.task('global_json', function() {
  return gulp.src('src/data/global/*.json')
    .pipe(jsoncombine("global.json", function(data){
      return new Buffer(JSON.stringify(data));
    }))
    .pipe(gulp.dest('src/data'));
});

gulp.task('default', ['serve']);
