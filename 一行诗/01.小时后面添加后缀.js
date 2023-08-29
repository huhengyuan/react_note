var suffixAmPmTS = function (h) { return "".concat(h % 12 === 0 ? 12 : h % 12).concat(h < 12 ? 'am' : 'pm'); };
console.log(suffixAmPmTS(12));
