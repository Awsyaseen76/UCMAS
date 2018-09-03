(function() {
	angular
		.module('UCMAS')
		.config(configuration);

	function configuration($routeProvider) {
		$routeProvider
			//ok
			.when('/', {
				templateUrl: '../views/pages/home.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			.when('/allLevels', {
				templateUrl: 'levels/templates/allLevels.view.client.html',
				controller: 'allLevelsController',
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

			.when('/teacherProfile', {
				templateUrl: 'AllUsers/templates/teacherProfile.view.client.html',
				controller: 'teacherProfileController',
				controllerAs: 'model',
				resolve: {
					loggedTeacher: isTeacher
				}
			})

			.when('/updateTeacherProfile', {
				templateUrl:'AllUsers/templates/editTeacherProfile.view.client.html',
				controller: 'teacherProfileController',
				controllerAs: 'model',
				resolve:{
					loggedTeacher: isTeacher
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
			
			.when('/allLevels/:levelId',{
				templateUrl: 'levels/templates/levelDetails.view.client.html',
				controller: 'levelDetailsController',
				controllerAs: 'model'
			})
			

			.when('/teacherProfile/levelsList', {
				templateUrl:  'AllUsers/templates/teacherLevelsList.view.client.html',
				controller:   'teacherLevelsListController',
				controllerAs: 'model',
				resolve: {
					loggedTeacher: isTeacher
				}
			})


			.when('/teacherProfile/newLevel', {
				templateUrl: 'AllUsers/templates/teacherNewLevel.view.client.html',
				controller: 'teacherNewLevelController',
				controllerAs: 'model',
				resolve: {
					loggedTeacher: isTeacher
				}
			})

			// .when('/teacherProfile/reNewLevel/:levelId', {
			// 	templateUrl: 'AllUsers/templates/teacherReNewLevel.view.client.html',
			// 	controller: 'teacherReNewLevelController',
			// 	controllerAs: 'model',
			// 	resolve: {
			// 		loggedTeacher: isTeacher
			// 	}
			// })

			.when('/teacherProfile/editLevel', {
				templateUrl: 'AllUsers/templates/teacherEditLevel.view.client.html',
				controller: 'teacherEditLevelController',
				controllerAs: 'model',
				resolve: {
					loggedTeacher: isTeacher
				}
			})


			.when('/teacherProfile/teacherLevelDetails/:levelId', {
				templateUrl: 'levels/templates/teacherLevelDetails.view.client.html',
				controller: 'teacherLevelDetails',
				controllerAs: 'model',
				resolve: {
					loggedTeacher: isTeacher
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

	function isTeacher(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.isTeacher()
			.then(function(teacher){
				if(teacher === null){
					deferred.reject();
					$location.url('/login');
				} else{
					deferred.resolve(teacher);
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
				} else if(user.userType === 'teacher'){
					deferred.resolve(user);
					$location.url('/teacherProfile');
					return deferred.promise;
				}else if(user.userType === 'admin'){
					deferred.resolve(user);
					$location.url('/adminPage');
					return deferred.promise;
				}
			});
	}


})();