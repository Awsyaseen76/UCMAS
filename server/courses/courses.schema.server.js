var mongoose = require('mongoose');

var coursesSchema = mongoose.Schema({
			name: String,
			level: String,
			// subcategory: String,
			details: String,
			created: {type: Date, default: Date.now()},
			centerId: {type: mongoose.Schema.Types.ObjectId, ref: 'usersDB'},
			startingDate: Date,
			expiryDate: Date,
			daysPerWeek: [],
			courseDays: [],
			programDailyDetails: {},
			price: Number,
			images:{
				img750x450: {
					type: String,
					default: "http://placehold.it/750x450",
				},
				img1200x300: {
					type: String,
					default: "http://placehold.it/1200x300"
				}
			},
			approved: Boolean,
			special: Boolean,
			address: String,
			coordinates: [Number],
			registeredMembers: [{type: mongoose.Schema.Types.ObjectId, ref: 'usersDB'}],
			originalCourseId: String,
			frozeMembers: [
								{
									_id: false, 
									userId: String,
									courseId: String,
									userFullName: String,
									days: [],
									compensated: {type: Boolean, default: false}
								}
							],
			discountedMembers: [],
			expenses: [
						{
							_id: false,
							expenseDate: Date, 
							expenseType: String, 
							expenseDetails: String, 
							expenseAmount: Number
						}
					  ]
}, {collection: 'courses'});

module.exports = coursesSchema;