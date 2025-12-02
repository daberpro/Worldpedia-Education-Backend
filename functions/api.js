const express = require('express');
const serverless = require('serverless-http');
const { createApp } = require('../dist/app.js'); 

const app = express();
const r = express.Router();

r.get('/', (req, res) => {
    res.send('Hello from the root path!');
});

// OPTION 1: Test Router (Keep this if you just want to test "Hello")
// We mount it at both paths to be safe
app.use('/.netlify/functions/api', r); // Handles /api/ requests
app.use('/', r);                       // Handles local dev or direct root requests

// OPTION 2: Your Real App (Uncomment this when ready)
// app.use('/.netlify/functions/api', createApp());
// app.use('/', createApp());

module.exports.handler = serverless(app);