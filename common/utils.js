// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Add space in front of numbers < 10
export function spacePad(i) {
  if (i < 10) {
    i = " " + i;
  }
  return i;
}

// Format 24h time to 12h if needed
export function formatDate(hh, clock, str) {
  var dd = "AM";
  var h = hh;
  if(clock == "12h") {
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    str = dd;
  }
  return {hour: h, str: str};
}


// Distance unit conversion from meters to km or miles
export function distanceRounded(dist, unit) {
  let distVal = dist / 1000;  // meters to km
  if(unit == "us")
    distVal *= 0.621371;  // km to miles
  let str = distVal.toString();
  str = decimalAdjust("round", distVal, -3).toString();
  if(str.length > 5)
    str = decimalAdjust("round", distVal, -2).toString();
  if(str.length > 5)
    str = decimalAdjust("round", distVal, -1).toString();
  if(str.length > 5)
    str = decimalAdjust("round", distVal, 0).toString();
  return str;
}

  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
