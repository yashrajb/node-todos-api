const request = require("supertest");
const expect = require("expect");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");

beforeEach((done) => {

	Todo.remove({}).then(() => {
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
			
			expect(result.length).toBe(1);
			expect(result[0].text).toBe(obj.text);
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
			
			expect(result.length).toBe(0);
			done();

		}).catch((err) => done(err));
			
		

		});




	});



});