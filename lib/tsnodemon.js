var spawn = require('child_process').spawn;

function now() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var secondes = date.getSeconds();

  return [hours, minutes, secondes]
    .map(n => (n < 10 ? '0' : '') + n.toString())
    .join(':');
}

/**
 * Start nodejs app
 *
 * @param {string} script
 * @param {string[]} args
 * @returns {object}
 */
function start(script, args) {
  var node = spawn('node', [script].concat(args));

  node.stdout.on('data', function(data) {
    process.stdout.write(data.toString());
  });

  node.stderr.on('data', function(data) {
    process.stdout.write(data.toString());
  });

  return node;
}

/**
 * Stop nodejs app
 *
 * @param {object} node
 * @returns {object}
 */
function stop(node) {
  if (node) {
    node.stdin.pause();
    node.kill();
  }

  return node;
}

/**
 * Restart nodejs app
 *
 * @param {object} node
 * @param {string} script
 * @param {string[]} args
 * @returns {object}
 */
function restart(node, script, args) {
  stop(node);

  return start(script, args);
}

/**
 * Compile typescript and start nodejs app
 *
 * @param {string} tsc
 * @param {string} script
 * @param {string[]} args
 * @param {boolean} noWatch
 */
function compileAndStart(tsc, script, args, noWatch) {
  var node;
  process.stdout.write(now() + ' - Starting compilation...\n');

  spawn('node', [tsc, noWatch ? '' : '--watch']).stdout.on('data', function(data) {
    var msg = data.toString();
    process.stdout.write(msg);

    if (msg.indexOf('Compilation complete') !== -1) {
      process.stdout.write(now() + ' - ' + (node ? 'Restarting' : 'Starting') + '...\n');

      if (node) {
        stop(node);
      }

      node = start(script, args);
    }
  });
}

module.exports = {
  start: start,
  stop: stop,
  restart: restart,
  compileAndStart: compileAndStart
};
