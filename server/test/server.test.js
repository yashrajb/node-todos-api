const request = require("supertest");
const expect = require("expect");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");

const seedData = [{
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