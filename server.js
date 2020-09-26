var express = require('express')
var app = express()
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv');
var exphbs = require('express-handlebars')
const http = require("http").Server(app);
const io = require("socket.io")(http);
var path = require('path');
const port = process.env.PORT || 5000;
 
//For BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
 
 
// For Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
 
 
io.on("connection", function(socket) {

    socket.on("user_join", function(data) {
        this.username = data;
        socket.broadcast.emit("user_join", data);
    });

    socket.on("chat_message", function(data) {
        data.username = this.username;
        socket.broadcast.emit("chat_message", data);
    });

    socket.on("disconnect", function(data) {
        socket.broadcast.emit("user_leave", this.username);
    });
});
//For Handlebars

app.engine('hbs', exphbs({
	defaultLayout: '',
    extname: '.hbs',
    partialsDir: [
        'app/views'
        ]
    }));
app.set('view engine', 'hbs');
app.set('views', path.normalize("app/views"));
 
 
 
app.get('/', function(req, res) {
 
    res.redirect('signin');
 
});
 
//Models
var models = require("./app/models");
 
//Routes
 
var authRoute = require('./app/routes/auth.js')(app, passport);
 
 
//load passport strategies
 
require('./app/config/passport/passport.js')(passport, models.user);
 
 
//Sync Database
 
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
});
http.listen(port, function() {
    console.log("Listening on *:" + port);
});
