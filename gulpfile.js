'use strict';

let gulp = require('gulp');
let webpack = require('webpack');
let gutil = require('gulp-util');
let webpackConf = require('./config/webpack-default');
let webpackDevConf = require('./config/webpack-dev');
let src = process.cwd() + '/src';
let dist = process.cwd() + '/dist';

// jshint
gulp.task('jshint', () => {
  let jshint = require('gulp-jshint');
  let stylish = require('jshint-stylish');
  return gulp.src([
      '!' + src + '/scripts/lib/**/*.js',
      src + '/scripts/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// clean dist
gulp.task('clean', ['jshint'], () => {
  let rimraf = require('gulp-rimraf');
  return gulp.src(dist, { read: true }).pipe(rimraf());
});

// webpack
gulp.task('webpack', ['clean'], (done) => {
  webpack(webpackConf, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({ colors: true }));
    done();
  });
});

// html process
gulp.task('default', ['webpack'], () => {
  let replace = require('gulp-replace');
  let htmlmin = require('gulp-htmlmin');
  return gulp
    .src(dist + '/*.html')
    // .pipe(htmlmin({
    //   collapseWhitespace: true,
    //   removeComments: true
    // }))
    .pipe(gulp.dest(dist));
});

// deploy dist to remote server
gulp.task('deploy', () => {
  let sftp = require('gulp-sftp');
  return gulp.src(dist + '/**')
    .pipe(sftp({
      host: '[remote server ip]',
      remotePath: '/www/***/',
      user: '',
      pass: ''
    }));
});