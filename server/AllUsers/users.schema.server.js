var mongoose = require('mongoose');

// var bcrypt   = require('bcrypt-nodejs');

var usersSchema = mongoose.Schema({
	userType: {
		type: String, 
		default: 'user' 
		// enum:['user', 'center', 'admin', 'superadmin']},
    },
	password: String,
	name:{
		firstName: String,
		middleName: String,
		lastName: String
	},
	email: String,
	profileImage: {
		type: {},
		default: {filename: "./public/img/profileImages/avatar.png"}
	},
	courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'coursesDB'}],
	registeredCoursesList: [{type: mongoose.Schema.Types.ObjectId, ref:'coursesDB'}],
	userCourseParameters: [
        {
            _id: false,
            courseId: String,
            discountType: String,
            discountTag: String,
            percentage: Number,
            courseDays: [String],
            discountedCoursePrice: Number,
            normalCoursePrice: Number,
            freezeDays: [String],
            payments: [
            	{
            		_id: false,
            		date: Date,
            		amount: Number
            	}
            ],
            attendedDays: [
            	{
            		_id: false,
            		date: String,
            		attended: Boolean	
            	}
            ],
            feedbacks: [
            	{
            		_id: false,
            		date: Date,
            		courseName: String,
            		feedback: String,
                    userId: String,
                    approved: Boolean
            	}
            ]
        }

	],
	google: {
        id: String,
        token: String
    },
    gender: String,
    DOB: Date,
    grade: String,
    school: String,
    // medical: {
    // 	medicalIssues: String,
    // 	problemDetails: String 
    // },
    contact:{
	    father:{
	    	name: String,
	    	phone: String
	    },
	    mother:{
	    	name: String,
	    	phone: String
	    },
	    emergency:{
	    	name: String,
	    	phone: String
	    },
	    phone1: String,
	    phone2: String
    },
    address: String,
    payments: [],
    attendedCourses: [],
    userFeedback: [],
    // totalOfPayments: [],
    notes: String,
    resetPasswordToken: String,
 	resetPasswordExpires: Date
}, {collection: 'users'});




// methods ======================
// generating a hash
// usersSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };


// checking if password is valid
// usersSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };



module.exports = usersSchema;