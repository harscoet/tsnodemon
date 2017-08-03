function now() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var secondes = date.getSeconds();

  return [hours, minutes, secondes]
    .map(n => (n < 10 ? '0' : '') + n.toString())
    .join(':');
}

module.exports = {
  now: now,
};
