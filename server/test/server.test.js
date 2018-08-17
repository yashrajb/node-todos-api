const request = require("supertest");
const expect = require("expect");
const {app,ObjectID} = require("./../server");
const {Todo} = require("./../models/todo");

const seedData = [{
	_id:new ObjectID(),
	text:"learn AI"
}
];

beforeEach((done) => {

	Todo.remove({}).then(() => {
		
		return Todo.insertMany(seedData)

	}).then(() => {
			done();
	})

})

describe("POST /todos",() => {

	it("shoudl create new todo",(done) => {

		var obj = {text:'Learn machine learning'};
		request(app).post("/todos")
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

		request(app).get("/todos")
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
		.expect(200)
		.expect((result) => {
			expect(result.body.text).toBe(seedData[0].text);
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

		var id = seedData[0]._id.toString();

		request(app)
		.delete(`/todo/${id}`)
		.expect((result) => {
			expect(result.body._id.toString()).toBe(id);

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
		.send({
			completed:true
		})
		.expect(200)
		.expect((result) => {
			expect(result.body.result.completedAt).toBeTruthy();
		})
		.end(done);







	})












});

























