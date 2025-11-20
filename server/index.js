require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const uploadRoute = require('./routes/upload');
const analyzeRoute = require('./routes/analyze');

const app = express();
app.use(cors());
app.use(express.json());

// Static uploads folder for demo
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/upload', uploadRoute);
app.use('/api/analyze', analyzeRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`TX server listening on ${PORT}`));
