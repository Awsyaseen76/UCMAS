(function(){
	angular
		.module("ucmasJordan")
		.controller('homePageController', homePageController);

	// function homePageController(userService, $location, coursesService, $route, $interval){
	function homePageController(){
		var model = this;
		model.test = 'hello from the controller';
		// model.logout = logout;
		// model.getAllFeedbacks = getAllFeedbacks;

		// function init(){
		// 	userService
		// 		.checkUserLogin()
		// 		.then(function(result){
		// 			if(result){
		// 				model.loggedUser = result;
		// 				return;
		// 			}else{
		// 				model.loggedUser = null;
		// 				return;
		// 			}
		// 		});

		// 	coursesService
		// 		.getallCourses()
		// 		.then(function(courses){
		// 			model.coursesList = courses;
		// 			if(courses){
		// 				getTheFeedbacks();
		// 				for(var course in courses){
		// 					if(courses[course].special){
		// 						model.specialCourse = courses[course];
		// 						return;
		// 					}
		// 				}
		// 			}		
		// 		});

		// 	function getTheFeedbacks(){
		// 		userService
		// 			.getAllFeedbacks()
		// 			.then(function(result){
		// 				model.feedbacks = result.data;	
						
		// 				// autoscroll feedbacks
		// 				if(model.feedbacks){
		// 					$(document).ready(function() {
		// 						start();
		// 						function animateContent() {  
		// 							var containerHeight = $('.feedbackContainer').height();
		// 							var contentHeight = $('.feedbackContent').height();
		// 							if(contentHeight <= containerHeight){
		// 								contentHeight = containerHeight * 1.5;
		// 							}
		// 						    var animationOffset = containerHeight - contentHeight - 30;
		// 						    $('.feedbackContent').animate({ "marginTop": (animationOffset)+ "px" }, model.feedbacks.length*5000);
		// 						    $('.feedbackContent').animate({ "marginTop": "0px" }, 500, start());
		// 						}

		// 						function start(){
		// 							setTimeout(function () {
		// 						    	animateContent();
		// 							}, 500);
		// 						}  
		// 					});
		// 				}
		// 			});
		// 	}
			

		// 	// This make the carousel works and set the sliding time
		// 	$(document).ready(function() {
		// 		$('.carousel').carousel({
		// 			interval: 3000
		// 		});  
	 //        });
		// }

		// init();

		// function getAllFeedbacks(){
		// 	userService
		// 		.getAllFeedbacks()
		// 		.then(function(result){
		// 		});

		// }

		// function logout(){
		// 	userService
		// 		.logout()
		// 		.then(function(){
		// 			$location.url('/');
		// 			$route.reload();
		// 		});
		// }


	}
})();