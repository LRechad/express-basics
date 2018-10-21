const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');


// Bring models
let Article = require('../models/article');

// Add article route
router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Add articles'
    });
});

// Add submit route
router.post('/add', [
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
        // console.log(errors);
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
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

// Update submit form
router.post('/edit/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

// Get single article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        });
    });
});

module.exports = router;