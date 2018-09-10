(function() {
	angular
		.module('UCMASjordan')
		.controller('centerProfileController', centerProfileController);

	function centerProfileController(userService, loggedCenter, $location) {
		var model = this;
		model.logout = logout;
		model.updateCenterProfile = updateCenterProfile;

		function init() {
			model.loggedCenter = loggedCenter;
			// loggedCenter.DOB = new Date(loggedCenter.DOB);
			model.centerProfile = loggedCenter;
			console.log(loggedCenter.profileImage);
		}
		init();

		function updateCenterProfile(updatedCenterProfile){
			userService
				.updateProfile(updatedCenterProfile)
				.then(function(result){
					console.log('Profile Updated');
					$location.url('/profile');
				});
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