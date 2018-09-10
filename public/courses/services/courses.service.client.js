(function() {
	angular
		.module('UCMASjordan')
		.service('coursesService', coursesService);

	function coursesService($http) {

		function init() {}
		init();


		this.getallCourses = getallCourses;
		this.findCourseByCourseId = findCourseByCourseId;
		this.findCoursesByCenterId = findCoursesByCenterId;
		this.addNewCourse = addNewCourse;
		this.updateCourse = updateCourse;
		this.removeCourse = removeCourse;
		this.updateCourseByAdmin = updateCourseByAdmin;
		this.courseConfig = courseConfig;
		this.getMapBoxKey = getMapBoxKey;
		this.addToDiscountedMembers = addToDiscountedMembers;
		this.addExpense = addExpense;
		this.addToFrozeMembers = addToFrozeMembers;
		// this.removeFromFrozeMembers = removeFromFrozeMembers;
		this.removeFrozen = removeFrozen;


		function removeFrozen(ids){
			var userId = String(ids.userId);
			var courseId = String(ids.courseId);
			var originalCourseId = String(ids.originalCourseId);
			return $http.put('/api/course/removeFrozen', ids);
		}

		function addToFrozeMembers(freezeObject){
			return $http.put('/api/course/addToFrozeMembers', freezeObject);
		}

		function addExpense(expense){
			return $http.put('/api/course/addExpense', expense);
		}

		function addToDiscountedMembers(ids){
			return $http.put('/api/course/addToDiscountedMembers', ids);
		}

		function getMapBoxKey(){
			return $http.get('/api/getMapBoxKey');
		}

		function courseConfig(){
			return $http.get('/api/courseConfig');
		}

		function updateCourseByAdmin(course){
			return $http.put('/api/admin/updateCourseByAdmin/'+course._id, course)
				.then(function(response){
					return response.data;
				});
		}


		function getallCourses(){
			return $http.get('/api/allCourses')
				.then(function(response){
					return response.data;
				});
		}

		function findCourseByCourseId(courseId){
			return $http.get('/api/course/' + courseId)
				.then(function(response){
					return response.data;
				});
		}

		function findCoursesByCenterId(centerId) {
			return $http.get('/api/centerCourses/' + centerId)
				.then(function(response){
					return response.data;
				});
		}

		function addNewCourse(newCourse){
			return $http.post('/api/course/', newCourse)
				.then(function(response){
					return response.data;
				});
			// courses.push(newCourse);
		}

		function updateCourse(updatedCourse, courseId){
			// var url = '/api/course/' + courseId;
			return $http.put('/api/course/?courseId='+courseId, updatedCourse)
				.then(function (response){
					return response.data;					
				});			
		}


		function removeCourse(centerId, courseId){
			var url = '/api/course/?courseId=' + courseId + '&centerId='+centerId;
			return $http.delete(url)
				.then(function(response){
					return response.data;
				});
			// for(var e in courses){
			// 	if (courses[e].courseId === courseId){
			// 		courses.splice(e,1);
			// 		return courses;
			// 	}
			// }
		}




	}
})();