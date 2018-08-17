const {SHA256} = require("crypto-js");
const jwt = require('jsonwebtoken');

// const message = "Hello i am yashraj";
// console.log(SHA256(message).toString());

// var data = {
// 	id:4
// }

// console.log(SHA256(JSON.stringify(data)).toString() === SHA256(data).toString());

var data = {
	id:5
}
const token = jwt.sign(data,"123abc").toString();
console.log(typeof token);
const decoded = jwt.verify(token,"123abc");
console.log(decoded.id === data.id );