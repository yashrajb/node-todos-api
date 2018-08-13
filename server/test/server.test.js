const request = require("supertest");
const expect = require("expect");
const {app,ObjectID} = require("./../server");
const {Todo} = require("./../models/todo");

const seedData = [{
	_id:new ObjectID(),
	text:"learn AI"
},
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