const {mongoose} = require("./../server/db/mongoose-connect");

const {User} = require("./../server/models/user");


var id = "5b702b46ccc631224001f3dc";

User.findById(id).then((doc) => {

	if(!doc){
		return console.log("err")
	}

	console.log(doc);

});