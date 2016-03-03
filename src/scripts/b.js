'use strict';

console.info('require page b.');

require('commonCss');
require('../scss/b.scss');
require('zepto');

var _ = require('lodash');
var report = require('./helpers/report');
