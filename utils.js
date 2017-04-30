exports.formatPosition = number => {
  let strNumber = number.toString();
  switch (strNumber.slice(-1)) {
    case '1':
      return strNumber += 'st';
    case '2':
      return strNumber += 'nd';
    case '3':
      return strNumber += 'rd';
    default:
      return strNumber += 'th';
  }
}