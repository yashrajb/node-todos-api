const {User} = require("./../models/user");

const authentication = (req,res,next) => {

const token = req.header("x-auth");

User.findByToken(token).then((result) => {
	if(!result){
		return Promise.reject("document is not found");
	}
	req.token = token;
	req.user = result;
	next();
}).catch((err) => res.status(400).send("something happened wrong"));

}

module.exports = {
	authentication
}