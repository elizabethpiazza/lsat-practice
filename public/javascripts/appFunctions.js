var now = new Date();
var test = new Date(2015, 5, 28);

function weeksLeft (date1, date2) {
	var result = (date1.getTime() - date2.getTime()) / 604800000;
	return Math.trunc(result);
};