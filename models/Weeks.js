var mongoose = require('mongoose');

var WeekSchema = new mongoose.Schema({
	week: Number,
	progress: Number,
	tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

mongoose.model('Week', WeekSchema);