(function(){
	angular
		.module('UCMAS')
		.controller('eventDetailsController', eventDetailsController);

		function eventDetailsController($routeParams, eventsService, userService, $location){
			var model = this;

			function init(){
				model.error2 = null;
				var eventId = $routeParams.eventId;
				// var eventDetails = eventsService.findEventByEventId(eventId);
				eventsService.findEventByEventId(eventId)
					.then(function(eventDetails){
						model.eventDetails = eventDetails;
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

			model.eventRegistration = eventRegistration;
			model.logout = logout;

			function logout(){
				userService
					.logout()
					.then(function(){
						$location.url('/');
					});
			}



			function eventRegistration(event){
				if (!model.loggedUser){
					model.error1 = 'Please login or register to register on this event';
					$('html, body').animate({ scrollTop: 0 }, 'slow');
					return;
				} else {
					var userId = model.loggedUser._id;
					var eventsList = model.loggedUser.registeredEventsList;
					for(var e in eventsList){
						if(eventsList[e]._id === event._id){
							model.error2 = 'You already registered for this event';
							return;
						}
					}
					userService
						.addEventToUserEventsList(event)
						.then(function (response){
						$location.url('/userProfile');
					});
				}
			}

		}

})();