// This task calculates the longest common substring among the file paths
module.exports = function(list) {
  var index = 0,
      first = list.files[0];

  if(!first) return;

  while(list.files.every(function(obj) {
    return (obj.name.charAt(index) == first.name.charAt(index));
  }) && index < first.name.length) {
    index++;
  }

  list.basepath = first.name.substr(0, index);
};
