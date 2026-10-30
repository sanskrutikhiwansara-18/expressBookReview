const express = require('express');
const session = require('express-session');
const booksRouter = require('./router/booksdb');
const generalRouter = require('./router/general');
const authUsers = require('./router/auth_users');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'express-book-review-development-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' },
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/books', booksRouter);
app.use('/', generalRouter);
app.use('/customer', authUsers.router);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.listen(PORT, () => console.log(`Express Book Review API listening on port ${PORT}`));
