const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var userSchema = new mongoose.Schema({
	email:{
		type:String,
		minlength:1,
		trim:true,
		unique:true,
		required:true,
		validate:{
			validator:validator.isEmail,
			message:(value) =>`${value} is not a valid phone number!`
		},
		
	},
	password:{
		type:String,
		minlength:6,
		trim:true,
		required:true
	},
	tokens:[{
		acess:{
			type:String,
			required:true,
			trime:true
		},
		token:{
			type:String,
			required:true,
			trim:true
		}
	}]
});

userSchema.methods.generateAuthToken = function() {
var user = this;
var access = 'auth';
var token = jwt.sign({_id:user._id,access},"123abc");
user.tokens.concat([{access,token}]);
return user.save().then(() => {
	return token;
});

}

userSchema.methods.toJSON = function(){

var user = this.toObject();

return _.pick(user,["_id","email"]);

}

var User = mongoose.model("User",userSchema);



module.exports = {
	User
}