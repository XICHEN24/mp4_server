// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user');
var Task = require('./models/task');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect('mongodb://cs498:cs498@ds023500.mlab.com:23500/cs498xichen');

//mongoose.connect('mongodb://localhost/mp4');
// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello xixi!' });
});

//Llama route
var userRoute = router.route('/users');
var taskRoute = router.route('/tasks');
/*
llamaRoute.get(function(req, res) {
  res.json([{ "name": "alice", "height": 12 }, { "name": "jane", "height": 13 }]);
});
*/

userRoute.post(function(req,res){
	var user = new User();
	user.name = req.body.name;
	user.email = req.body.email;
	//user.pendingTasks = req.body.pendingTasks;
	user.dateCreated = new Date().toISOString();

	user.save(function(err){
		if(err!=null && err.message == "User validation failed"){
			var Message =''
			var i =0;
			for (var i in err.errors){
				if(i!=0){
					Message = Message + err.errors[i];
					i=i+1;
				}
			}
			res.status(500).send({message:Message,data:[]});	
		}
		else if(err!=null && err.code == 11000){
			res.status(500).send({message: "duplicate email",data:[]});
		}
		else if(err){
			res.status(500).send({message:'Something broke!',data:[]});
		}	
		else
			res.status(201).send({message: 'user added to the database',data:user});
			//res.json({message: 'user added to the database',data:user});
		
	});
})
.options(function(req, res){
      res.writeHead(200);
      res.end();
});

taskRoute.post(function(req,res){
	var task = new Task();
	task.name = req.body.name;
	task.description = req.body.description;
	task.deadline = req.body.deadline;
	task.completed = req.body.completed;
	task.assignedUser = req.body.assignedUser;
	task.assignedUserName = req.body.assignedUserName;
	task.dateCreated = new Date().toISOString();

	task.save(function(err){
		if(err!=null &&err.message == "Task validation failed"){
			var Message =''
			var i =0;
			for (var i in err.errors){
				if(i!=0){
					Message = Message + err.errors[i];
					i=i+1;
				}
			}
			res.status(500).send({message:Message,data:[]});	
		}
		else if(err){
			res.status(500).send({message:'Something broke!',data:[]});
		}	
		else{
			res.status(201).send({message: 'task added to the database',data:task});
		}
		//res.json({message: 'task added to the database',data:task});
	});
})
.options(function(req, res){
      res.writeHead(200);
      res.end();
});

router.route('/users')
	.get(function(req,res){
		var sort = eval("("+req.query.sort+")");
		var where = eval("("+ req.query.where + ")");
		var select = eval("("+ req.query.select + ")");
		var limit = eval("("+ req.query.limit + ")");
		var skip = eval("("+ req.query.skip + ")");
		var count = eval("("+ req.query.count + ")");
		if (count==true){
			User.find(where).sort(sort).limit(limit).skip(skip).count(count).select(select).exec(function(err, user){
				if(err){
					res.status(500).send({message:'Something broke!',data:[]});
					//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
					//res.send(err);
				}
				else if(user == undefined){
					res.status(404).send({message:"Sorry, we cannot find that",data:[]});
				}
				else
					res.json({message: 'OK', data:user});
			})
		}
		else{
			User.find(where).sort(sort).limit(limit).skip(skip).select(select).exec(function(err, user){
				if(err){
					res.status(500).send({message:'Something broke!',data:[]});
					//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
				}
				else if(user == undefined){
					res.status(404).send({message:"Sorry, we cannot find that",data:[]});
				}
				else{	//res.send(err);
					res.json({message: 'OK', data:user});
				}
			});
		};	
	});
router.route('/tasks')
	.get(function(req,res){
		var sort = eval("("+req.query.sort+")");
		var where = eval("("+ req.query.where + ")");
		var select = eval("("+ req.query.select + ")");
		var limit = eval("("+ req.query.limit + ")");
		var skip = eval("("+ req.query.skip + ")");
		var count = eval("("+ req.query.count + ")");
		if (count==true){
			Task.find(where).sort(sort).limit(limit).skip(skip).count(count).select(select).exec(function(err, task){
				if(err){
					res.status(500).send({message:'Something broke!',data:[]});
				}
				else if (task==undefined){
					res.status(404).send({message:"Sorry, we cannot find that",data:[]});
					//res.send(err);
				}
				else{
					res.json({message: 'OK', data:task});
				}
			})
		}
		else{
			Task.find(where).sort(sort).limit(limit).skip(skip).select(select).exec(function(err, task){
				if(err){
					res.status(500).send({message:'Something broke!',data:[]});
					//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
				}
				else if(task == undefined){
					res.status(404).send({message:"Sorry, we cannot find that",data:[]});
				}
				else{	//res.send(err);
					res.json({message: 'OK', data:task});
				}
			});
		};	
	});

router.route('/users/:user_id')
	.get(function(req,res){
		User.findById(req.params.user_id, function(err, user){
			//console.log(user);
			if(err){
				//console.log(err.name);
				//res.send(err);
				res.status(500).send({message:'Something broke!',data:[]});
				//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
			else if(user == undefined){
				res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
			else{
				res.json({message: 'OK', data:user});
			}
		});
	})
	.put(function(req,res){
		User.findById(req.params.user_id, function(err, user){

			if(err){
				//console.log(err.name);
				res.status(500).send({message:'Something about find broke!',data:[]});
				//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
				//res.send(err);
			user.name = req.body.name;
			user.email = req.body.email;
			user.pendingTasks = req.body.pendingTasks;
			user.dateCreated = new Date().toISOString();

			user.save(function(err){
				if(err){
					res.status(500).send({message:'Something broke!',data:[]});
					//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
				}
				else{	//res.send(err);
					res.json({message: 'User updated!', data:user});
				}
			});
		});
	})
	.delete(function(req, res){
		//console.log(req)
		User.remove({
			_id: req.params.user_id
		}, function(err, user){
			//console.log(req.params.user_id);
			
			if(err){
				res.send(err);
				//res.status(500).send({message:'Something broke!',data:[]});
				//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
			
			//else if (User.isNullOrUndefined){
			else if(user.result.n == 0){
				res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
			else{	//res.send(err);
				res.json({message: 'Successfully deleted',data:user});
			}
		});
	});

router.route('/tasks/:task_id')
	.get(function(req,res){
		Task.findById(req.params.task_id, function(err, task){
			if(err){
				res.status(500).send({message:'Something broke!',data:[]});
				//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
			else if(task.result.n === 0){
				res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
			else{
				res.json({message: 'OK', data:task});
			}
		});
	})
	.put(function(req,res){
		Task.findById(req.params.task_id, function(err, task){

			if(err){
				res.status(500).send({message:'Something about find broke!',data:[]});
				//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
				//res.send(err);

			task.name = req.body.name;
			task.description = req.body.description;
			task.deadline = req.body.deadline;
			task.completed = req.body.completed;
			task.assignedUser = req.body.assignedUser;
			task.assignedUserName = req.body.assignedUserName;
			task.dateCreated = new Date().toISOString();	

			task.save(function(err){
				if(err!=null && err.message == "Task validation failed"){
				var Message =''
				var i =0;
					for (var i in err.errors){
						if(i!=0){
							Message = Message + err.errors[i];
							i=i+1;
						}
					}
				res.status(500).send({message:Message,data:[]});	
				}
				else if(err!=null && err.code == 11000){
					res.status(500).send({message: "duplicate email",data:[]});
				}
				else if(err){
					res.status(500).send({message:'Something broke!',data:[]});
				}	
				else{
						res.json({message: 'User updated!', data:task});
				}	//res.send(err);
					
			});
		});
	})
	.delete(function(req, res){
		Task.remove({
			_id: req.params.task_id
		}, function(err, task){
			if(err){
				//res.send(err);
				res.status(500).send({message:'Something broke!',data:[]});
				//res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
			else if(task.domain == undefined){
				res.status(404).send({message:"Sorry, we cannot find that",data:[]});
			}
			else{	//res.send(err);
				res.json({message: 'Successfully deleted',data:[]});
			}	
		});
	});
/*
userRoute.delete(function(req,res){
	User.findByIdAndRemove(req.params.user_id,function(err){

		if(err)
			res.send(err);
		res.json({message: 'User deleted from the database'});
	});
});
*/
/*
				console.log(err);
				if(err.status == 404){
					console.log("There was error");
					ret_obj = {}
					ret_obj["message"] = "Sorry, we cannot find that";
					ret_obj["data"] = [];
					res.status(404);
					res.json(ret_obj);
				}
				else if(err.status == 500){
					res.send('server error')
				} 
				*/
				//res.send(err);
//Add more routes here

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
