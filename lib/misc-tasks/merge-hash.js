module.exports = function(base) {
  var args = Array.prototype.slice.apply(arguments);
  for(var i = 1; i < args.length; i++) {
    if(args[i] instanceof Object) {
      Object.keys(args[i]).forEach(function(key) {
        base[key] = args[i][key];
      });
    }
  }
  return base;
}
