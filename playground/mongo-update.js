const {MongoClient,ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/todoApp",function(err,client){

	if(err){
		return console.log(err);
	}

	const db = client.db("todoApp");

	db.collection("Users").findOneAndUpdate({
		_id:new ObjectID("5b70011b8d1bac856cf4098d")
	},{

		$set:{
			"name":"yashraj"
		},

		$inc:{
			"age":1
		}
		
	}).then((result) => {
		console.log(result);
	})

})