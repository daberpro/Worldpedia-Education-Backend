const express = require('express');
const serverless = require('serverless-http');
const { createApp } = require('../dist/app.js'); 

const app = express();

// OPTION 1: Test Router (Keep this if you just want to test "Hello")
// We mount it at both paths to be safe
app.use('/.netlify/functions/api', createApp()); 

// OPTION 2: Your Real App (Uncomment this when ready)
// app.use('/.netlify/functions/api', createApp());
// app.use('/', createApp());

module.exports.handler = serverless(app);