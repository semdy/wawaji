var gulp         = require('gulp'),
  eventstream  = require('event-stream'),
  cssmin       = require('gulp-minify-css'),
  uglify       = require('gulp-uglify'),
  sass         = require('gulp-sass'),
  minifyInline = require('gulp-minify-inline'),
  htmlmin      = require('gulp-htmlmin'),
  clean        = require('gulp-clean'),
  cache        = require('gulp-cache'),
  replace      = require('gulp-replace'),
  useref       = require('gulp-useref'),
  gulpif       = require('gulp-if'),
  lazypipe     = require('lazypipe'),
  tinypng      = require('gulp-tinypng'),
  runSequence  = require('gulp-run-sequence'),
  webserver    = require('gulp-webserver'),
  ifaces       = require('os').networkInterfaces(),
  config       = require('./buildConfig.json');

var SITE_CONFIG = require("./appConfig.json");

//编译sass
gulp.task('compile-sass', function(){
  return gulp.src('./styles/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('./styles'));
});

//压缩图片 - tinypng
gulp.task('tinypng', function () {
  return gulp.src('./resource/**/*.{png,jpg,jpeg}')
    .pipe(cache(tinypng(config.tinypngapi)))
    .pipe(gulp.dest('./dist/resource'))
});

//copy files
gulp.task('copy-files', function (done) {
  var tasks = [];

  tasks.push(
    gulp.src(['./resource/**/*.json', './resource/**/*.mp3'])
      .pipe(gulp.dest('./dist/resource'))
  );

  tasks.push(
    gulp.src(['./scripts/config.js'])
      .pipe(gulp.dest('./dist/scripts'))
  );

  eventstream.merge(tasks).on('end', done);
});

var buildHTML = lazypipe()
  .pipe(minifyInline, {
    js: {
      output: {
        comments: false
      }
    },
    jsSelector: 'script[type!="text/template"]',
    css: {
      keepSpecialComments: 1
    },
    cssSelector: 'style[data-minify!="false"]'
  })
  .pipe(replace, /(:\s*url\(['"]?)(\.\.)?([^)]+?)/gm, '$1' + config.revPrefix + config.projectName + '/$3')
  .pipe(replace, /(['"])(css|styles|scripts|resource|images|js)\/([^"]+?)(['"])/gm, '$1' + config.revPrefix + config.projectName + "/" + '$2/$3' + '$4');

var buildJS = lazypipe()
  .pipe(uglify)
  .pipe(replace, /"(css|scripts|images|js)\/([^"]+?)"/gm, '"' + config.revPrefix + config.projectName + "/" + '$1/$2' + '"')
  .pipe(replace, /(url:")([^"]+?)"/gm, '$1' + config.revPrefix + config.projectName + "/resource/assets/" + '$2' + '"');

var buildCSS = lazypipe().pipe(cssmin);

gulp.task('useref', function () {
  return gulp.src('./*.html')
    .pipe(useref())
    .pipe(gulpif('*.html', buildHTML()))
    .pipe(gulpif('*.js', buildJS()))
    .pipe(gulpif('*.css', buildCSS()))
    .pipe(gulp.dest('./dist'))

});

gulp.task('htmlmin', function () {
  return gulp.src('./dist/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))

});

gulp.task('config-replace-dev', function () {
  return gulp.src('./config.js')
    .pipe(replace(/["']@@([\s\S]+?)["']/gm, configApp('dev')))
    .pipe(gulp.dest('./scripts'))

});

gulp.task('config-replace-prod', function () {
  return gulp.src('./config.js')
    .pipe(replace(/["']@@([\s\S]+?)["']/gm, configApp('prod')))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts'))

});

//开启本地 Web 服务器功能
gulp.task('webserver', function() {
  return gulp.src('./')
    .pipe(webserver({
      host             : getIP(),
      port             : 8082,
      livereload       : true,
      open             : true,
      directoryListing : false
    }));
});

gulp.task('watch', function(){
  gulp.watch('./styles/**/*.scss', ['compile-sass']);
  gulp.watch(['./appConfig.json', './config.js'], ['config-replace-dev']);
});

//重新build前删除生产目录
gulp.task('clean', function () {
  return gulp.src('./dist', {read: false})
    .pipe(clean({force: true}));
});

//清理cache
gulp.task('clean-cache', function (done) {
  return cache.clearAll(done);
});

//默认任务
gulp.task('default', ['compile-sass', 'config-replace-dev', 'watch', 'webserver']);

//项目完成提交任务至测试环境
gulp.task('build-dev', function(done) {
  runSequence('clean','useref', 'htmlmin', 'tinypng', 'copy-files', 'config-replace-dev', done);
});

//项目完成提交任务至正式环境
gulp.task('build-production', function(done) {
  runSequence('config-replace-prod', done);
});

function getIP(){
  var ip = 'localhost';
  for (var dev in ifaces) {
    ifaces[dev].every(function(details){
      if (details.family==='IPv4' && details.address!=='127.0.0.1' && !details.internal) {
        ip = details.address;
        return false;
      }
      return true;
    });
  }
  return ip;
}

function configApp(type) {
  return function (match, p, offset, string) {
    var key = SITE_CONFIG[type][p];
    if (typeof key === "string") {
      return '"' + key + '"';
    }
    else if (typeof key === "undefined") {
      return "";
    }
    return key;
  }
}