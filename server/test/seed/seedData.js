const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");
const {ObjectID} = require("./../../server");
const jwt = require("jsonwebtoken");

const userOne = new ObjectID();
const userTwo = new ObjectID();
const users = [
{

	_id:userOne,
	email:"basanyash627@gmail.com",
	password:"123abcdefg",
	tokens:[
		{
			access:"auth",
			token:jwt.sign({_id:userOne,access:"auth"},"123abc")
		}
	]
},
{
	_id:userTwo,
	email:"basankrutik@gmail.com",
	password:"123456789asdfghjk"
}
];

const seedData = [{
	_id:new ObjectID(),
	text:"learn AI",
	creator:userOne
}];

const populateTodos = (done) => {

	Todo.remove({}).then(() => {
		
		return Todo.insertMany(seedData)

	}).then(() => {
			done();
	})

}

const populateUsers = (done) => {

	User.remove({}).then(() => {
		var userOneObj = new User(users[0]).save();
		var userTwoObj = new User(users[1]).save();

		return Promise.all(["userOneObj","userTwoObj"]);
	}).then(() => done());

}


module.exports = {
	seedData,
	users,
	populateUsers,
	populateTodos


}