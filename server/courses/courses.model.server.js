var mongoose = require('mongoose');
var coursesSchema = require('./courses.schema.server.js');

var usersDB = require('../AllUsers/users.model.server.js');

var coursesDB = mongoose.model('coursesDB', coursesSchema);

module.exports = coursesDB;

coursesDB.findCourseByCourseId = findCourseByCourseId;
coursesDB.findCoursesByCenterId = findCoursesByCenterId;
coursesDB.getallCourses = getallCourses;
coursesDB.addNewCourse = addNewCourse;
coursesDB.updateCourse = updateCourse;
coursesDB.removeCourse = removeCourse;
coursesDB.updateCourseByAdmin = updateCourseByAdmin;
coursesDB.addMemberToCourse = addMemberToCourse;
coursesDB.addToDiscountedMembers = addToDiscountedMembers;
coursesDB.addExpense = addExpense;
coursesDB.addToFrozeMembers = addToFrozeMembers;
coursesDB.removeFrozen = removeFrozen;

function removeFrozen(ids){
	// console.log(ids);
	var courseId = ids.courseId;
	var userId = ids.userId;
	var originalCourseId = ids.originalCourseId;
	return coursesDB
				.findById(courseId)
				.then(function(course){
					console.log('the found course is:');
					console.log(course);
					for(var f in course.frozeMembers){
						if(course.frozeMembers[f].userId === userId){
							// instead of remove the frozen members set the compensated to true
							// course.frozeMembers.splice(f,1);
							course.frozeMembers[f].compensated = true;
							console.log('compensated after is: ',course.frozeMembers[f].compensated);
						}
					}
					return course.save();
					// return usersDB.findById(userId);
				})
				// .then(function(user){
				.then(
					usersDB
						.findById(userId)
						.then(function(user){
							console.log('the user is: ');
							console.log(user);
							for(var i in user.userCourseParameters){
								if(user.userCourseParameters[i].courseId === originalCourseId){
									user.userCourseParameters[i].freezeDays.splice(0, user.userCourseParameters[i].freezeDays.length);
								}
							}
							return user.save();
							
						})

					);
}




function addToFrozeMembers(freezeObject){
	var courseId = freezeObject.courseId;
	return coursesDB
			.findById(courseId)
			.then(function(course){
				course.frozeMembers.push(freezeObject);
				return course.save();
			});
}


function addExpense(courseId, expense){
	return coursesDB
				.findById(courseId)
				.then(function(course){
					course.expenses.push(expense);
					return course.save();
				});
}


function addToDiscountedMembers(ids){
	var courseId = ids.courseId;
	var userId = ids.userId;
	return coursesDB
				.findById(courseId)
				.then(function(course){
					for(var u in course.discountedMembers){
						if(course.discountedMembers[u] === userId){
							var err = 'You Already had a discount!';
							return (err);
						}else{
							course.discountedMembers.push(userId);
							return course.save();
						}
					}
				});
}


function addMemberToCourse(courseId, userId){
	return coursesDB
			.findById(courseId)
			.then(function(course){
				course.registeredMembers.push(userId);
				return course.save();
			});
}


function findCourseByCourseId(courseId){
	return coursesDB
				.findById(courseId)
				.populate('registeredMembers')
				.exec();
}

function findCoursesByCenterId(centerId){
	return coursesDB
				.find({centerId: centerId})
				.sort('startingDate')
				.populate('registeredMembers')
				.exec();
}

function getallCourses(){
	// var today = (new Date()).toISOString();
	// return coursesDB
	// 			.find({
	// 				startingDate: {$gt: today}
	// 			})
	// 			.sort('startingDate')
	// 			.populate('centerId')
	// 			.exec();
	return coursesDB
				.find({})
				.then(function(result){
					return result;
				});
}

function addNewCourse(centerId, course){
	var courseTemp = null;
	return coursesDB
				.create(course)
				.then(function(addedCourse){
					courseTemp = addedCourse;
					return usersDB.addCourseId(centerId, addedCourse._id);
				})
				.then(function(center){
					return courseTemp;
				});
}


function updateCourseByAdmin(courseId, updatedCourse){
	return coursesDB.update({_id: courseId}, {$set: updatedCourse});
}


function updateCourse(courseId, updatedCourse){
	return coursesDB.update({_id: courseId}, {$set: updatedCourse});
}

function removeCourse(centerId, courseId){
	return coursesDB
				.remove({_id: courseId})
				.then(function(status){
					return usersDB.removeCourseFromList(centerId, courseId);
				})
				.then(function(removedCourse){
					return removedCourse;
				});
}