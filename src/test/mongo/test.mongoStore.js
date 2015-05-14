require('babel/polyfill');

var Domain = require("../../lib/Domain");
var Actor = require("../../lib/Actor");
var should = require("should");

var domain = new Domain({ type: 'mongodb', host: '127.0.0.1' });
