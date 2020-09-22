var MASS_BALL = 0.0164;
var MASS_PEND = 0.1652;
var H1 = 0.135;
var DELTA_H1 = 0.0008;
var g = 9.81;

var first = Math.pow((0.00005 * MASS_PEND * Math.sqrt(2 * g * H1) / Math.pow(MASS_BALL, 2)), 2);
var second = Math.pow((0.00005 * Math.sqrt(2 * g * H1) / MASS_BALL), 2);
var third = Math.pow(((1 + MASS_PEND / MASS_BALL) * (DELTA_H1 * Math.sqrt(2 * g)) / (2 * Math.sqrt(H1))), 2);




var result = Math.sqrt(first + second + third);

console.log(result);