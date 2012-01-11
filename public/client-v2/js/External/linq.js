function select(array, action) {
  var result = [];
  for (var item in array) {
    result.push(action(array[item]));
  }
  return result;
}
exports.select = select;