(function() {
	angular
		.module("ucmasJordan")
		.service('userService', userService);

	function userService($http) {

		this.findUserById = findUserById;
		this.findUserByEmail = findUserByEmail;
		this.login = login;
		this.createUser = createUser;
		this.checkUserLogin = checkUserLogin;
		this.logout = logout;
		this.isCenter = isCenter;
		this.isAdmin = isAdmin;
		this.addCourseToUserCoursesList = addCourseToUserCoursesList;
		this.removeRegisteredCourse = removeRegisteredCourse;
		this.getAllUsers = getAllUsers;
		this.forgetPassword = forgetPassword;
		this.resetPassword = resetPassword;
		this.updateProfile = updateProfile;
		this.makePayment = makePayment;
		this.confirmAttendance = confirmAttendance;
		this.submitFeedback = submitFeedback;
		this.updateUserCourseParameters = updateUserCourseParameters;
		this.freezeMembership = freezeMembership;
		this.removeFrozeDays = removeFrozeDays;
		this.getAllFeedbacks = getAllFeedbacks;
		this.updateFeedbackByAdmin = updateFeedbackByAdmin;
		


		function init() {}
		init();

		function updateFeedbackByAdmin(feedback){
			return $http.put('/api/admin/updateFeedbackByAdmin', feedback);
		}

		function getAllFeedbacks(){
			return $http.get('/api/user/getAllFeedbacks');
		}


		function removeFrozeDays(ids){
			var userId = ids.userId;
			var originalCourseId = ids.originalCourseId;
			return $http.delete('/api/user/removeFrozeDays/'+userId+'/'+originalCourseId);
		}

		function freezeMembership(freezeObject){
			var url = '/api/user/freezeMembership';
			return $http.put(url, freezeObject);
		}

		function updateUserCourseParameters(discount){
			var url = '/api/user/updateUserCourseParameters';
			return $http.put(url, discount);
		}

		function submitFeedback(feedbackObject){
			var url = '/api/user/submitFeedback';
			return $http.put(url, feedbackObject);
		}

		function confirmAttendance(totalAttended){
			var url = '/api/center/confirmAttendance';
			return $http.put(url, totalAttended);
		}

		function makePayment(payment){
			var url = '/api/center/makePayment';
			return $http.put(url, payment);
		}

		function updateProfile(updatedProfile){
			var url = '/api/user/updateProfile';
			return $http.put(url, updatedProfile);
		}

		function forgetPassword(email){
			var url = '/api/forgetPassword/'+email;
			return $http.post(url);
		}

		function resetPassword(token, password){
			var url = '/api/resetPassword/'+token;
			return $http.post(url, {password: password});
		}


		function getAllUsers(){
			return $http.get('/api/user/getAllUsers');
		}

		function addCourseToUserCoursesList(course){
			var url = '/api/addCourseToUser';
				return $http.post(url, course);
		}

		function removeRegisteredCourse(userId, courseId){
				var url = '/api/removeCourseFromUser/'+courseId;
				return $http.delete(url);
			}

		function logout(){
			return $http
					.post('/api/logout')
					.then(function(response){
						return response.data;
					});
		}



		function findUserById(userId) {
			var url = '/api/user/findUserById/' + userId;
			return $http.get(url)
				.then(function(response) {
					var userProfile = response.data;
					return userProfile;
				});
		}

		function findUserByEmail(email) {
			var url = '/api/user/findUserByEmail/'+email;
			return $http.get(url)
				.then(function(response) {
					var result = response.data;
					if(result.email){
						return ('email already exist');
					} else{
						return result;
					}
				});
		}

		function login(username, password) {
			var url = '/api/user/login';
			return $http.post(url, {username: username, password: password})
				.then(function(response) {
					if(response.data === null){
						return '0';
					}
						return response.data;
				},
				function(err){
					return err;
				});
		}

		
	

		function createUser(user){
			return $http.post('/api/user/', user)
				.then(function(response){
					return(response.data);
				});
		}




		function checkUserLogin(){
			var url = '/api/checkUserLogin';
			return $http
					.get(url)
					.then(function(result){
						return result.data;
					});
		}

		function isCenter(){
			return $http
					.get('/api/isCenter')
					.then(function(result){
						return result.data;
					});
		}

		function isAdmin(){
			return $http
					.get('/api/admin/isAdmin')
					.then(function(result){
						return result.data;
					});
		}

	}
})();