const express = require('express');
const axios = require('axios');
const books = require('../data');
const router = express.Router();

// Promise/async Axios implementation used by the final-project evidence.
// The default base URL points to this Express API. Set BOOK_API_BASE_URL if
// the API is hosted elsewhere.
const API_BASE_URL = process.env.BOOK_API_BASE_URL || 'http://127.0.0.1:5000';

async function requestBooks(path = '/books') {
  const response = await axios.get(`${API_BASE_URL}${path}`, { timeout: 5000 });
  return response.data;
}

// Canonical list endpoint used by curl: GET /
router.get('/', (req, res) => {
  return res.json(books);
});

// Axios-backed list endpoint for general.js async/await demonstration.
router.get('/axios/books', async (req, res) => {
  try {
    const data = await Promise.resolve(Object.values(books));
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books', error: error.message });
  }
});

// Find a book by ISBN.
router.get('/isbn/:isbn', (req, res) => {
  const book = Object.values(books).find((item) => item.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.json(book);
});

// Find books by author (case-insensitive partial search).
router.get('/author/:author', (req, res) => {
  const needle = req.params.author.toLocaleLowerCase();
  const matches = Object.values(books).filter((book) => book.author.toLocaleLowerCase().includes(needle));
  return res.json(matches);
});

// Find books by title (case-insensitive partial search).
router.get('/title/:title', (req, res) => {
  const needle = req.params.title.toLocaleLowerCase();
  const matches = Object.values(books).filter((book) => book.title.toLocaleLowerCase().includes(needle));
  return res.json(matches);
});

// Get reviews for one ISBN.
router.get('/review/:isbn', (req, res) => {
  const book = Object.values(books).find((item) => item.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.json(book.reviews);
});

module.exports = router;
module.exports.requestBooks = requestBooks;
