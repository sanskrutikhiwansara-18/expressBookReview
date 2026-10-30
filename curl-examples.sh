#!/usr/bin/env bash
# Run from final_project after `npm install` and `npm start`.
BASE_URL="${BASE_URL:-http://localhost:5000}"
COOKIE_JAR="cookies.txt"

# Task 2: all books
curl -i "$BASE_URL/"
# Task 3: ISBN lookup
curl -i "$BASE_URL/books/isbn/1"
# Task 4: author search
curl -i "$BASE_URL/books/author/Chinua%20Achebe"
# Task 5: title search
curl -i "$BASE_URL/books/title/Things%20Fall%20Apart"
# Task 6: initial review list
curl -i "$BASE_URL/review/1"
# Task 7: register a user (use a fresh username)
curl -i -X POST "$BASE_URL/customer/register" -H 'Content-Type: application/json' -d '{"username":"reader1","password":"readerpass"}'
# Task 8: login and save session cookie
curl -i -c "$COOKIE_JAR" -X POST "$BASE_URL/customer/login" -H 'Content-Type: application/json' -d '{"username":"reader1","password":"readerpass"}'
# Task 9: add or update review
curl -i -b "$COOKIE_JAR" -X PUT "$BASE_URL/customer/auth/review/1" -H 'Content-Type: application/json' -d '{"review":"A thoughtful and engaging book."}'
# Task 10: delete review
curl -i -b "$COOKIE_JAR" -X DELETE "$BASE_URL/customer/auth/review/1"
