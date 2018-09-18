const express = require('express');
const path = require('path');

const app = express();

// Importing views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Home route
app.get('/', (req, res) => {
    let articles = [
        {
            id: 1,
            title: 'Article one', 
            body: 'Article one content',
            author: 'Rechad Locate'
        },
        {
            id: 2,
            title: 'Article two', 
            body: 'Article two content',
            author: 'Nazim Locate'
        },
        {
            id: 3,
            title: 'Article three', 
            body: 'Article three content',
            author: 'Ibrahim Locate'
        }
    ];
    res.render('index', {
        title: 'Hello',
        articles: articles
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
