const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

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
		access:{
			type:String,
			required:true
		},
		token:{
			type:String,
			required:true
		}
	}]
});

userSchema.methods.generateAuthToken = function() {
var user = this;
var access = 'auth';
var token = jwt.sign({_id:user._id,access},process.env.JWT);
user.tokens.push({access,token});
return user.save().then(() => {
	return token;
});

}

userSchema.methods.toJSON = function(){

var user = this.toObject();
return _.pick(user,["_id","email"]);

}

userSchema.methods.removeToken = function(token){
	var user = this;
	return user.update({
		$pull:{
			tokens:{
				token:token
			}
		}
	});
}


userSchema.statics.findByToken = function(token){
	var user = this;
	var decoded;
	try{
		decoded = jwt.verify(token,process.env.JWT);
	}catch(err) {
		return Promise.reject("token is changed");
	}
	return user.findOne({
		_id:decoded._id,
		"tokens.token":token,
		"tokens.access":"auth"
	});
}

userSchema.statics.findByCrediantials = function(email,password){

var user = this;

return user.findOne({email:email}).then((result) => {


	if(!result){
		return Promise.reject();
	}

return new Promise((resolve,reject) => {

		 bcrypt.compare(password,result.password,(err,doc) => {

		 	if(doc){
		 		resolve(result);
		 	}else {
		 		reject();
		 	}


		 })


	})


})

}

userSchema.pre('save',function(next){
	var user = this;
	if(user.isModified('password')) {
		bcrypt.genSalt(10,(err,result) => {
			bcrypt.hash(user.password,result,(err,hash)=>{
					user.password = hash;
					next();
			})
		})
	}else {
		next();
	}
});

var User = mongoose.model("User",userSchema);



module.exports = {
	User
}