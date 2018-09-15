(function() {
	angular
		.module("ucmasJordan")
		.controller('userProfileController', userProfileController);

	function userProfileController(userService, loggedUser, $location, $sce, $route) {
		var model = this;

		function init() {
			model.userProfile = loggedUser;
			model.loggedUser = loggedUser;
			model.upcommingProgram = [];
			model.userFeedbacks = [];
			model.registeredCoursesList = model.userProfile.registeredCoursesList;
			// get the upcomming daily program item
			for(var i in model.userProfile.registeredCoursesList){
				inner: 
				for(var e in model.userProfile.registeredCoursesList[i].programDailyDetails){
					if(new Date(e) >= new Date()){
						// var upcome = {}
						model.upcommingProgram.push({course: model.userProfile.registeredCoursesList[i].name, 
													 date: new Date(e),
													 programDetails: model.userProfile.registeredCoursesList[i].programDailyDetails[e]});
						break inner;
					}
				}
			}
			for(var j in model.userProfile.userCourseParameters){
				for(var f in model.userProfile.userCourseParameters[j].feedbacks){
					model.userFeedbacks.push(model.userProfile.userCourseParameters[j].feedbacks[f]);
				}
			}
		}
		init();


		model.logout = logout;
		model.removeRegisteredCourse = removeRegisteredCourse;
		model.totalPayments = totalPayments;
		model.attendedDays = attendedDays;
		model.trustedUrl = trustedUrl;
		model.submitFeedback = submitFeedback;

		function submitFeedback(courseId, courseName,feedbackText){
			var feedbackObject = {userId: model.loggedUser._id, courseId: courseId, courseName: courseName, feedbackText: feedbackText};
			userService
				.submitFeedback(feedbackObject)
				.then(function(result){
					console.log(result.data);
					$route.reload();
				}, function(error){
					console.log(error);
				});
		}


		function trustedUrl(videoLink){
			var youtubeUrl = "https://www.youtube.com/embed/";
			var urlParts = videoLink.split("/");
			youtubeUrl += urlParts[urlParts.length-1];
			return $sce.trustAsResourceUrl(youtubeUrl);
		}

		function attendedDays(courseId){
			var attended = 0;
			var missed = 0;
			for(var i in loggedUser.attendedCourses){
				if(courseId === loggedUser.attendedCourses[i].courseId && loggedUser.attendedCourses[i].attended===true){
					attended+=1;
				} else if(courseId === loggedUser.attendedCourses[i].courseId && loggedUser.attendedCourses[i].attended===false){
					missed+=1;
				}
			}
			return {attended: attended, missed: missed};
		}
	


		function totalPayments(courseId, coursePrice){
			var totals = 0;
			var balance = 0;
			for(var i in loggedUser.payments){
				if(courseId === loggedUser.payments[i].courseId){
					totals+= JSON.parse(loggedUser.payments[i].paymentAmount)
				}
			}
			balance = totals - coursePrice
			return {totals: totals, balance: balance};
		}

		function ValidateSize(file) {
	        		var FileSize = file.files[0].size / 1024 / 1024; // in MB
	        		if (FileSize > 2) {
	            		alert('File size exceeds 2 MB');
	           // $(file).val(''); //for clearing with Jquery
	        		} else {
	        			alert(file.files[0].size);
	        		}
    			}




		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		function removeRegisteredCourse(courseId){
			// var _userId = $routeParams.userId;
			userService
				.removeRegisteredCourse(loggedUser._id, courseId)
				.then(function(response){
					$location.url('/profile');
				});
		}

	}
})();