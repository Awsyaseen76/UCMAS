(function(){
	angular
		.module("ucmasJordan")
		.controller('courseDetailsController', courseDetailsController);

		function courseDetailsController($routeParams, coursesService, userService, $location){
			var model = this;

			function init(){
				model.error2 = null;
				var courseId = $routeParams.courseId;
				// var courseDetails = coursesService.findCourseByCourseId(courseId);
				coursesService.findCourseByCourseId(courseId)
					.then(function(courseDetails){
						model.courseDetails = courseDetails;
					});
				// check if there any user has already logged in to use it instead of the $rootScope
				userService
					.checkUserLogin()
					.then(function(result){
						if(result){
							model.loggedUser = result;
						}
					});

				
			}
			init();

			model.courseRegistration = courseRegistration;
			model.logout = logout;

			function logout(){
				userService
					.logout()
					.then(function(){
						$location.url('/');
					});
			}



			function courseRegistration(course){
				if (!model.loggedUser){
					model.error1 = 'Please login or register to register on this course';
					$('html, body').animate({ scrollTop: 0 }, 'slow');
					return;
				} else {
					var userId = model.loggedUser._id;
					var coursesList = model.loggedUser.registeredCoursesList;
					for(var e in coursesList){
						if(coursesList[e]._id === course._id){
							model.error2 = 'You already registered for this course';
							return;
						}
					}
					userService
						.addCourseToUserCoursesList(course)
						.then(function (response){
						$location.url('/userProfile');
					});
				}
			}

		}

})();