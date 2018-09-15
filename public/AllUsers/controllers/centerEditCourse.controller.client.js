(function () {
	angular
		.module("ucmasJordan")
		.controller('centerEditCourseController', centerEditCourseController);

	function centerEditCourseController(coursesService, $location, loggedCenter, userService){
		var model = this;

		function init(){
			model.updateCourseMain = true;
			model.loggedCenter = loggedCenter;
			coursesService
				.findCoursesByCenterId(loggedCenter._id)
				.then(function(courses){
					model.coursesList = courses;
				});
			model.selectedCourse = null;

			// userService
			// 		.checkUserLogin()
			// 		.then(function(result){
			// 			if(result){
			// 				model.loggedUser = result;
			// 			}
			// 		});
		}
		init();

		model.updateCourse = updateCourse;
		model.selectCourse = selectCourse;
		model.logout = logout;
		model.updateMainCourseDetails = updateMainCourseDetails;
		model.cancelUpdate = cancelUpdate;


		function updateMainCourseDetails(updatedCourse, daysOfWeek){

			// create dates based on start-end dates and the days of the weeks
			var start = new Date(updatedCourse.startingDate);
			var end = new Date(updatedCourse.expiryDate);
			var days = [];
			var courseDays = [];
			for(var i in daysOfWeek){
				if(daysOfWeek[i] === true){	
					switch (i) {
					    case "Sun":
					        days.push(0);
					        break;
						case "Mon":
					        days.push(1);
					        break;
						case "Tue":
					        days.push(2);
					        break;
						case "Wed":
					        days.push(3);
					        break;
						case "Thu":
					        days.push(4);
					        break;
				        case "Fri":
				     	    days.push(5);
				     	    break;
						case "Sat":
					        days.push(6);
					        break;
					}
				}
			}
			
			// Store the selected days per week
			updatedCourse.daysPerWeek = days;

			// Create the course days for the period of the course.
			for (start; end >= start; start.setDate(start.getDate()+1)){
				inner:
				for(var j in days){
					if(start.getDay() === days[j]){
						courseDays.push(start.toDateString());
						break inner;
					}	
				}
			}

			if(updatedCourse.courseDays.length === 0){
				updatedCourse.courseDays = courseDays;
			}
			
			// When update: check if the days per week is changed
			for(var e in model.selectedCourse.courseDays){
				if(model.selectedCourse.courseDays[e] !== courseDays[e]){
					// If the days chaned then store the new days per week
					updatedCourse.courseDays = courseDays;
					
					// temporary store the old details for each day in array
					var detailsArray = [];
					for(var n in updatedCourse.programDailyDetails){
						detailsArray.push(updatedCourse.programDailyDetails[n]);
					}

					// remove the old details for old days
					for(var h in updatedCourse.programDailyDetails){
						delete updatedCourse.programDailyDetails[h];
					}
					
					// store the daily details in the new dates
					for(var d in updatedCourse.courseDays){
						updatedCourse.programDailyDetails[updatedCourse.courseDays[d]] = detailsArray[d];
					}
					break;
				}
			}

			
			// switch to the next form 
			model.updateCourseMain = false;
			model.updateCourseProgramDetails = true;
		}


		function updateCourse(updatedCourse){
			var courseId = model.selectedCourse._id;
			coursesService
				.updateCourse(updatedCourse, courseId)
				.then(function(finalCourse){
					var url = "/centerProfile";
					$location.url(url);
				});
		}

		function selectCourse(courseId){
			coursesService
				.findCourseByCourseId(courseId)
				.then(function(course){
					course.startingDate = new Date(course.startingDate);
					course.expiryDate = new Date(course.expiryDate);
					
					model.selectedCourse = course;

					// Reverse the selected days
					// 0: Sun   1: Mon   2: Tue   3: Wed    4: Thu  5: Fri  6: Sat 			
					var daysOfWeek = {Sun:false, Mon:false, Tue:false, Wed:false, Thu:false, Fri:false, Sat:false};
					for(var i in model.selectedCourse.daysPerWeek){
						switch (model.selectedCourse.daysPerWeek[i]) {
							case 0:
								daysOfWeek.Sun = true;
								break;
							case 1:
								daysOfWeek.Mon = true;
								break;
							case 2:
								daysOfWeek.Tue = true;
								break;
							case 3:
								daysOfWeek.Wed = true;
								break;
							case 4:
								daysOfWeek.Thu = true;
								break;
							case 5:
								daysOfWeek.Fri = true;
								break;
							case 6:
								daysOfWeek.Sat = true;
								break;
						}
					}
					model.daysOfWeek = daysOfWeek;
					console.log(model.selectedCourse.daysPerWeek)
				});
		}


		function cancelUpdate(){
			var url = "/centerProfile";
			$location.url(url);
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