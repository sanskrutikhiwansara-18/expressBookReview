const express = require('express');
const axios = require('axios');
const books = require('../data');

const router = express.Router();
const API_BASE_URL = process.env.BOOK_API_BASE_URL || 'http://127.0.0.1:5000';

async function getAllBooks() {
    const response = await axios.get(`${API_BASE_URL}/books`);
    return response.data;
}

async function getBookByISBN(isbn) {
    const catalogue = await getAllBooks();
    return Object.values(catalogue).find(book => String(book.isbn) === String(isbn));
}

async function getBooksByAuthor(author) {
    const catalogue = await getAllBooks();
    return Object.values(catalogue).filter(
        book => book.author.toLowerCase().includes(author.toLowerCase())
    );
}

async function getBooksByTitle(title) {
    const catalogue = await getAllBooks();
    return Object.values(catalogue).filter(
        book => book.title.toLowerCase().includes(title.toLowerCase())
    );
}

router.get('/', (req, res) => res.json(books));

router.get('/isbn/:isbn', (req, res) => {
    const book = Object.values(books).find(book => String(book.isbn) === String(req.params.isbn));
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
});

router.get('/author/:author', (req, res) => {
    const result = Object.values(books).filter(
        book => book.author.toLowerCase().includes(req.params.author.toLowerCase())
    );
    res.json(result);
});

router.get('/title/:title', (req, res) => {
    const result = Object.values(books).filter(
        book => book.title.toLowerCase().includes(req.params.title.toLowerCase())
    );
    res.json(result);
});

router.get('/review/:isbn', (req, res) => {
    const book = Object.values(books).find(book => String(book.isbn) === String(req.params.isbn));
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book.reviews);
});

// Axios-based async/await routes
router.get('/axios/books', async (req, res) => {
    try {
        res.json(await getAllBooks());
    } catch (error) {
        res.status(502).json({ message: error.message });
    }
});

router.get('/axios/isbn/:isbn', async (req, res) => {
    try {
        const book = await getBookByISBN(req.params.isbn);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(502).json({ message: error.message });
    }
});

router.get('/axios/author/:author', async (req, res) => {
    try {
        res.json(await getBooksByAuthor(req.params.author));
    } catch (error) {
        res.status(502).json({ message: error.message });
    }
});

router.get('/axios/title/:title', async (req, res) => {
    try {
        res.json(await getBooksByTitle(req.params.title));
    } catch (error) {
        res.status(502).json({ message: error.message });
    }
});

module.exports = router;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
