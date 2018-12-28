const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morganLogger = require('morgan');
const bodyParser = require('body-parser');

const listingsRouter = require('./routes/listingsRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();

if(!process.env.JWT_SECRET_KEY){
	console.error('FATAL ERROR: JWT_SECRET_KEY is not set in env vars');
	process.exit(1);
}
else{
	console.log('JWT_SECRET_KEY is set');
}

app.use(morganLogger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if(req.method === 'OPTIONS'){
		// Tell browsers what methods my api support
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter);

// Errors
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	})
});

module.exports = app;
