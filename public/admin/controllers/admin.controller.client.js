(function() {
	angular
		.module("ucmasJordan")
		.controller('adminController', adminController);

	function adminController(userService, coursesService, loggedAdmin, $location) {
		var model = this;

		function init() {
			model.loggedAdmin = loggedAdmin;
			model.adminPage = loggedAdmin;
			model.users = null;
			model.courses = null;
		}
		init();

		model.logout = logout;
		model.getAllUsers = getAllUsers;
		model.getallCourses = getallCourses;
		model.updateCourseByAdmin = updateCourseByAdmin;
		model.getAllFeedbacks = getAllFeedbacks;
		model.updateFeedbackByAdmin = updateFeedbackByAdmin;

		function updateFeedbackByAdmin(feedback){
			userService
				.updateFeedbackByAdmin(feedback)
				.then(getAllFeedbacks);
		}

		function getAllFeedbacks(){
			userService
				.getAllFeedbacks()
				.then(function(feedbacks){
					model.feedbacks = feedbacks.data;
				});
		}

		function getAllUsers(){
			model.courses = null;
			return userService
				.getAllUsers()
				.then(function (users){
					if(users){
						model.users = users.data;
					}
				});
		}

		function getallCourses(){
			model.users = null;
			coursesService
					.getallCourses()
					.then(function(courses){
						if(courses){
							model.courses = courses;	
						}
					});
		}

		function updateCourseByAdmin(course){
			coursesService
					.updateCourseByAdmin(course)
					.then(getallCourses);
		}



		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}

	}
})();