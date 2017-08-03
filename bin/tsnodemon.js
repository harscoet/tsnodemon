#!/usr/bin/env node
var program = require('commander');
var path = require('path');
var fs = require('fs');
var tsnodemon = require('../lib/tsnodemon');

program
  .version('0.1.0')
  .option('-t, --tsc [value]', 'Tsc arguments. Default: --watch)', '--watch')
  .option('-x, --exec [value]', 'Exec command. Default: node ["main" from package.json])')
  .parse(process.argv);

if (typeof program.exec === 'undefined') {
  program.exec = 'node ' + (require(path.resolve(process.cwd(), 'package.json')) || {}).main || 'index.js';
}

var execArr = program.exec.split(' ');
tsnodemon.compileAndStart(program.tsc.split(' '), execArr[0], execArr.slice(1).concat(program.args));
