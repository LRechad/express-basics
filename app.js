const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

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
            article:article
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
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
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
