const env = process.env.NODE_ENV || "development";

if(env==="development" || env==="test")
{
	var config = require("./config.json");
	var envConfig = config[env];

	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	});
}

// if(env==="development"){

// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoApp";
// }else if(env==="test"){
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoTestApp";
// }
