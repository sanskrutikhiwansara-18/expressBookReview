const express = require('express');
const router = express.Router();
const books = require('../data');

const users = [];

function isValid(username) {
  return typeof username === 'string' && username.trim().length > 0 && users.some((user) => user.username === username);
}

function authenticatedUser(username, password) {
  return users.some((user) => user.username === username && user.password === password);
}

// Register a new user.
router.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
  if (isValid(username)) return res.status(409).json({ message: 'User already exists' });
  users.push({ username, password });
  return res.status(201).json({ message: 'User successfully registered. You can now login.' });
});

// Login creates a session; session cookie is sent back to the caller.
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!authenticatedUser(username, password)) return res.status(401).json({ message: 'Invalid username or password' });
  req.session.username = username;
  return res.json({ message: 'Login successful', username });
});

function requireLogin(req, res, next) {
  if (!req.session || !req.session.username) return res.status(401).json({ message: 'User must log in first' });
  return next();
}

// Add or update the logged-in user's review.
router.put('/auth/review/:isbn', requireLogin, (req, res) => {
  const book = Object.values(books).find((item) => item.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const { review } = req.body || {};
  if (typeof review !== 'string' || !review.trim()) return res.status(400).json({ message: 'Review is required' });
  book.reviews[req.session.username] = review.trim();
  return res.json({ message: 'Review added/updated successfully', reviews: book.reviews });
});

// Delete the logged-in user's review.
router.delete('/auth/review/:isbn', requireLogin, (req, res) => {
  const book = Object.values(books).find((item) => item.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.reviews[req.session.username]) return res.status(404).json({ message: 'Review not found' });
  delete book.reviews[req.session.username];
  return res.json({ message: 'Review deleted successfully', reviews: book.reviews });
});

router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ message: 'Logout failed' });
    return res.json({ message: 'Logout successful' });
  });
});

module.exports = { router, users, isValid, authenticatedUser };
