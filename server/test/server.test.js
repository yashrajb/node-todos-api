const request = require("supertest");
const expect = require("expect");
const {app,ObjectID} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {seedData,users,populateUsers,populateTodos} = require("./seed/seedData");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos",() => {

	it("shoudl create new todo",(done) => {

		var obj = {text:'Learn machine learning'};
		request(app).post("/todos")
		.set("x-auth",users[0].tokens[0].token)
		.send(obj)
		.expect((res) => {

			expect(res.body.text).toBe(obj.text);
			
		})
		.end((err,res) => {

			if(err){
				return done(err)
			}

		Todo.find().then((result) => {
			expect(result.length).toBe(2);
			expect(result[1].text).toBe(obj.text);
			done();

		}).catch((err) => done(err));
			


		});




	});


	it("should not create new todo",(done) => {

		
		request(app).post("/todos")
		.send({})
		.expect(400)
		.end((err,res) => {

			if(err){
				return done(err)
			}

		Todo.find().then((result) => {
			
			expect(result.length).toBe(1);
			done();

		}).catch((err) => done(err));
			
		

		});




	});



});

describe("GET /todos",() => {


	it('should get all todos',(done) => {

		request(app)
		.get("/todos")
		.set("x-auth",users[0].tokens[0].token)
		.expect(200)
		.end((err,res) => {

			if(err){
				return done(err)
			}

			Todo.find().then((doc) => {

				expect(doc.length).toBe(1);
				done();

			}).catch((err) => done(err));


		})


	});
});

describe('GET /todos/:id',() => {


	it('should get result on valid id',(done) => {


		request(app)
		.get(`/todos/${seedData[0]._id}`)
		.set("x-auth",users[0].tokens[0].token)
		.expect(200)
		.expect((result) => {
			expect(result.body).toBeTruthy();
		}).end(done);


	});

	it('should not get result on invalid id',(done) => {


		request(app)
		.get(`/todos/${seedData[0]._id}+'123'`)
		.expect(400)
		.expect((result) => {
			expect(result.body).toEqual({})
		}).end(done);


	});

	it('should not get result on invalid id',(done) => {


		request(app)
		.get(`/todos/123`)
		.expect(400)
		.expect((result) => {
			expect(result.body).toEqual({})
		}).end(done);


	});


});




describe('DELETE /todo/:id',() => {

	it("should be deleted and get result",(done) => {

		var id = seedData[0]._id;

		request(app)
		.delete(`/todo/${id}`)
		.set("x-auth",users[0].tokens[0].token)
		.expect((result) => {
			expect(result.body._id.toString()).toBe(id.toString());

		})
		.end((err,result) => {


			if(err) {
				return done(err); 
			}

			Todo.findById(id).then((doc) => {

				expect(doc).toBeFalsy();
				done();

			}).catch((err) => done(err));

		})



	});




	it("should be not be deleted and on invalid get result",(done) => {

		var id = new ObjectID().toString();


		request(app)
		.delete(`/todo/${id}`)
		.expect((result) => {
			
			expect(result.body).toEqual({});

		})
		.end((err,result) => {


			if(err) {
				return done(err); 
			}

			Todo.findById(id).then((doc) => {

				expect(doc).toBeFalsy();
				done();

			}).catch((err) => done(err));

		})



	});



it("should be not be deleted and on invalid get result",(done) => {

		var id = "12345";

		request(app)
		.delete(`/todo/${id}`)
		.expect((result) => {
			
			expect(result.body).toEqual({});

		})
		.end(done)



	});



});


describe('UPDATE /todo/:id',() => {


	it('should update the object',(done) => {


		var id = seedData[0]._id.toString();

		request(app)
		.patch(`/todo/${id}`)
		.set("x-auth",users[0].tokens[0].token)
		.send({
			completed:true
		})
		.expect(200)
		.expect((result) => {
			expect(result.body.result.completedAt).toBeTruthy();
		})
		.end(done);
	});

});

describe("GET /users/auth",() => {
	it('should return 200 with email and id',(done) => {

		request(app)
		.get("/users/auth")
		.set("x-auth",users[0].tokens[0].token)
		.expect(200)
		.expect((result)=>{
			expect(result.body._id).toBe(users[0]._id.toString());
			expect(result.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	it('should not return 200 with email and id',(done) => {

		request(app)
		.get("/users/auth")
		.expect(400)
		.expect((result)=>{
			expect(result.body).toEqual({});
		})
		.end(done);
	});
});

describe("GET /users/auth",() => {
	it('should return 200 with email and id',(done) => {

		request(app)
		.get("/users/auth")
		.set("x-auth",users[0].tokens[0].token)
		.expect(200)
		.expect((result)=>{
			expect(result.body._id).toBe(users[0]._id.toString());
			expect(result.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	it('should not return 200 with email and id',(done) => {

		request(app)
		.get("/users/auth")
		.expect(400)
		.expect((result)=>{
			expect(result.body).toEqual({});
		})
		.end(done);
	});
});



describe("POST /users",() => {
	it('should return 200 with email and id',(done) => {


		const data = {
			email:"basanyash777@gmail.com",
			password:"123456789"
		}

		request(app)
		.post("/users")
		.send(data)
		.expect(200)
		.expect((result)=>{
			expect(result.body._id).toBeTruthy();
			expect(result.body.email).toBe(data.email);
		})
		.end((err,result) => {
			if(err){
				return done(err);
			}

			User.findOne({email:data.email}).then((result) => {

				expect(result._id).toBeTruthy();
				expect(result.password).not.toBe(data.password);
				done();

			}).catch((err) => done(err));

		});
	});

	it('should not return 200 with email and id',(done) => {

		request(app)
		.post("/users")
		.send({})
		.expect(400)
		.end(done);
	});
});



describe("POST /users/login",() => {

	it('should return 200 with id and email',(done) => {
		request(app)
		.post("/users/login")
		.send({
			email:users[1].email,
			password:users[1].password
		})
		.expect(200)
		.expect((result) => {

			expect(result.body._id).toBe(users[1]._id.toString());
			expect(result.body.email).toBe(users[1].email);


		})
		.end(done);
	});

	it('should not return 200 with id and email',(done) => {
		request(app)
		.post("/users/login")
		.send({
			email:"basanyashjrutik@gmail.com",
			password:"123456789"
		})
		.expect(400)
		.end(done);
	});
});

describe("DELETE /me/logout",() => {






it("should return 200 with valid token",(done) => {


	request(app)
	.delete("/me/logout")
	.set("x-auth",users[0].tokens[0].token)
	.expect(200)
	.end((err,res) => {
		if(err){
			return done(err);
		}

		User.findOne({_id:users[0]._id}).then((result) => {

			expect(result.tokens.length).toBeFalsy();
			done();

		}).catch((err) => done(err));
	});

});



});















