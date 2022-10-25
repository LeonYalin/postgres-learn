import { Express } from 'express';
import { main } from './src/learn/main';

const express = require('express');
const path = require('path');
require('dotenv').config();

const app: Express = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(process.env.NODE_DOCKER_PORT, () => {
  console.log(`app listening in port ${process.env.NODE_DOCKER_PORT}`);
  main();
});
