var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Week = mongoose.model('Week');
var Task = mongoose.model('Task');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Study Guide' });
});

router.get('/weeks', function (req, res, next) {
	Week.find( function (err, weeks) {
		if (err) { return next(err); }
		res.json(weeks);
	});
});

router.post('/weeks', function (req, res, next) {
	var week = new Week(req.body);
	week.save(function (err, week) {
		if (err) { return next(err); }
		res.json(week);
	});
});

router.param('week', function (req, res, next, id) {
	var query = Week.findById(id);
	query.exec(function (err, week) {
		if (err) { return next(err); }
		if (!week) { return next(new Error('Sorry, that week doesn\'t exist')); }
		req.week = week;
		return next();
	});
});

router.param('task', function (req, res, next, id) {
	var query = Task.findById(id);
	query.exec(function (err, task) {
		if (err) { return next(err); }
		if (!task) { return next(new Error('Sorry, that task doesn\'t exist')); }
		req.task = task;
		return next();
	});
});

router.get('/weeks/:week', function (req, res) {
	req.week.populate('tasks', function (err, week) {
		if (err) { return next(err); }

		res.json(week);
	});
});

router.get('/tasks/:task', function (req, res) {

		res.json(req.task);
});

router.get('/tasks', function (req, res, next) {
	Task.find( function (err, tasks) {
		if (err) { return next(err); }
		res.json(tasks);
	});
});

router.delete('/tasks/:task', function (req, res) {
	var task = req.task;
	var week = task.week;

	Task.findByIdAndRemove(task, function(err) {
		if (err) {return next(err); }

		Week.update({ tasks: task._id }, { $pull: { tasks: task._id } }, function (err) {
			if (err) {return next(err); }
		});

		res.json({message:"task removed"});
	});
});

router.post('/weeks/:week/tasks', function (req, res, next) {
	var task = new Task(req.body);
	task.week = req.week;

	task.save(function (err, task) {
		if (err) { return next(err); }
		req.week.tasks.push(task);
		req.week.save(function (err, post) {
			if (err) { return next(err); }
			res.json(task);
		});
	});
});

module.exports = router;
