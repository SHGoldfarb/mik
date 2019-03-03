// Recieves an array with nested arrays, returns a flat array
// e.g. flatten([1, 2, [3, [4, 5, 6], [7, 8, 9]], 10, 11]) = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

const flatten = variable =>
  variable.constructor === Array
    ? variable.reduce((acc, toFlat) => acc.concat(flatten(toFlat)), [])
    : [variable];

export default flatten;
