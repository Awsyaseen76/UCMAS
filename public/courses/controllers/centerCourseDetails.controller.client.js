(function() {
	angular
		.module("UCMASjordan")
		.controller('centerCourseDetails', centerCourseDetails);

	function centerCourseDetails($routeParams, coursesService, userService, $location, $route, loggedCenter) {

		var model = this;
		model.logout = logout;
		model.makePayment = makePayment;
		model.getTotals = getTotals;
		model.confirmAttendance = confirmAttendance;
		model.today = new Date();
		model.attendanceArray = [];
		model.countAttendance = countAttendance;
		model.specialDiscountAmount = 1;
		model.hadDiscount = hadDiscount;
		model.selectDiscount = selectDiscount;
		model.selectPaymentType = selectPaymentType;
		model.giveADiscountError = false;
		model.giveADiscount = giveADiscount;
		model.getUserPayments = getUserPayments;
		model.getGrandTotals = getGrandTotals;
		model.getCourseFeedbacks = getCourseFeedbacks;
		model.getAttendance = getAttendance;
		model.freezeMember = freezeMember;
		model.prepareFreezeDays = prepareFreezeDays;
		model.getFrozeMembers = getFrozeMembers;
		model.prepareExpenses = prepareExpenses;
		model.addExpense = addExpense;
		model.attendanceReportCreater = attendanceReportCreater;
		model.isUserFreezeToday = isUserFreezeToday;
		model.removeFrozen = removeFrozen;
		model.showPaidMembers = showPaidMembers;

		




		// this is temporary in future the course center created the discountTypes array
		model.discountTypes = [{
				name: 'Discount type...',
				amount: 0
			}, {
				name: 'No discount',
				amount: 0
			}, {
				name: 'family',
				amount: 10
			}, {
				name: 'group',
				amount: 10
			}, {
				name: 'special',
				types: [{
					name: 'special25',
					amount: 25
				}, {
					name: 'special50',
					amount: 50
				}, {
					name: 'special75',
					amount: 75
				}, {
					name: 'special100',
					amount: 100
				}]
			}

		];

		model.paymentTypes = [{
			name: 'Payment type...'
		}, {
			name: 'Down payment'
		}, {
			name: 'Weekly payment'
		}, {
			name: 'Full payment'
		}, ];

		model.expensesTypes = [{
			name: 'Expense type...'
		}, {
			name: 'Salary'
		}, {
			name: 'Hospitality'
		}, {
			name: 'Rental fees'
		}, {
			name: 'Misc'
		}];



		// Temporary
		// model.expensesDetails = [{amount: 100, details: 'test of first', type: 'Salary', date: 'Mon Aug 06 2018'}];

		// model.calculateSessions = calculateSessions;
		// model.getTotalIncome = getTotalIncome;


		function init() {
			model.loggedCenter = loggedCenter;
			model.error2 = null;
			model.grandTotalPayments = 0;
			var courseId = $routeParams.courseId;

			// for default select option the first one is the title
			model.selectedDiscount = model.discountTypes[0];
			model.typeOfPayment = model.paymentTypes[0];
			model.selectedExpenseType = model.expensesTypes[0];
			model.thereIsSpecialDiscount = false;
			// model.hadDiscount = hadDiscount;

			coursesService
				.findCourseByCourseId(courseId)
				.then(function(courseDetails) {
					model.courseFeedbacks = [];
					model.frozeMembers = [];
					model.courseDetails = courseDetails;
					model.discountedMembers = courseDetails.discountedMembers;
					model.grandTotals = 0;
					model.paidMembers = [];
					model.unPaidMembers = [];

					for (var i in model.courseDetails.registeredMembers) {
						model.grandTotals += getTotals(model.courseDetails.registeredMembers[i], model.courseDetails._id).totalOfPayments;
						for(var l in model.courseDetails.registeredMembers[i].userCourseParameters){
							if(model.courseDetails.registeredMembers[i].userCourseParameters[l].courseId == model.courseDetails._id){
								if(model.courseDetails.registeredMembers[i].userCourseParameters[l].payments.length>0){
									model.paidMembers.push(model.courseDetails.registeredMembers[i]);
								}else{
									model.unPaidMembers.push(model.courseDetails.registeredMembers[i]);
								}
							}
						}
					}
					// }

					for (var x in model.courseDetails.registeredMembers) {
						// Calculate the grand total payments
						for (var j in model.courseDetails.registeredMembers[x].userCourseParameters) {
							if (model.courseDetails.registeredMembers[x].userCourseParameters[j].courseId === model.courseDetails._id) {
								for (var s in model.courseDetails.registeredMembers[x].userCourseParameters[j].payments) {
									model.grandTotalPayments += model.courseDetails.registeredMembers[x].userCourseParameters[j].payments[s].amount;
								}
								// collect the feedbacks
								for (var f in model.courseDetails.registeredMembers[x].userCourseParameters[j].feedbacks) {
									var feed = model.courseDetails.registeredMembers[x].userCourseParameters[j].feedbacks[f];
									feed.userName = model.courseDetails.registeredMembers[x].name.firstName + " " + model.courseDetails.registeredMembers[x].name.lastName;
									model.courseFeedbacks.push(feed);
								}
								if (model.courseDetails.registeredMembers[x].userCourseParameters[j].freezeDays.length > 0) {
									// for(var z in model.courseDetails.registeredMembers[x].userCourseParameters[j]){
									var freeze = {};
									freeze.userName = model.courseDetails.registeredMembers[x].name;
									freeze.days = model.courseDetails.registeredMembers[x].userCourseParameters[j].freezeDays;
									model.frozeMembers.push(freeze);
									// }
								}
							}
						}
						// // Collect the feedbacks
						// for(var e in model.courseDetails.registeredMembers[x].userFeedback){
						// 	if(model.courseDetails.registeredMembers[x].userFeedback[e].courseId === courseId){
						// 		var feed = model.courseDetails.registeredMembers[x].userFeedback[e];
						// 		feed.userName = model.courseDetails.registeredMembers[x].name.firstName + " " + model.courseDetails.registeredMembers[f].name.lastName;
						// 		model.courseFeedbacks.push(feed);
						// 	}
						// }
					}
					// Calculate the total income from the course
					var totalOfMembers = model.courseDetails.registeredMembers.length;
					var membersWithoutDiscount = totalOfMembers - model.discountedMembers.length;
					// var incomeFromNoDiscount = membersWithoutDiscount * model.courseDetails.price; 
					var incomeFromNoDiscount = 0;
					var incomeFromDiscounted = 0;

					// for(var n in model.discountedMembers){
					// 	incomeFromDiscounted += model.courseDetails.price* model.discountedMembers[n].percentage;
					// }
					for (var n in model.courseDetails.registeredMembers) {
						for (var k in model.courseDetails.registeredMembers[n].userCourseParameters) {
							if (model.courseDetails.registeredMembers[n].userCourseParameters[k].courseId === model.courseDetails._id) {
								incomeFromDiscounted += model.courseDetails.registeredMembers[n].userCourseParameters[k].discountedCoursePrice;
								incomeFromNoDiscount += model.courseDetails.registeredMembers[n].userCourseParameters[k].normalCoursePrice;
							}
						}
					}
					model.totalIncomeFromCourse = incomeFromDiscounted + incomeFromNoDiscount;
				});
		}
		init();



		function selectDiscount(name) {
			model.discountTags = {};
			var today = new Date();
			var tagCode = today.getHours() + '' + today.getDate() + '' + today.getMonth() + '' + today.getFullYear() + '';
			if (model.selectedDiscount.name === 'family') {
				model.discountTags.familyTag = name.middleName + name.lastName + tagCode;
				model.discountTags.groupTag = '';
				model.thereIsFamilyDiscount = true;
				model.thereIsSpecialDiscount = false;
				model.thereIsGroupDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'group') {
				model.discountTags.groupTag = tagCode;
				model.discountTags.familyTag = '';
				model.thereIsGroupDiscount = true;
				model.thereIsSpecialDiscount = false;
				model.thereIsFamilyDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'special') {
				model.thereIsSpecialDiscount = true;
				model.thereIsFamilyDiscount = false;
				model.thereIsGroupDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'No discount') {
				model.thereIsSpecialDiscount = false;
				model.thereIsFamilyDiscount = false;
				model.thereIsGroupDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'Discount type...') {
				model.thereIsSpecialDiscount = false;
				model.thereIsFamilyDiscount = false;
				model.thereIsGroupDiscount = false;

			}

		}


		// function calculateSessions(){
		// 	var newCourseDays;
		// 	var today = new Date();
		// 	var daysPerWeek = model.courseDetails.daysPerWeek;
		// 	var weeks, days;

		// 	// create course days array starting from the payment date
		// 	courseDaysLoop:
		// 	for(var d in model.courseDetails.courseDays){
		// 		if(today <= new Date(model.courseDetails.courseDays[d])){
		// 			newCourseDays = model.courseDetails.courseDays.slice(d);
		// 			break courseDaysLoop;
		// 		}
		// 	}

		// 	// calculating weeks and days
		// 	if(newCourseDays.length%daysPerWeek.length === 0){
		// 		weeks = newCourseDays.length/daysPerWeek.length;
		// 		days = 0;
		// 		return {courseDays: newCourseDays, weeksDays:{weeks: weeks, days: days}};
		// 	}else {
		// 		weeks = Math.floor(newCourseDays.length/daysPerWeek.length);
		// 		days = newCourseDays.length%daysPerWeek.length;
		// 		return {courseDays: newCourseDays, weeksDays:{weeks: weeks, days: days}};
		// 	}
		// }



		// steps of payment:
		//		1. center show registered members.
		// 		2. if he want to give a discount select discount button.
		// 		3. make a payment by select Pay button.
		// 		4. seslect Date
		// 		5. select payment type.
		// 		6. selectPaymentType function:
		//			- check if this is the first payment (looping user.payments for this courseId)
		// 				. if it is the first payment (newUser):
		// 					1. call calculateSessions() which return the course days.
		// 					2. check if user had discount then get the discount type and tag.
		// 					3. create memberObject containing:
		// 						{userId, discountType, discoutTag, courseDays, totalPrice, freezeDays}
		// 				. if not: 
		// 					1. the courseDays are the same of the courseDetails.courseDays.
		// 					2. check if user had discount then get the discount type and tag.
		// 					3. search for user in members array
		// 			- create an courseMembers array:
		// 			- 
		// 



		// Create {{{{{{{{{courseMembers}}}}}}}}} object instead of discounted members 
		// store:
		// {userId, discountType, discoutTag, courseDays, totalPrice, freezeDays}
		// ?????Freeze???????
		// when member ask for freezing days:
		// 1. check if he had already use the freeze before.
		// 2. if not select show a modal of the remaining dates to select the freezign days from
		// 3. add the froze dates array to the user courseMembers[user].freezeDays.
		// 4. when course days end push the users from courseMembers whome they had freeze to the new course they will create.
		// 5. when user register for new course check if he already had a froze days and deduct them from the course price.


		function selectPaymentType(paymentType, user) {
			var courseId = model.courseDetails._id;

			getTotals(user, courseId, function(totals) {
				model.totals = totals;
				switch (paymentType.name) {
					case 'Weekly payment':
						model.paymentAmount = Number(model.totals.discountedWeeklyPrice.toFixed(2));
						break;
					case 'Full payment':
						model.paymentAmount = Math.abs(model.totals.balance);
						// document.getElementById('paymentAmount').value = model.paymentAmount;
						break;
					case 'Down payment':
						model.paymentAmount = Number(model.totals.discountedDailyPrice.toFixed(2));
						// document.getElementById('paymentAmount').value = model.paymentAmount;
						break;
					case 'Payment type...':
						model.paymentAmount = 0;
						// document.getElementById('paymentAmount').value = '';
						break;
				}
			});
		}



		function giveADiscount(user, courseId, discountName, discountTags, specialDiscountType) {
			// Check first if the user already had a discount before...
			// for(var d in model.discountedMembers){
			// 	if(model.discountedMembers[d].userId === userId){
			// 		model.giveADiscountError = 'This user already had a '+ model.discountedMembers[d].discountType + 'discount';
			// 	}
			// }
			// How to cancel the request????????????
			
			var discount = {};
			var userId = user._id;
			discount.userId = userId;
			discount.courseId = courseId;
			switch (discountName) {
				case 'special':
					discount.discountType = discountName;
					switch (specialDiscountType) {
						case 'special25':
							discount.discountTag = 'special25';
							discount.percentage = 0.75;
							break;
						case 'special50':
							discount.discountTag = 'special50';
							discount.percentage = 0.50;
							break;
						case 'special75':
							discount.discountTag = 'special75';
							discount.percentage = 0.25;
							break;
						case 'special100':
							discount.discountTag = 'special100';
							discount.percentage = 0;
							break;
					}
					break;

				case 'family':
					discount.discountType = discountName;
					discount.discountTag = discountTags.familyTag;
					discount.percentage = 0.9;
					break;
				case 'group':
					discount.discountType = discountName;
					discount.discountTag = discountTags.groupTag;
					discount.percentage = 0.9;
					break;
				case 'No discount':
					discount.discountType = discountName;
					discount.discountTag = discountName;
					discount.percentage = 1;
					break;
			}


			// call getTotals instead of hadDiscout()
			getTotals(user, courseId, function(totals) {
				var ids = {
					userId: userId,
					courseId: courseId
				};
				discount.courseDays = totals.newCourseDays;
				discount.discountedCoursePrice = ((model.courseDetails.price / model.courseDetails.courseDays.length) * discount.percentage) * discount.courseDays.length;
				discount.normalCoursePrice = (model.courseDetails.price / model.courseDetails.courseDays.length) * totals.newCourseDays.length;
				// Check if the user had frozen days to compensates
				for(var f in model.courseDetails.frozeMembers){
					if(model.courseDetails.frozeMembers[f].userId === user._id && model.courseDetails.frozeMembers[f].days.length >0 && model.courseDetails.frozeMembers[f].compensated == false){
						// Calculate the discounted daily price then multiply by frozenDays then deduct the number from the final discountedCoursePrice
						discount.discountedCoursePrice -= ((model.courseDetails.price / model.courseDetails.courseDays.length) * discount.percentage) * (model.courseDetails.frozeMembers[f].days.length);
						discount.normalCoursePrice -= ((model.courseDetails.price / model.courseDetails.courseDays.length) * discount.percentage) * (model.courseDetails.frozeMembers[f].days.length);
					}
				}
				if (discount.discountType !== 'No discount') {
					coursesService
						.addToDiscountedMembers(ids)
						.then(function(result) {
							if (result.data._id) {
								console.log('User Added...');
								model.giveADiscountError = false;
							} else {
								model.giveADiscountError = result.data;
							}
						});
					discount.normalCoursePrice = 0;
					userService
						.updateUserCourseParameters(discount)
						.then(function(result) {
							if (result.data._id) {
								console.log('User updated...');
								$route.reload();
							} else {
								model.giveADiscountError = result.data;
							}
						});
				} else {
					discount.discountedCoursePrice = 0;
					userService
						.updateUserCourseParameters(discount)
						.then(function(result) {
							if (result.data._id) {
								console.log('User updated...');
								$route.reload();
							} else {
								model.giveADiscountError = result.data;
							}
						});
				}

				for(var v in model.courseDetails.frozeMembers){
					if(model.courseDetails.frozeMembers[v].userId === user._id){
						removeFrozen(user._id, model.courseDetails._id, model.courseDetails.originalCourseId);						
					}
				}
			});
			
		}

		function removeFrozen(userId, courseId, originalCourseId){
			console.log(originalCourseId);
			ids = {userId: userId, courseId: courseId, originalCourseId: originalCourseId};
			coursesService
				.removeFrozen(ids)
				.then(function(result){
					console.log(result.data);
				});
		}

		function getUserPayments(user, courseId) {
			for (var e in user.userCourseParameters) {
				if (user.userCourseParameters[e].courseId === courseId) {
					return user.userCourseParameters[e].payments;
				}
			}
		}

		function getGrandTotals() {
			console.log(model.courseDetails);
			var grandTotal = 0;
			for (var i in model.courseDetails.registeredMembers) {
				grandTotal += getTotals(model.courseDetails.registeredMembers[i], model.courseDetails._id).totalOfPayments;
			}
			return grandTotal;
		}

		function getTotals(user, courseId, callBack) {
			var totals = {};
			var coursePrice = null;
			// var discountTag = null;
			totals.totalOfPayments = 0;
			// var discountType = null;
			var originalDailyPrice = model.courseDetails.price / model.courseDetails.courseDays.length;
			totals.originalDailyPrice = originalDailyPrice;
			var today = new Date();
			var daysPerWeek = model.courseDetails.daysPerWeek;

			// create course days array starting from the payment date
			courseDaysLoop:
				for (var d in model.courseDetails.courseDays) {
					// var dayInCourseDays = new Date(model.courseDetails.courseDays[d]);
					if (today <= new Date(model.courseDetails.courseDays[d])) {
						totals.newCourseDays = model.courseDetails.courseDays.slice(d);
						break courseDaysLoop;
					}
				}

			frozeMembersLoop:
				for(var z in model.courseDetails.frozeMembers){
					if(model.courseDetails.frozeMembers[z].userId == user._id){
						totals.userFrozeDetails = model.courseDetails.frozeMembers[z];
						break frozeMembersLoop;
					}
				}
			
			// calculating weeks
			totals.courseWeeks = Math.ceil(totals.newCourseDays.length / daysPerWeek.length);



			// Calculate the course price for user whom have a discount
			for (var e in user.userCourseParameters) {
				if (user.userCourseParameters[e].courseId === courseId) {
					totals.discountedDailyPrice = originalDailyPrice * user.userCourseParameters[e].percentage;
					// totals.fullCoursePrice = totals.discountedDailyPrice * totals.newCourseDays.length;
					if(user.userCourseParameters[e].normalCoursePrice >0){
						totals.fullCoursePrice = user.userCourseParameters[e].normalCoursePrice;
					}else{
						totals.fullCoursePrice = user.userCourseParameters[e].discountedCoursePrice;
					}
					// totals.courseNormalPrice = originalDailyPrice * totals.newCourseDays.length;
					totals.discountedWeeklyPrice = totals.fullCoursePrice / totals.courseWeeks;
					totals.discountType = user.userCourseParameters[e].discountType;
					totals.discountTag = user.userCourseParameters[e].discountTag;
					totals.userPayments = user.userCourseParameters[e].payments;
					for (var x in user.userCourseParameters[e].payments) {
						totals.totalOfPayments += JSON.parse(user.userCourseParameters[e].payments[x].amount);
					}
				}
			}

			totals.balance = totals.totalOfPayments - totals.fullCoursePrice;


			if (callBack) {
				callBack(totals);
			} else {
				model.userTotals = totals;
				return totals;
			}

			// for(var d in model.discountedMembers){
			// 	if(model.discountedMembers[d].userId === user._id){
			// 		coursePrice = model.courseDetails.price * model.discountedMembers[d].percentage;
			// 		discountType = model.discountedMembers[d].discountType; 
			// 		discountTag = model.discountedMembers[d].discountTag;
			// 	}
			// }


			// search for the user if he is in the discounted members then calculate the price and the balance
			// Calculate user's total of payments

			// for(var x in user.payments){
			// 	if(user.payments[x].courseId === courseId){
			// 		totalOfPayments+= JSON.parse(user.payments[x].paymentAmount);
			// 	}
			// }
			// if(coursePrice !== model.courseDetails.price){
			// 	return {coursePrice: coursePrice, discountType: discountType, discountTag: discountTag, total: totalOfPayments, balance: totalOfPayments-coursePrice};	
			// }else{
			// 	return {coursePrice: model.courseDetails.price, discountType: 'No discount.', discountTag: 'No discount', total: totalOfPayments, balance: totalOfPayments-model.courseDetails.price};
			// }


			// return totals;
		}



		// Check if user had a discount to disabled the discount button
		function hadDiscount(userId) {
			var hadIt = false;
			if (model.courseDetails.discountedMembers.indexOf(userId) !== -1) {
				hadIt = true;
			}
			return hadIt;
		}


		function makePayment(userId, courseId, paymentDate, paymentAmount) {
			var payment = {};
			payment.courseId = courseId;
			payment.userId = userId;
			payment.paymentDate = paymentDate;
			payment.paymentAmount = paymentAmount;
			userService
				.makePayment(payment)
				.then(function(result) {
					console.log('Payment done...');
					$route.reload();
				});
		}

		function getCourseFeedbacks() {
			return model.courseFeedbacks;
		}


		function countAttendance() {
			model.attendedM = 0;
			model.attendanceArray = [];
			var userFrozeToday = false;

			for (var m in model.courseDetails.registeredMembers) {
				// console.log(model.courseDetails.registeredMembers[m]);
				parametersLoop:
				for (var p in model.courseDetails.registeredMembers[m].userCourseParameters) {
					for (var h in model.courseDetails.registeredMembers[m].userCourseParameters[p]) {
						if (model.courseDetails.registeredMembers[m].userCourseParameters[p].courseId === model.courseDetails._id) {
							// Check if the user freeze for this day?
							checkFreeze:
							for(var j in model.courseDetails.registeredMembers[m].userCourseParameters[p].freezeDays){
								if(model.courseDetails.registeredMembers[m].userCourseParameters[p].freezeDays[j] === new Date().toDateString()){
									userFrozeToday = true;
									break parametersLoop;
								}
							}
							for (var a in model.courseDetails.registeredMembers[m].userCourseParameters[p].attendedDays) {
								if (model.courseDetails.registeredMembers[m].userCourseParameters[p].attendedDays.length === 0) {
									attended = false;
									break parametersLoop;
								} else if (model.courseDetails.registeredMembers[m].userCourseParameters[p].attendedDays[a].date === new Date().toDateString()) {
									attended = model.courseDetails.registeredMembers[m].userCourseParameters[p].attendedDays[a].attended;
									break parametersLoop;
								}
							}
						}
					}
					attended = false;
				}
				// console.log(!userFrozeToday);
				if(!userFrozeToday){
					model.attendanceArray.push({
						name: model.courseDetails.registeredMembers[m].name,
						userId: model.courseDetails.registeredMembers[m]._id,
						courseId: model.courseDetails._id,
						date: new Date().toDateString(),
						attended: attended
					});
				}
			}
			console.log(model.attendanceArray);
		}


		// function countAttendance(attendees){
		// 	model.attendedM = 0;
		// 	model.attendanceArray = [];

		// 	for(var m in model.courseDetails.registeredMembers){
		// 		model.attendanceArray.push({
		// 			courseId: model.courseDetails._id,
		// 			userId: model.courseDetails.registeredMembers[m]._id,
		// 			date: new Date().toDateString(),
		// 			attended: false
		// 		});
		// 	}


		// 	for(var n in model.attendanceArray){
		// 		for(var x in Object.keys(attendees)){
		// 			if(Object.keys(attendees)[x] === model.attendanceArray[n].userId){
		// 				model.attendanceArray[n].attended = attendees[Object.keys(attendees)[x]];
		// 				Object.keys(attendees).splice(x, 1);
		// 			}
		// 		}
		// 	}


		// 	for(var j in model.attendanceArray){
		// 		if(model.attendanceArray[j].attended === true){
		// 			model.attendedM+=1;
		// 		}
		// 	}
		// }



		// make it on the database
		function confirmAttendance(totalAttended) {
			console.log(totalAttended);
			userService
				.confirmAttendance(totalAttended)
				.then(function(result) {
					console.log(result);
				});
		}


		function getAttendance(attended) {
			var att = {};
			att.attended = attended.filter(function(a) {
				return a.attended === true;
			});
			att.missed = attended.filter(function(a) {
				return a.attended === false;
			});
			return att;
		}


		// get attendance report
		function attendanceReportCreater(user){
			var attReport = {
						attendedDays: [],
						attendedTotals: 0,
						missedTotals: 0
					};
			var para = user.userCourseParameters.filter(function(parameter){
				return parameter.courseId === model.courseDetails._id;
			});
			var attendedDays = para[0].attendedDays;
			
			for(var i in attendedDays){
				if(attendedDays[i].attended === true){
					attReport.attendedDays.push({date: attendedDays[i].date, attMiss: 'attended'});
					attReport.attendedTotals +=1;
				}else if(attendedDays[i].attended === false){
					attReport.attendedDays.push({date: attendedDays[i].date, attMiss: 'missed'});
					// attReport.missed.missedDates.push(attendedDays[i].date);
					attReport.missedTotals +=1;
				}
			}
			model.attendanceReport = attReport;
			return attReport;
		}



		function isUserFreezeToday(user){
			var frozeToday = true;
			for(var i in user.userCourseParameters){
				if(user.userCourseParameters[i].courseId === model.courseDetails._id){
					for(var j in user.userCourseParameters[i].freezeDays){
						if(user.userCourseParameters[i].freezeDays[j] === new Date().toDateString()){
							return frozeToday;
						}
					}
				}
			}
			frozeToday = false;
			return frozeToday;
		}


		// function isUserFreezeToday(user){
		// 	for(var i in user.userCourseParameters){
		// 		if(user.userCourseParameters[i].courseId === model.courseDetails._id){
		// 			for(var j in user.userCourseParameters[i].freezeDays){
		// 				if(user.userCourseParameters[i].freezeDays[j] === new Date().toDateString()){
		// 					return true;
		// 				}else{
		// 					return false;
		// 				}
		// 			}
		// 		}
		// 	}
		// }


		function prepareFreezeDays(user) {
			model.userUseFreezeBefore = false;
			// check if user already freeze before
			for (var p in user.userCourseParameters) {
				if (user.userCourseParameters[p].courseId === model.courseDetails._id) {
					if (user.userCourseParameters[p].freezeDays.length > 0) {
						model.userUseFreezeBefore = true;
						model.alreadyFrozeDays = user.userCourseParameters[p].freezeDays;
					}
				}
			}
			model.frozeDays = {};
			var t = user.userCourseParameters.filter(function(parameter) {
				return parameter.courseId === model.courseDetails._id;
			});
			model.daysToFreezeFrom = t[0].courseDays.filter(function(day) {
				return new Date(day) >= new Date();
			});
		}


		function freezeMember(userId, fullUserName, courseId, days) {
			// collect froze days
			var final = [];
			userFullName = fullUserName.firstName+' '+fullUserName.middleName+' '+fullUserName.lastName;
			// filter the selected days from the days
			for (var i in days) {
				if (days[i] === true) {
					final.push(i);
				}
			}
			var freezeObject = {
				userId: userId,
				userFullName: userFullName,
				courseId: courseId,
				days: final
			};
			// make it on DB
			userService
				.freezeMembership(freezeObject)
				.then(function(result) {
					console.log(result.data);
				});
			coursesService
				.addToFrozeMembers(freezeObject)
				.then(function(result){
					console.log(result.data);
				});
		}

		function getFrozeMembers() {
			// var froze = [];
			// for(var u in model.courseDetails.registeredMembers){
			// 	for(var p in model.courseDetails.registeredMembers[u].userCourseParameters){
			// 		if(model.courseDetails.registeredMembers[u].userCourseParameters[p].courseId === model.courseDetails._id && model.courseDetails.registeredMembers[u].userCourseParameters[p].freezeDays.length > 0){
			// 			froze.push({
			// 				userName: model.courseDetails.registeredMembers[u].name,
			// 				frozeDays: model.courseDetails.registeredMembers[u].userCourseParameters[p].freezeDays
			// 			});
			// 		}
			// 	}
			// }
			// console.log(model.frozeMembers)
			return model.frozeMembers;
		}


		// groupBy function to create summary
		// the parameters:
		// 		arrayOfObjects: array of objects to grouped by
		// 		filterProperty: property or key to filter of
		// 		sumsProperty: the property or key to accumulate for the summary
		function groupBy(arrayOfObjects, filterProperty, sumsProperty) {
			return arrayOfObjects.reduce(function(resultArray, oneObject) {
				var key = oneObject[filterProperty];
				if (!resultArray[key]) {
					resultArray[key] = 0;
				}
				resultArray[key] += oneObject[sumsProperty];
				return resultArray;
			}, {});
		}



		function prepareExpenses() {
			model.courseExpenses = model.courseDetails.expenses;
			var grouped = groupBy(model.courseExpenses, 'expenseType', 'expenseAmount');
			// console.log(grouped);
			model.expensesSummary = grouped;
			var totalExpenses = 0;
			for(var i in grouped){
				totalExpenses += grouped[i];
			}
			model.totalOfExpenses = totalExpenses;

			// console.log(model.courseExpenses);
			// var totals = {
			// 				expenses: 0,
			// 				salaryEx: 0,
			// 				hospitalityEx: 0,
			// 				rentalFees: 0,
			// 				miscEx: 0,
			// };
			// for(var i in model.courseExpenses){
			// 	totals.expenses += model.courseExpenses[i].expenseAmount;
			// 	switch(model.courseExpenses[i].expenseType){
			// 		case 'Salary':
			// 			totals.salaryEx += model.courseExpenses[i].expenseAmount;
			// 			break;
			// 		case 'Hospitality':
			// 			totals.hospitalityEx += model.courseExpenses[i].expenseAmount;
			// 			break;
			// 		case 'Rental fees':
			// 			totals.rentalFees += model.courseExpenses[i].expenseAmount;
			// 			break;
			// 		case 'Misc':
			// 			totals.miscEx += model.courseExpenses[i].expenseAmount;
			// 			break;
			// 	}
			// }
			// model.expensesSummary = totals;
			// console.log(totals);
		}


		function addExpense(expenses, expenseType) {
			var expense = {};

			expense.expenseDate = expenses.date;
			expense.expenseType = expenseType.name;
			expense.expenseDetails = expenses.details;
			expense.expenseAmount = JSON.parse(expenses.amount);
			expense.courseId = model.courseDetails._id;

			coursesService
				.addExpense(expense)
				.then(function(result) {
					console.log(result.data);
					document.getElementById('expensesForm').reset();
					$route.reload();
				});
		}


		function showPaidMembers(v){
			if(v){
				// console.log(model.courseDetails.registeredMembers)
				model.courseDetails.registeredMembers = model.paidMembers;
			}else{
				model.courseDetails.registeredMembers = model.unPaidMembers;
			}
		}


		function logout() {
			userService
				.logout()
				.then(function() {
					$location.url('/');
				});
		}


	}

})();