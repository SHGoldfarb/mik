// returns unique elements in array

const uniques = array =>
  array.filter((value, index) => array.indexOf(value) === index);

export default uniques;
