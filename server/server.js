require("./config/config");

const {mongoose} = require("./db/mongoose-connect");
const {User} = require("./models/user");
const {Todo} = require("./models/todo");
const {ObjectID} = require("mongodb");
const {authentication} = require("./middleware/auth");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const _ = require("lodash");

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.post("/todos",authentication,async (req,res) => {
	try {
		var todo = new Todo({
		...req.body,
		creator:req.user._id
	});
		let result = await todo.save();
		res.status(200).send(result);
	}catch(e){
		res.status(400).send(e);
	}

});

app.get("/todos",authentication,async (req,res) => {
	try {
		let result = await Todo.find({creator:req.user._id});
		res.status(200).send({result});
	}catch(e){
		res.status(400).send(e);
	}
});

app.get("/todos/:id",authentication,async (req,res) => {


	try{

		var id = req.params.id;
		if(!ObjectID.isValid(id)){
			throw new Error();
		}

		let result = await Todo.findOne({creator:req.user._id,_id:id});
		res.status(200).send(result);

	}catch(e) {
		res.status(400).send();
	}

	

});

app.delete("/todo/:id",authentication, async (req,res) => {

	try {
		var id = req.params.id;

		if(!ObjectID.isValid(id)){
				throw new Error();
		}

		const result = await Todo.findOneAndRemove({creator:req.user._id,_id:id});

		if(!result){
			throw new Error();
		}

		res.status(200).send(result);

	}catch(e){

		res.status(400).send();

	}
});


app.patch("/todo/:id",authentication,async (req,res) => {

	try{

		var id = req.params.id;

	if(!ObjectID.isValid(id)){
		throw new Error();
	}

	const body = _.pick(req.body,["text","completed"]);
	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	}else {
		body.completed = false;
		body.completedAt = null;
	}

let result = await Todo.findOneAndUpdate({creator:req.user,_id:id},{$set:body},{new:true})

if(!result){
	throw new Error();
}

res.status(200).send({result});

}catch(err) {
	res.status(400).send()

}


});




app.post('/users',async (req,res) => {

	try {

		var body = _.pick(req.body,["email","password"]);

		var newUser = new User({
			...body
		});

		let result = await newUser.save();
		let token = await result.generateAuthToken();

		res.status(200).header("x-auth",token).send(result);

	}catch(e) {
		res.status(400).send(e);
	}

});


app.post("/users/login",async (req,res) => {

try{

	var body = _.pick(req.body,["email","password"]);
	let result = await User.findByCrediantials(body.email,body.password);
	let token = await result.generateAuthToken();
	res.status(200).header("x-auth",token).send(result);

}catch(e){
	res.status(400).send();
}

});


app.get("/users/auth",authentication,(req,res) => {
	res.status(200).send(req.user);
});

app.delete("/me/logout",authentication,async (req,res) => {

	try {

		await req.user.removeToken(req.token);
		res.status(200).send();

	}catch(e) {

		res.status(400).send()	
	}
})


app.listen(port,() => {
	console.log(`server started in ${port}`);
});

module.exports = {
	app,
	User,
	Todo,
	ObjectID
}


