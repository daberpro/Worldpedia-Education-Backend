const express = require('express');
const serverless = require('serverless-http');
// require() handles the path to your compiled app
const { createApp } = require('../dist/app.js'); 

const app = express();

// Mount the app created by your factory function
app.use('/.netlify/functions', createApp());

// Export the handler using module.exports
module.exports.handler = serverless(app);