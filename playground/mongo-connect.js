const {MongoClient} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/todoApp",function(err,client){

	if(err){
		return console.log(err);
	}

	const db = client.db("todoApp");

	// db.collection("todo").insertOne({
	// 	task:"learn node.js",
	// 	completed:true
	// }, function(err,result){

	// 	if(err){
	// 		return console.log(err);
	// 	}

	// 	console.log(result.ops);

	// })

	db.collection("Users").insertOne({
		name:"yashraj",
		age:19,
		location:"india"
	});

})