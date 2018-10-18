const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const {
    check,
    validationResult
} = require('express-validator/check');

// Mongodb conection 
mongoose.connect('mongodb://localhost/nodeApp');
let db = mongoose.connection;

// Init app
const app = express();
// Bring models
let Article = require('./models/article');

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

// Get single article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        });
    });
});


// Add article route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add articles'
    });
});

// Add submit route
app.post('/articles/add', [
    check('title').isLength({
        min: 3
    }).trim().withMessage('Title required'),
    check('author').isLength({
        min: 1
    }).trim().withMessage('Author required'),
    check('body').isLength({
        min: 1
    }).trim().withMessage('Body required'),
], (req, res) => {
    let article = new Article({
        title: req.body.title,
        author: req.body.author,
        body: req.body.body
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.render('add_article', {
            article: article,
            errors: errors.mapped()
        })
    } else {
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        article.save((err) => {
            if (err) throw err;
            req.flash('success', 'Article Added');
            res.redirect('/');
        });
    }
});

// Load edit form
app.get('/articles/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

// Update submit form
app.post('/articles/edit/:id', (req, res) => {
    let article = {};

    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    };

    Article.update(query, article, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
});

app.delete('/article/:id', (req, res) => {
    let query = {
        _id: req.params.id
    };
    Article.remove(query, (err) => {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    })
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000...');
});