const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

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

// Add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add articles'
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000...');
});
