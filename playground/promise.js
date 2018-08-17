const jwt = require('jsonwebtoken');


var data = {
	id:6
};

const promise = new Promise((resolve,reject) => {

let token = jwt.sign(data,"123abcd");
let decoded = jwt.verify(token,"123abcd");

if(data.id === decoded.id) {

	return resolve(token);

}

	return reject("error");



});

promise.then((data) => {
	return data;
}).then((data) => {

	console.log(data+"1234");

}).catch((err) => console.log(err));