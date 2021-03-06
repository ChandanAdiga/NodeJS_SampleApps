var express = require('express');
var path = require("path");
var routes = require('./routes/index');
var profile = require('./routes/profile');
var users = require('./routes/users');

var app = express();

app.set('views',path.join(__dirname,'./views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use('/',routes);
app.use('/profile',profile);
app.use('/users',users);

app.use(function(req, res, next) {
	var err = new Error('Not found');
	err.status = 404;
	err.message = "Page not found";
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error',{
		message:err.message,
		error:err
	});
});

module.exports = app;
