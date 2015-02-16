var now = new Date();
var test = new Date(2015, 5, 28);

function weeksLeft (date1, date2) {
	var result = (date1.getTime() - date2.getTime()) / 604800000;
	return Math.trunc(result);
};

function removeTask (list, id) {
	for (var i = 0; i < list.length; i++){
		if (list[i]._id === id){
			list.splice(i, 1);
			break;
		}
	}
}