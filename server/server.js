const {mongoose} = require("./db/mongoose-connect");
const {User} = require("./models/user");
const {Todo} = require("./models/todo");
const {ObjectID} = require("mongodb");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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


app.listen(port,() => {
	console.log(`server started in ${port}`);
});

module.exports = {
	app,
	User,
	Todo,
	ObjectID
}