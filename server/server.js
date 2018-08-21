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
app.post("/todos",authentication,(req,res) => {

	var todo = new Todo({
		...req.body,
		creator:req.user._id
	});

	todo.save().then((result) => {
		res.status(200).send(result);
	}).catch((err) => res.status(400).send(err));

});

app.get("/todos",authentication,(req,res) => {


	Todo.find({
		creator:req.user._id
	}).then((result) => {

		res.status(200).send({result});

	}).catch((err) => res.status(400).send(err));
});

app.get("/todos/:id",authentication,(req,res) => {

	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(400).send();
	}

	Todo.findOne({
		creator:req.user._id,
		_id:id
	}).then((result) => {
		if(!result){
			return res.status(400).send();
		}
			res.status(200).send(result);
		
	}).catch((err) => res.status(400).send(err));

});

app.delete("/todo/:id",authentication,(req,res) => {
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(400).send("id is not valid");
	}
	Todo.findOneAndRemove({creator:req.user._id,_id:id}).then((result) => {
		if(!result){
			return res.status(400).send();
		}
		res.status(200).send(result);
	}).catch((err) => res.status(400).send());
});


app.patch("/todo/:id",authentication,(req,res) => {
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

Todo.findOneAndUpdate({creator:req.user,_id:id},{$set:body},{new:true}).then((result) => {

if(!result){
	return res.status(400).send("error")
}

return res.status(200).send({result});

}).catch((err) => res.status(400).send());


});




app.post('/users',(req,res) => {


var body = _.pick(req.body,["email","password"]);

var newUser = new User({
	...body
});

newUser.save().then(() => {
	return newUser.generateAuthToken();
}).then((token) => {
	res.status(200).header("x-auth",token).send(newUser);
}).catch((err) => res.status(400).send(err));


});


app.post("/users/login",(req,res) => {


var body = _.pick(req.body,["email","password"]);

User.findByCrediantials(body.email,body.password).then((user) => {
	return user.generateAuthToken().then((token) => {
		res.status(200).header("x-auth",token).send(user);
	})
}).catch((err) => res.status(400).send());


});


app.get("/users/auth",authentication,(req,res) => {
	res.status(200).send(req.user);
});

app.delete("/me/logout",authentication,(req,res) => {

	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}).catch((err) => res.status(400).send());

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


