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
				controller: 'MainCtrl',
				resolve: {
					weekPromise: ['weeks', function(weeks){
						return weeks.getWeeks();
					}]
				}
			})
			.state('weeks', {
				url: '/weeks/{id}',
				templateUrl: '/weeks.html',
				controller: 'WeeksCtrl',
				resolve: {
					week: ['$stateParams', 'weeks', function($stateParams, weeks) {
						return weeks.get($stateParams.id);
					}]
				}
			})
			.state('addTasks', {
				url: '/addTasks',
				templateUrl: '/addTasks.html',
				controller: 'AddTasksCtrl',
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
app.controller('MainCtrl', [
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
		$scope.updateTask = function (task) {
			weeks.updateTask(task);
		}
	}
]);

app.controller('AddTasksCtrl', [
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
	}
]);
