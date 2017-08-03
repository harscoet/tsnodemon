var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var util = require('./util');

/**
 * Start app
 */
function start(execCmd, execArgs) {
  var childProcess = spawn(execCmd, execArgs);

  childProcess.stdout.on('data', function(data) {
    process.stdout.write(data.toString());
  });

  childProcess.stderr.on('data', function(data) {
    process.stdout.write(data.toString());
  });

  return childProcess;
}

/**
 * Stop app
 */
function stop(childProcess) {
  if (childProcess) {
    childProcess.stdin.pause();
    childProcess.kill();
  }

  return childProcess;
}

/**
 * Restart app
 */
function restart(childProcess, execCmd, execArgs) {
  stop(childProcess);

  return start(execCmd, execArgs);
}

/**
 * Compile typescript and start app
 */
function compileAndStart(tscArgs, execCmd, execArgs) {
  var childProcess;
  var relativeTscPath = path.resolve(process.cwd(), 'node_modules/typescript/lib/tsc.js');
  var tscPath = fs.existsSync(relativeTscPath) ? relativeTscPath : 'tsc';

  process.stdout.write(util.now() + ' - Starting compilation...\n');

  spawn('node', [tscPath].concat(tscArgs)).stdout.on('data', function(data) {
    var msg = data.toString();
    process.stdout.write(msg);

    if (msg.indexOf('Compilation complete') !== -1) {
      var execStr = execCmd + ' ' + execArgs.join(' ');
      var log = util.now() + ' - ' + (childProcess ? 'Restarting' : 'Starting') + ': ' + execStr + '...\n';
      process.stdout.write(log);

      if (childProcess) {
        stop(childProcess);
      }

      childProcess = start(execCmd, execArgs);
    }
  });
}

module.exports = {
  start: start,
  stop: stop,
  restart: restart,
  compileAndStart: compileAndStart,
};
