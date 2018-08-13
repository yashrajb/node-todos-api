const {mongoose} = require("./db/mongoose-connect");
const {User} = require("./models/user");
const {Todo} = require("./models/todo");
const {ObjectID} = require("mongodb");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");


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

		res.status(400).send("err");
	}



	User.findById(id).then((result) => {
		if(!result){
			res.status(400).send("error");
		}else {
			res.status(200).send(result);
		}
	}).catch((err) => res.status(400).send(err));

});


app.listen(3000,() => {
	console.log("server started in 3000");
});

module.exports = {
	app,
	User,
	Todo
}