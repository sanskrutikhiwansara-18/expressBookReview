const express = require('express');
const router = express.Router();
const books = require('../data');

const users = [];

function isValid(username) {
    return typeof username === 'string' &&
        users.some(user => user.username === username.trim());
}

function authenticatedUser(username, password) {
    return users.some(user =>
        user.username === username && user.password === password
    );
}

// Register user
router.post('/register', (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: 'User already exists' });
    }

    users.push({ username: username.trim(), password });

    res.status(201).json({
        message: 'User successfully registered. You can now login.'
    });
});

// Login user
router.post('/login', (req, res) => {
    const { username, password } = req.body || {};

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    req.session.username = username;

    res.json({ message: 'Login successful', username });
});

function requireLogin(req, res, next) {
    if (!req.session || !req.session.username) {
        return res.status(401).json({ message: 'User must log in first' });
    }
    next();
}

// Add or update review
router.put('/auth/review/:isbn', requireLogin, (req, res) => {
    const book = Object.values(books).find(
        item => String(item.isbn) === String(req.params.isbn)
    );

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    const { review } = req.body || {};

    if (typeof review !== 'string' || !review.trim()) {
        return res.status(400).json({ message: 'Review is required' });
    }

    book.reviews[req.session.username] = review.trim();

    res.json({
        message: 'Review added/updated successfully',
        reviews: book.reviews
    });
});

// Delete review
router.delete('/auth/review/:isbn', requireLogin, (req, res) => {
    const book = Object.values(books).find(
        item => String(item.isbn) === String(req.params.isbn)
    );

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!Object.prototype.hasOwnProperty.call(book.reviews, req.session.username)) {
        return res.status(404).json({ message: 'Review not found' });
    }

    delete book.reviews[req.session.username];

    res.json({
        message: 'Review deleted successfully',
        reviews: book.reviews
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.status(500).json({ message: 'Logout failed' });
        }

        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});

module.exports = { router, users, isValid, authenticatedUser };
