(function() {
	angular
		.module("UCMASjordan")
		.controller('centerCoursesListController', centerCoursesListController);

	function centerCoursesListController(coursesService, $location, loggedCenter, userService) {
		var model = this;

		function init() {
			model.loggedCenter = loggedCenter;
			// var centerName = loggedCenter.name;
			// var loggedCenterId = loggedCenter._id;
			// model.centerName = centerName;
			// model.centerId = loggedCenterId;
			coursesService
				.findCoursesByCenterId(loggedCenter._id)
				.then(function(courses){
					model.coursesList = courses;
				});

			
			// userService
			// 		.checkUserLogin()
			// 		.then(function(result){
			// 			if(result){
			// 				model.loggedUser = result;
			// 			}
			// 		});

		}
		init();

		model.removeCourse = removeCourse;
		model.logout = logout;
		model.reCreateCourse = reCreateCourse;
		// model.findUserByCourseId = findUserByCourseId

		// function findUserByCourseId(courseId){
		// 	console.log(courseId);
		// }

		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}


		function removeCourse(centerId, courseId){
			//var centerId = $rootScope.loggedCenter._id;
			coursesService.removeCourse(centerId, courseId)
				.then(function(deleted){
					var url = "/centerProfile";
					$location.url(url);
				});
		}

		function reCreateCourse(course){
			
			var unnecessaryProperties = ['created', 'courseDays', 'registeredMembers', 'discountedMembers', 'expenses', '_id', 'startingDate', 'expiryDate', 'centerId', 'special', '__v', 'approved', '$$hashKey'];
			for(var i in unnecessaryProperties){
				delete(course[unnecessaryProperties[i]]);
			}
			console.log(course);
		}


	}
})();