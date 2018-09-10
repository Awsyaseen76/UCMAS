var coursesDB = require('./courses.model.server.js');

module.exports = function(app) {

	

	// http handlers
	app.get('/api/allCourses', getallCourses);
	// app.get('/api/course/:courseId', findCourse);
	// app.get('/api/course/', findCourse);
	app.get('/api/centerCourses/:centerId', findCoursesByCenterId);
	app.get('/api/course/:courseId', findCourseByCourseId);
	app.post('/api/course/', addNewCourse);
	app.put('/api/course/', updateCourse);
	app.delete('/api/course/', removeCourse);
	app.put('/api/admin/updateCourseByAdmin/:courseId', checkAdmin, updateCourseByAdmin);
	app.get('/api/courseConfig', courseConfig);
	app.get('/api/getMapBoxKey', getMapBoxKey);
	app.put('/api/course/addToDiscountedMembers', addToDiscountedMembers);
	app.put('/api/course/addExpense', addExpense);
	app.put('/api/course/addToFrozeMembers', addToFrozeMembers);
	// app.delete('/api/course/removeFromFrozeMembers/:userId/:courseId', removeFromFrozeMembers);
	// app.put('/api/course/removeFrozen/:userId/:courseId/:originalCourseId', removeFrozen);
	app.put('/api/course/removeFrozen', removeFrozen);


	function removeFrozen(req, res){
		var ids = req.body;
		console.log(ids);
		coursesDB
			.removeFrozen(ids)
			.then(function(result){
				console.log('the result of remove frozen is: ');
				console.log(result);
				res.send(result);
			});
	}


	function addToFrozeMembers(req, res){
		var freezeObject = req.body;
		coursesDB
			.addToFrozeMembers(freezeObject)
			.then(function(result){
				res.send(result);
			});
	}

	function addExpense(req, res){
		var expense = req.body;
		var courseId = expense.courseId;
		delete(expense.courseId);
		coursesDB
			.addExpense(courseId, expense)
			.then(function(result){
				res.send(result);
			});
	}

	function addToDiscountedMembers(req, res){
		var ids = req.body;
		coursesDB
			.addToDiscountedMembers(ids)
			.then(function(result){
				res.send(result);
			});
	}


	function getMapBoxKey(req, res){
		var mapBoxKey = process.env.mapboxAccessToken;
		res.send(mapBoxKey);
	}
	

	function courseConfig(req, res){
		var coursesParams = {};
		coursesParams.mapBoxKey = process.env.mapboxAccessToken;

		coursesDB
			.getallCourses()
			.then(function(courses){
				coursesParams.coursesList = courses;
				res.send(coursesParams);
			});
	}


	function checkAdmin(req, res, next){
		if(req.user && req.user.userType === "admin"){
			next();
		}else{
			res.sendStatus(401);
		}
	}


	function updateCourseByAdmin(req, res){
		var courseId = req.params.courseId;
		var updatedCourse = req.body;
		coursesDB
			.updateCourseByAdmin(courseId, updatedCourse)
			.then(function(status){
				res.send(status);
				return;
			});
	}

	// function findCourse(req, res){
	// 	if(req.query.courseId){
	// 		res.send(coursesDB
	// 					.findCourseByCourseId(req.query.courseId)
	// 					.then(function(course){
	// 						res.send(course);
	// 						return;
	// 					})
	// 				);
	// 	}
	// 	if(req.query.centerId){
	// 		res.send(coursesDB
	// 					.findCoursesByCenterId(req.query.centerId)
	// 					.then(function(course){
	// 						res.send(course);
	// 						return;
	// 					})
	// 				);
	// 		return;
	// 	}
		
	// }
	
	function findCoursesByCenterId(req, res){
		var centerId = req.params.centerId;

		coursesDB
			.findCoursesByCenterId(centerId)
			.then(function(courses){
				res.send(courses);
				return;
			});

	}

	function findCourseByCourseId(req, res){
		var courseId = req.params.courseId;
		coursesDB
			.findCourseByCourseId(courseId)
			.then(function(course){
				res.send(course);
				return;
			});
	}

	function getallCourses(req, res){
		coursesDB
			.getallCourses()
			.then(function(result){
				res.send(result);
				return;
			});
	}

	// function findCourseByCourseId(courseId){
	// 	coursesDB
	// 		.findCourseByCourseId(courseId)
	// 		.then(function(foundCourse){
	// 			return foundCourse;
	// 		});
		// for(var e in courses){
		// 	if(courseId === courses[e].courseId){
		// 		return(courses[e]);
		// 	}
		// }
		// return ('error');
	// }

	// function findCoursesByCenterId(centerId){
	// 	var coursesList = [];
	// 		for(var e in courses){
	// 			if(centerId === courses[e].centerId){
	// 				coursesList.push(courses[e]);
	// 			}
	// 		}
	// 		return (coursesList);
	// }

	function addNewCourse(req, res){
		var newCourse = req.body;
		var centerId = newCourse.centerId;
		// courses.push(newCourse);
		coursesDB
			.addNewCourse(centerId, newCourse)
			.then(function(addedCourse){
				res.send(addedCourse);
				return;
			});
	}

	function updateCourse(req, res){
		var courseId = req.query.courseId;
		var updatedCourse = req.body;
		// request the admin to approve the amendments
		updatedCourse.approved = false;
		updatedCourse.special = false;
		coursesDB
			.updateCourse(courseId, updatedCourse)
			.then(function(status){
				// res.send(status);
				// return;
				coursesDB
					.findCourseByCourseId(courseId)
					.then(function(course){
						res.send(course);
						return;
					});
			});
	}

	function removeCourse(req, res){
		var centerId = req.query.centerId;
		var courseId = req.query.courseId;

		coursesDB
			.removeCourse(centerId, courseId)
			.then(function(status){
				res.send(status);
				return;
			});
		// for(var e in courses){
		// 	if(courseId === courses[e].courseId){
		// 		courses.splice(e, 1);
		// 		res.send('course deleted');
		// 		return;
		// 	}
		// }
	}




};