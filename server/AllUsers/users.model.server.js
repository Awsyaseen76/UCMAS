var mongoose = require('mongoose');
var usersSchema = require('./users.schema.server.js');

var usersDB = mongoose.model('usersDB', usersSchema);

module.exports = usersDB;

usersDB.addNewUser = addNewUser;
usersDB.loginUser = loginUser;
usersDB.getAllUsers = getAllUsers;
usersDB.findUserById = findUserById;
usersDB.findUserByEmail = findUserByEmail;
usersDB.addCourseId = addCourseId;
usersDB.removeCourseFromList = removeCourseFromList;
usersDB.findUserByGoogleId = findUserByGoogleId;
usersDB.addCourseToUserCoursesList = addCourseToUserCoursesList;
usersDB.removeRegisteredCourse = removeRegisteredCourse;
usersDB.addProfileImage = addProfileImage;
usersDB.addTokenToUser = addTokenToUser;
usersDB.findUserByToken = findUserByToken;
usersDB.resetPassword = resetPassword;
usersDB.updateProfile = updateProfile;
usersDB.makePayment = makePayment;
usersDB.confirmAttendance = confirmAttendance;
usersDB.submitFeedback = submitFeedback;
usersDB.updateUserCourseParameters = updateUserCourseParameters;
usersDB.freezeMembership = freezeMembership;
usersDB.removeFrozeDays = removeFrozeDays;
usersDB.getAllFeedbacks = getAllFeedbacks;
usersDB.updateFeedbackByAdmin = updateFeedbackByAdmin;

function updateFeedbackByAdmin(feedback){
	// console.log(feedback);
	userId = feedback.userId;
	return usersDB
			.findById(userId)
			.then(function(user){
				// console.log(user);
				for(var i in user.userCourseParameters){
					for(var j in user.userCourseParameters[i].feedbacks){
						// for(var f in user.userCourseParameters[i].feedbacks){
							if(user.userCourseParameters[i].feedbacks[j].courseName === feedback.courseName && user.userCourseParameters[i].feedbacks[j].feedback === feedback.feedback){
								user.userCourseParameters[i].feedbacks[j].approved = feedback.approved;
								return user.save();
							}
						// }
					}
				}
			});
}


function getAllFeedbacks(){
	return usersDB
				.find({userType: "user"})
				.then(function(users){
					return users;
				});
}


function removeFrozeDays(ids){
	var userId = ids.userId;
	var originalCourseId = ids.originalCourseId;
	return usersDB
				.findById(userId)
				.then(function(user){
					for(var i in user.userCourseParameters){
						if(user.userCourseParameters[i].courseId === originalCourseId){
							user.userCourseParameters[i].freezeDays.splice(0, user.userCourseParameters[i].freezeDays.length);
							return user.save();
						}
					}
				});
}


function freezeMembership(freezeObject){
	var userId = freezeObject.userId;
	var courseId = freezeObject.courseId;
	var days = freezeObject.days;
	return usersDB
				.findById(userId)
				.then(function(user){
					for(var p in user.userCourseParameters){
						if(user.userCourseParameters[p].courseId === courseId){
							user.userCourseParameters[p].freezeDays = days;
							return user.save();
						}
					}
				});
}

function updateUserCourseParameters(discount){
	var userId = discount.userId;
	var courseId = discount.courseId;
	return usersDB
				.findById(userId)
				.then(function (user){
					for(var e in user.userCourseParameters){
						if(user.userCourseParameters[e].courseId === courseId){
							if(user.userCourseParameters[e].discountType === ''){
							 	user.userCourseParameters[e].discountType = discount.discountType;
							 	user.userCourseParameters[e].discountTag = discount.discountTag;
							 	user.userCourseParameters[e].percentage = discount.percentage;
							 	user.userCourseParameters[e].discountedCoursePrice = discount.discountedCoursePrice;
							 	user.userCourseParameters[e].normalCoursePrice = discount.normalCoursePrice;
							 	user.userCourseParameters[e].courseDays = discount.courseDays;
							 	return user.save();								
							}else{
								var err = 'You Already had a discount!';
								return err;
							}
						}
					}
				});
}


function submitFeedback(feedbackObject){
	var userId = feedbackObject.userId;
	var courseId = feedbackObject.courseId;
	var feedDate = new Date();
	// var feedbackObject = {userId: model.loggedUser._id, courseId: courseId, courseName: courseName, feedbackText: feedbackText};
	var feed = {date: feedDate, courseName: feedbackObject.courseName, feedback: feedbackObject.feedbackText, userId: userId, approved: false};
	return usersDB
		.findById(userId)
		.then(function(user){
			// user.userFeedback.push(feedbackObject);
			for(var i in user.userCourseParameters){
				if(user.userCourseParameters[i].courseId === courseId){
					user.userCourseParameters[i].feedbacks.push(feed);
				}
			}
			return user.save();
		});
}


function confirmAttendance(attendedUser){
	return usersDB
		.findById(attendedUser.userId)
		.then(function(user){
			// loop the userCourseParameters
			for(var i in user.userCourseParameters){
				if(user.userCourseParameters[i].courseId === attendedUser.courseId){
					for(var j in user.userCourseParameters[i].attendedDays){
						if(user.userCourseParameters[i].attendedDays.length === 0){
							user.userCourseParameters[i].attendedDays.push({
								date: attendedUser.date,
								attended: attendedUser.attended
							});
							return user.save();
						}else if(user.userCourseParameters[i].attendedDays[j].date === attendedUser.date){
							user.userCourseParameters[i].attendedDays[j].attended = attendedUser.attended;
							return user.save();
						}
					}
					user.userCourseParameters[i].attendedDays.push({
						date: attendedUser.date,
						attended: attendedUser.attended
					});
					return user.save();
				}

			}
			// loop the attendedCourses if the course and the date is the same remove the old one and update the attended with the new object
			// for(var i in user.attendedCourses){
			// 	if(user.attendedCourses[i].courseId === attendedUser.courseId && user.attendedCourses[i].date === attendedUser.date){
			// 		user.attendedCourses.splice(i,1);
			// 		user.attendedCourses.push({courseId: attendedUser.courseId, 
			// 						  date: attendedUser.date, 
			// 						  attended: attendedUser.attended
			// 						});
			// 		return user.save();
			// 	}
			// }
			// user.attendedCourses.push({courseId: attendedUser.courseId, 
			// 						  date: attendedUser.date, 
			// 						  attended: attendedUser.attended
			// 						});
			// return user.save();
		});
}


function makePayment(payment){
	var userId = payment.userId;
	var courseId = payment.courseId;
	var paymentDate = payment.paymentDate;
	var paymentAmount = payment.paymentAmount;
	return usersDB
			.findById(userId)
			.then(function(user){
				for(var i in user.userCourseParameters){
					if(user.userCourseParameters[i].courseId === courseId){
						user.userCourseParameters[i].payments.push({date: paymentDate, amount: paymentAmount});
						return user.save();
					}
				}
			});
	// return usersDB
	// 			.findById(userId)
	// 			.then(function (user){
	// 				user.payments.push(
	// 							{courseId: payment.courseId,
	// 							 paymentDate: payment.paymentDate,
	// 							 paymentAmount: JSON.parse(payment.paymentAmount)});
	// 				return user.save();
	// 			});
}



function updateProfile(updatedProfile){
	return usersDB
			.findByIdAndUpdate(updatedProfile._id, updatedProfile)
			.then(function(result){
				return result;
			});
}

function resetPassword(user, newPassword){
	return usersDB
			.findById(user._id)
			.then(function(user){
				user.password = newPassword;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				return user.save();
			});
}

function findUserByToken(token){
	return usersDB
		.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}})
		.then(function(user){
			return user;
		}, function(err){
			console.log(err);
			return err;
		});
}


function addTokenToUser(userEmail, token){
	return usersDB
			.findUserByEmail(userEmail)
			.then(function(user){
				user.resetPasswordToken = token;
        		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        		return user.save();
		}, function(err){
			console.log(err);
		});
}
		


function addProfileImage(userId, profileImage){
	return usersDB
				.findUserById(userId)
				.then(function(user){
					user.profileImage = profileImage;
					return user.save();
				});
}



function findUserByGoogleId(googleId){
	return usersDB.findOne({'google.id' : googleId});
}

function addNewUser(user){
	return usersDB.create(user);
}

function loginUser(username, password){
	return usersDB.findOne({email: username, password: password});
}

function getAllUsers(){
	return usersDB
				.find()
				.populate('courses')
				.populate('registeredCoursesList')
				.exec();
}

function findUserById(userId){
	return usersDB
				.findById(userId)
				.populate('courses')
				.populate('registeredCoursesList')
				.exec();
}

function findUserByEmail(userEmail){
	return usersDB.findOne({email: userEmail});
}

function addCourseId(userId, courseId){
	return findUserById(userId)
		.then(function(user){
			user.courses.push(courseId);
			return user.save();
		});
}

function addCourseToUserCoursesList(userId, courseId){
	return findUserById(userId)
				.then(function(user){
					// this will be instead of registeredCoursesList
					var courseParams = {
					 	courseId: courseId,
					 	discountType: '',
					 	discountTag: '',
					 	percentage: 1,
					 	courseDays: [],
					 	discountedCoursePrice: 0,
					 	freezeDays: [],
					 	payments: [],
					 	attendedDays: [],
					 	feedbacks: []
					};
					user.userCourseParameters.push(courseParams);
					// ////////////
					user.registeredCoursesList.push(courseId);
					return user.save();
		});
}


function removeRegisteredCourse(userId, courseId){
	return usersDB
		.findById(userId)
		.then(function(user){
			var index = user.registeredCoursesList.indexOf(courseId);
			user.registeredCoursesList.splice(index, 1);
			return user.save();
		});
}

function removeCourseFromList(userId, courseId){
	return usersDB
		.findById(userId)
		.then(function(user){
			var index = user.courses.indexOf(courseId);
			user.courses.splice(index, 1);
			return user.save();
		});
}

