(function() {
	angular
		.module("UCMASjordan")
		.config(configuration);

	function configuration($routeProvider) {
		$routeProvider
			//ok
			.when('/', {
				templateUrl: '../views/pages/home.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			.when('/allCourses', {
				templateUrl: 'courses/templates/allCourses.view.client.html',
				controller: 'allCoursesController',
				controllerAs: 'model'
			})

			.when('/login', {
				templateUrl: 'AllUsers/templates/login.view.client.html',
				controller: 'loginController',
				controllerAs: 'model'
			})
			
			.when('/register', {
				templateUrl: 'AllUsers/templates/register.view.client.html',
				controller: 'registerController',
				controllerAs: 'model'
			})

			.when('/forgetPassword', {
				templateUrl: 'AllUsers/templates/forgetPassword.view.client.html',
				controller: 'forgetPasswordController',
				controllerAs: 'model'	
			})
			.when('/resetPassword/:token', {
				templateUrl: 'AllUsers/templates/resetPassword.view.client.html',
				controller: 'resetPasswordController',
				controllerAs: 'model'	
			})

			.when('/profile', {
				resolve: {
					loggedUser: checkUserType
				}
			})
			
			.when('/userProfile', {
				templateUrl: 'AllUsers/templates/userProfile.view.client.html',
				controller: 'userProfileController',
				controllerAs: 'model',
				resolve: {
					loggedUser: isUser
				}
			})
			
			.when('/updateUserProfile', {
				templateUrl:'AllUsers/templates/editUserProfile.view.client.html',
				controller: 'updateUserProfile',
				controllerAs: 'model',
				resolve:{
					loggedUser: isUser
				}
			})

			.when('/centerProfile', {
				templateUrl: 'AllUsers/templates/centerProfile.view.client.html',
				controller: 'centerProfileController',
				controllerAs: 'model',
				resolve: {
					loggedCenter: isCenter
				}
			})

			.when('/updateCenterProfile', {
				templateUrl:'AllUsers/templates/editCenterProfile.view.client.html',
				controller: 'centerProfileController',
				controllerAs: 'model',
				resolve:{
					loggedCenter: isCenter
				}
			})


			.when('/adminPage', {
				templateUrl: 'admin/templates/adminPage.view.client.html',
				controller: 'adminController',
				controllerAs: 'model',
				resolve: {
					loggedAdmin: isAdmin
				}

			})
			
			.when('/allCourses/:courseId',{
				templateUrl: 'courses/templates/courseDetails.view.client.html',
				controller: 'courseDetailsController',
				controllerAs: 'model'
			})
			

			.when('/centerProfile/coursesList', {
				templateUrl:  'AllUsers/templates/centerCoursesList.view.client.html',
				controller:   'centerCoursesListController',
				controllerAs: 'model',
				resolve: {
					loggedCenter: isCenter
				}
			})


			.when('/centerProfile/newCourse', {
				templateUrl: 'AllUsers/templates/centerNewCourse.view.client.html',
				controller: 'centerNewCourseController',
				controllerAs: 'model',
				resolve: {
					loggedCenter: isCenter
				}
			})

			.when('/centerProfile/reNewCourse/:courseId', {
				templateUrl: 'AllUsers/templates/centerReNewCourse.view.client.html',
				controller: 'centerReNewCourseController',
				controllerAs: 'model',
				resolve: {
					loggedCenter: isCenter
				}
			})

			.when('/centerProfile/editCourse', {
				templateUrl: 'AllUsers/templates/centerEditCourse.view.client.html',
				controller: 'centerEditCourseController',
				controllerAs: 'model',
				resolve: {
					loggedCenter: isCenter
				}
			})


			.when('/centerProfile/centerCourseDetails/:courseId', {
				templateUrl: 'courses/templates/centerCourseDetails.view.client.html',
				controller: 'centerCourseDetails',
				controllerAs: 'model',
				resolve: {
					loggedCenter: isCenter
				}
			})

			.when('/contact', {
				templateUrl: '../views/pages/contact.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			.when('/about', {
				templateUrl: '../views/pages/about.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			});
	}
	
	// check the user if still logged in through the server cockies if the user logged in he is in the cockies based on that we can protect the url
	function isUser(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.checkUserLogin()
			.then(function(user){
				if(user === null){
					deferred.reject();
					$location.url('/login');
				} else{
					deferred.resolve(user);
				}
			});
		return deferred.promise;
	}

	function isCenter(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.isCenter()
			.then(function(center){
				if(center === null){
					deferred.reject();
					$location.url('/login');
				} else{
					deferred.resolve(center);
				}
			});
		return deferred.promise;
	}

	function isAdmin(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.isAdmin()
			.then(function(admin){
				if(admin === null){
					deferred.reject();
					$location.url('/');
				}else{
					deferred.resolve(admin);
				}
			});
			return deferred.promise;
	}

	function checkUserType(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.checkUserLogin()
			.then(function(user){
				if(user.userType === 'user'){
					deferred.resolve(user);
					$location.url('/userProfile');
					return deferred.promise;
				} else if(user.userType === 'center'){
					deferred.resolve(user);
					$location.url('/centerProfile');
					return deferred.promise;
				}else if(user.userType === 'admin'){
					deferred.resolve(user);
					$location.url('/adminPage');
					return deferred.promise;
				}
			});
	}


})();