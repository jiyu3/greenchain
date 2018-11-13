process.env.PORT = 55000
process.title = "gc-server"

let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let cors = require('cors')

let readRouter = require('./routes/read')

let app = express()

let whitelist = ['http://localhost:8101', 'https://manga.green']
let corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}
app.use(cors(corsOptions))
// app.use(cors())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
//app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static('blocks'));

app.use('/read', readRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.send("error")
})

module.exports = app
