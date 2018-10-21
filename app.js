const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

// Mongodb conection 
mongoose.connect('mongodb://localhost/nodeApp');
let db = mongoose.connection;

// Init app
const app = express();

// Check connection
db.once('open', () => {
    console.log('Connected to mongodb');
});

// Check for db errors
db.on('error', (err) => {
    console.log(err);
});

// Importing views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express sessions middleware
app.use(session({
    secret: 'mad cat',
    resave: true,
    saveUninitialized: true,
}));

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Home route
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Hello',
                articles: articles
            });
        }
    });
});

// Bring models
let Article = require('./models/article');

// Route files
const articles = require('./routes/articles.js');
app.use('/articles', articles);

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000...');
});