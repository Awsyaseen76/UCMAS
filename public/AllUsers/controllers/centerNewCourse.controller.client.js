(function(){
	angular
		.module("ucmasJordan")
		.controller('centerNewCourseController', centerNewCourseController);

		function centerNewCourseController($location, coursesService, loggedCenter, userService){
			var model = this;
			function init(){
				model.newCourseMain = true;
				model.loggedCenter = loggedCenter;
				coursesService
					.getMapBoxKey()
					.then(function(mapBoxKey){
						model.mapBoxKey = mapBoxKey.data;

						// MapBox Maps
					    // Get the access token from the server
					    mapboxgl.accessToken = model.mapBoxKey;
						
						$('#mapModal').on('shown.bs.modal', function() {
							// Initilise the map 
							var map = new mapboxgl.Map({
								container: 'mapForLocation',
								// style: 'mapbox://styles/mapbox/streets-v10',
								style: 'mapbox://styles/mapbox/satellite-streets-v9',
								center: [35.87741988743201, 32.003009804995955],
								// center: [model.position.currentposition.lng, model.position.currentposition.lat],
								zoom: 12
							});

							// Show map controller
							map.addControl(new mapboxgl.NavigationControl());

							// Get the location from the map
							map.on('click', function(e) {
							    // var latitude = e.lngLat.lat;
							    // var longitude = e.lngLat.lng;
							    model.mapLocation.latitude = e.lngLat.lat;
								model.mapLocation.longitude = e.lngLat.lng;
							    document.getElementById('mapLat').innerHTML = model.mapLocation.latitude;
							    document.getElementById('mapLng').innerHTML = model.mapLocation.longitude;
							});

						});	
						
						
 						

					});
			}
			init();
			var _centerId = loggedCenter._id;
			
			model.createCourse = createCourse;
			model.logout = logout;
			model.createCourseDetails = createCourseDetails;
			model.getCurrentLocation = getCurrentLocation;
			model.getLocationFromMap = getLocationFromMap;
			model.mapLocation = {longitude: 0, latitude: 0};


			function getCurrentLocation() {
			    if (navigator.geolocation) {
			        navigator.geolocation.getCurrentPosition(showPosition);
			    } else { 
			        console.log("Geolocation is not supported by this browser.");
			    }
			}

			function showPosition(position){
				model.mapLocation.latitude = position.coords.latitude; 
				model.mapLocation.longitude = position.coords.longitude;
				document.getElementById('mapLongitude').value = model.mapLocation.longitude;
				document.getElementById('mapLatitude').value = model.mapLocation.latitude;

			}

			function getLocationFromMap(){
				document.getElementById('mapLongitude').value = model.mapLocation.longitude;
				document.getElementById('mapLatitude').value = model.mapLocation.latitude;
			}

			function createCourseDetails(newCourse, daysOfWeek, mapLocation){
				// create dates based on start-end dates and the days of the weeks
				var start = new Date(newCourse.startingDate);
				var end = new Date(newCourse.expiryDate);
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
				newCourse.daysPerWeek = days;
				
				for (start; end>start; start.setDate(start.getDate()+1)){
					inner:
					for(var j in days){
						if(start.getDay() === days[j]){
							courseDays.push(start.toDateString());
							break inner;
						}
					}
				}
				newCourse.courseDays = courseDays;
				newCourse.coordinates = [mapLocation.longitude, mapLocation.latitude];
				model.newCourse = newCourse;
				model.newCourseMain = false;
				model.newCourseProgramDetails = true;
			}

			
			function createCourse(newCourse){
				newCourse.centerId = _centerId;
				console.log(newCourse.centerId);
				coursesService
					.addNewCourse(newCourse)
					.then(function(addedCourse){
						$location.url('/centerProfile/coursesList');
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