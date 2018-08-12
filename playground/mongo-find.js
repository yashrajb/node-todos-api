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

	// db.collection("Users").insertMany([
	// {name:"krutik",age:19,location:"london"},
	// {name:"mike",age:20,location:"san fransico"},
	// {name:"yashraj",age:20,location:"america"},
	// {name:"yashraj",age:20,location:"africa"}
	// ]).then((err,doc) => {

	// 		if(err) {
	// 			return console.log(err)
	// 		}

	// 		console.log(doc.ops);

	// });

	db.collection("Users").find({name:"yashraj"}).count().then((err,doc)=>{

		if(err) {

			return console.log(err);
		}

		console.log(doc);

	})

})