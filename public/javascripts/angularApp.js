var app = angular.module('lsatPractice', ['ui.router']);

//angular stuff begins here
app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'HomeCtrl',
				resolve: {
					weekPromise: ['weeks', function(weeks){
						return weeks.getWeeks();
					}]
				}
			})
			.state('week', {
				url: '/weeks/{id}',
				templateUrl: '/week.html',
				controller: 'WeeksCtrl',
				resolve: {
					week: ['$stateParams', 'weeks', function($stateParams, weeks) {
						return weeks.get($stateParams.id);
					}],
					weekPromise: ['weeks', function(weeks){
						return weeks.getWeeks();
					}]
				}
			})
			.state('taskEditor', {
				url: '/taskeditor',
				templateUrl: '/taskeditor.html',
				controller: 'TaskEditorCtrl',
				resolve: {
					weekPromise: ['weeks', function(weeks){
						return weeks.getWeeks();
					}],
					taskPromise: ['weeks', function(weeks){
						return weeks.getTasks();
					}]
				}
			});
		$urlRouterProvider.otherwise('home');
	}
])

app.factory('weeks', ['$http', function($http){
	var o = {
		topics: ['Logic Reasoning', 'Logic Games', 'Reading Comprehension'],
		weeks: [],
		tasks: []
	};
	o.getWeeks = function() {
		return $http.get('/weeks').success(function(data){
			angular.copy(data, o.weeks);
		});
	};
	o.getTasks = function() {
		return $http.get('/tasks').success(function(data){
			angular.copy(data, o.tasks);
		});
	};
	o.get = function (id) {
		return $http.get('/weeks/' + id).then(function(res){
			return res.data;
		});
	};
	o.addTask = function (id, task) {
		return $http.post('/weeks/' + id + '/tasks', task)
		.success(function (data){
			o.tasks.push(data);
		});
	};
	o.addWeek = function (newweek) {
		return $http.post('/weeks', newweek)
		.success(function (data){
			o.weeks.push(data);
		});
	};
	o.delTask = function (id) {
		return $http.delete('/tasks/' + id)
		.success(removeTask(o.tasks, id));
	};
	o.updateTask = function (task) {
		return $http.put('tasks/' + task._id + '/update', task);
	}
	return o;
}]);

//angular controllers here
app.controller('HomeCtrl', [
	'$scope',
	'weeks',
	function ($scope, weeks) {
		$scope.testDate =test.toDateString();
		$scope.timeLeft = weeksLeft(test, now);
		$scope.weeks = weeks.weeks;
	}
]);

app.controller('WeeksCtrl', [
	'$scope',
	'weeks',
	'week',
	function ($scope, weeks, week) {
		$scope.topics = weeks.topics;
		$scope.week = week;
		$scope.changeStatus = function (task) {
			var statusList= ["NS", "IC", "NR", "S"];
			var currStatus = task.status;
			var statIndex = statusList.indexOf(currStatus);
			var newStatus = statusList[(statIndex + 1) % statusList.length];
			task.status = newStatus;
			weeks.updateTask(task);
		}
	}
]);

app.controller('TaskEditorCtrl', [
	'$scope',
	'weeks',
	function ($scope, weeks) {
		$scope.topics = weeks.topics;
		$scope.weeks = weeks.weeks;
		$scope.tasks = weeks.tasks;
		$scope.addTask = function(){
			if ($scope.newTask === {}) { return; }
			weeks.addTask($scope.newTask.week._id, {
				topic : $scope.newTask.topic,
				theme : $scope.newTask.theme,
				description : $scope.newTask.description,
				book : $scope.newTask.book,
				link : $scope.newTask.link,
				type : $scope.newTask.type,
			});
			$scope.newTask = {};
		};
		$scope.delTask = function(id){
			weeks.delTask(id);
		};
		$scope.addWeek = function(){
			if ($scope.newweek === {}) { return; }
			weeks.addWeek($scope.newweek);
			$scope.newweek = {};
		};
	}
]);
