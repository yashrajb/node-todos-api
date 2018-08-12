const {MongoClient,ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/todoApp",function(err,client){

	if(err){
		return console.log(err);
	}

	var db = client.db("todoApp");

	// db.collection("Users").deleteMany({name:"yashraj"}).then((err,doc) => {

	// 	if(err) {
	// 		return console.log(err);
	// 	}

	// 	console.log(doc.result.n);

	// })

	// db.collection("Users").deleteOne({name:"krutik"}).then((err,doc) => {

	// 	if(err) {
	// 		return console.log(err);
	// 	}

	// 	console.log(doc.result);


	// });

	// db.collection("Users").findOneAndDelete({_id:new ObjectID("5b6fe01197983d21042826e7"),name:"mike"})
	// .then((err,doc) => {
	// 	if(err) {
	// 		return console.log(err)
	// 	}

	// 	console.log(doc); 
	// })

})