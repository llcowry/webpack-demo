'use strict';

let fs = require('fs');
let render = require('koa-ejs');
let proxy = require('koa-proxy');

module.exports = (router, app, staticDir) => {
  render(app, {
    root: __dirname,
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
  });
  router.get('/', function*() {
    var pages = fs.readdirSync(staticDir);
    pages = pages.filter(function(page) {
      return /\.html$/.test(page);
    });
    yield this.render('index', {
      pages: pages || []
    });
  });
  // mock api
  router.get('/api/list', function*() {
    var list = require('../data/list');
    var query = this.query || {};
    var offset = query.offset || 0;
    var limit = query.limit || 10;
    var diff = limit - list.length;
    if (diff <= 0) {
      this.body = {
        code: 0,
        data: list.slice(0, limit)
      };
    } else {
      var arr = list.slice(0, list.length);
      var i = 0;
      while (diff--) arr.push(arr[i++]);
      this.body = {
        code: 0,
        data: arr
      };
    }
  });
  // proxy api
  router.get('/api/proxy', proxy({
    url: '[api url]'
  }));
}