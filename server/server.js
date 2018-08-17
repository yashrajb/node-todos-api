require("./config/config");

const {mongoose} = require("./db/mongoose-connect");
const {User} = require("./models/user");
const {Todo} = require("./models/todo");
const {ObjectID} = require("mongodb");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const _ = require("lodash");

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.post("/todos",(req,res) => {

	var todo = new Todo(req.body);

	todo.save().then((result) => {
		res.status(200).send(result);
	}).catch((err) => res.status(400).send(err));

});

app.get("/todos",(req,res) => {


	Todo.find().then((result) => {

		res.status(200).send({result});

	}).catch((err) => res.status(400).send(err));
});

app.get("/todos/:id",(req,res) => {

	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(400).send();
	}

	Todo.findById(id).then((result) => {
		if(!result){
			return res.status(400).send();
		}
			res.status(200).send(result);
		
	}).catch((err) => res.status(400).send(err));

});

app.delete("/todo/:id",(req,res) => {
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(400).send("id is not valid");
	}
	Todo.findByIdAndRemove(id).then((result) => {
		if(!result){
			return res.status(400).send();
		}
		res.status(200).send(result);
	}).catch((err) => res.status(400).send());
});


app.patch("/todo/:id",(req,res) => {
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(400).send("id is not valid");
	}

	const body = _.pick(req.body,["text","completed"]);
	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();

	}else {

		body.completed = false;
		body.completedAt = null;

	}

Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((result) => {

if(!result){
	return res.status(400).send("error")
}

return res.status(200).send({result});

}).catch((err) => res.status(400).send());


});


app.post('/users',(req,res) => {


var body = _.pick(req.body,["email","password"]);

var newUser = new User({
	...body,
	tokens:[
		{
			acess:"auth",
			token:"123456789qwertyuiop"
		}
	]
});

newUser.save().then(() => {
	return newUser.generateAuthToken();
}).then((token) => {
	res.status(200).header("x-auth",token).send(newUser);
}).catch((err) => res.status(400).send(err));


});


app.listen(port,() => {
	console.log(`server started in ${port}`);
});

module.exports = {
	app,
	User,
	Todo,
	ObjectID
}


