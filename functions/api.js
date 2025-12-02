import {createApp} from '../dist/app.js';
import express from 'express';
import serverless from 'serverless-http';

const app = express();
app.use('/.netlify/functions/api', createApp());
export const handler = serverless(app);