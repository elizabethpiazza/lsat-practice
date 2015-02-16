var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
	topic: String,
	theme: String,
	description: String,
	book: String,
	link: String,
	type: String,
	status: { type: String, default: 'NS' },
	attempts: { type: Date },
	week: { type: mongoose.Schema.Types.ObjectId, ref: 'Week' }
});

mongoose.model('Task', TaskSchema);