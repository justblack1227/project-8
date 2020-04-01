const express = require('express');
const router = express.Router();
const Book = require('../models').Book

function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
        await cb(req, res, next)
    } catch(error) {
        res.status(500).send(error)
    }
  }
}

// Home Route that redirects to All Books
router.get('/', (req, res) => {
  res.redirect('/books');
});

// GET Entire Book Listing
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: "Books"});
}));

//Create a new book entry form
router.get('/books/new', (req, res) => {
  res.render('new-book', { title: "New Book"});
})

//POST create a new book entry 
router.post('/books/new', asyncHandler(async (req, res) => {
  let book; 
  try {
    book = await Book.create(req.body);
    res.redirect('/books/' + book.id)
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("form-error", {book, errors: error.errors, title: "New Book"});
      res.end();
    } else {
      throw error;
    }
  }

}));

//GET a book entry
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', { book: book, title: book.title });
  } else {
    res.status('404');
    next();
  }
  
}));

//EDIT new info for a book
router.post('/books/:id',  asyncHandler(async (req, res, next) => {
  let book; 
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.status('404');
      next();
    } 
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-form-error", {book, errors: error.errors, title: "New Book"});
      res.end();
    } else {
      throw error;
    }
  }
}));

//DELETES book from entry 
router.post('/books/:id/delete', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.status('404');
    next();
  } 
}));

module.exports = router;
