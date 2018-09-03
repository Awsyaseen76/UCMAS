var mongoose = require('mongoose');

var eventsSchema = mongoose.Schema({
			name: String,
			category: String,
			subcategory: String,
			details: String,
			created: {type: Date, default: Date.now()},
			makerId: {type: mongoose.Schema.Types.ObjectId, ref: 'usersDB'},
			startingDate: Date,
			expiryDate: Date,
			daysPerWeek: [],
			eventDays: [],
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
			originalEventId: String,
			frozeMembers: [
								{
									_id: false, 
									userId: String,
									eventId: String,
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
}, {collection: 'events'});

module.exports = eventsSchema;