#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var tsnodemon = require('../lib/tsnodemon');

var userArgs = process.argv.slice(2);
var scriptArg = userArgs[0];
var cwd = process.cwd();
var relativeTsc = path.resolve(cwd, 'node_modules/typescript/lib/tsc.js');
var tsc = fs.existsSync(relativeTsc) ? relativeTsc : 'tsc';
var script;

if (scriptArg) {
  script = path.resolve(cwd, scriptArg);
} else {
  var packageJson = require(path.resolve(cwd, 'package.json')) || {};
  script = packageJson.main;
}

tsnodemon.compileAndStart(tsc, script, userArgs);
