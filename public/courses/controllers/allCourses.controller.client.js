(function(){
	angular
		.module("ucmasJordan")
		.controller('allCoursesController', allCoursesController);

	function allCoursesController(coursesService, userService, $location){
		var model = this;
		model.position = {currentposition: {}};
		var mapFeatures = [];
		
		function init(){
			coursesService
				.courseConfig()
				.then(function(result){
					var coursesParams = result.data;
					var mapBoxKey = coursesParams.mapBoxKey;
					model.coursesList = coursesParams.coursesList;
					for(var e in model.coursesList){
						mapFeatures.push({"type": "Feature",
							              "properties": {
					                        "description": model.coursesList[e].name,
					                      },
					                      "geometry": {
					                        "type": "Point",
					                        "coordinates": model.coursesList[e].coordinates
					                    }
							            })
					}
					// function getLocation() {
					//     if (navigator.geolocation) {
					//         navigator.geolocation.getCurrentPosition(showPosition);
					//     } else { 
					//         console.log("Geolocation is not supported by this browser.");
					//     }
					// };

					// function showPosition(position){
						// model.position.currentposition.lat = position.coords.latitude; 
						// model.position.currentposition.lng = position.coords.longitude;

						// MapBox Maps
					    // Get the access token from the server
					    mapboxgl.accessToken = mapBoxKey;
						
						// Initilise the map 
						var map = new mapboxgl.Map({
							container: 'mapContainer',
							style: 'mapbox://styles/mapbox/streets-v10',
							center: [35.87741988743201, 32.003009804995955],
							// center: [model.position.currentposition.lng, model.position.currentposition.lat],
							zoom: 15
						});

						// Show map controller
						map.addControl(new mapboxgl.NavigationControl());

						map.on('load', function () {
							// change the marker image
							map.loadImage('../../img/marker.png', function(error, image) {
								if(error){throw error}
								map.addImage('marker', image);
								
								// configuration for the marker 
								var placesOfCourses = {
								        "id": "places",
								        "type": "symbol",
								        "source": {
								            "type": "geojson",
								            "data": {
								                "type": "FeatureCollection",
								                "features": mapFeatures
								            }
								        },
								        "layout": {
								            "icon-image": "marker",
								            "icon-allow-overlap": true,
								            "icon-size": 0.20
								        }
								}

								// Add the markers to the map
								map.addLayer(placesOfCourses);

								// to fit the map to view all the places of courses
							    var bounds = new mapboxgl.LngLatBounds();
							    placesOfCourses.source.data.features.forEach(function(feature) {
								    bounds.extend(feature.geometry.coordinates);
								});
								map.fitBounds(bounds, {padding:50});


								// to get the location from the mouse click on the map
								map.on('click', function(e) {
								    var latitude = e.lngLat.lat;
								    var longitude = e.lngLat.lng;
								    console.log(latitude + " - " + longitude)
								});

								// initialize the popup
								var popup = new mapboxgl.Popup({
							    	closeButton: false,
							    	closeOnClick: false
							    });

							    // Show the popup on mouse over the marker
							    // Change the cursor to a pointer when the mouse is over the places layer.
							    map.on('mouseenter', 'places', function (e) {
							        var coordinates = e.features[0].geometry.coordinates.slice();
							        var description = e.features[0].properties.description;

							        // Ensure that if the map is zoomed out such that multiple
							        // copies of the feature are visible, the popup appears
							        // over the copy being pointed to.
							        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
							            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
							        }

							        popup
							            .setLngLat(coordinates)
							            .setHTML(description)
							            .addTo(map);

							        map.getCanvas().style.cursor = 'pointer';
							    });

							    // Change it back to a pointer when it leaves and hide the popup.
							    map.on('mouseleave', 'places', function (e) {
							        map.getCanvas().style.cursor = '';
							        popup.remove()
							    });

							});
						});
					// }
					// getLocation()

				});

			// coursesService
			// 	.getallCourses()
			// 	.then(function(courses){
			// 		model.coursesList = courses;		
			// 	});

			userService
					.checkUserLogin()
					.then(function(result){
						if(result){
							model.loggedUser = result;
						}
					});
		}
		init();

		model.logout = logout;

		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}

	}
})();