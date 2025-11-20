const express = require('express');
const cors = require('cors');
const path = require('path');

const uploadRoute = require('./routes/upload');
const analyzeRoute = require('./routes/analyze');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/upload', uploadRoute);
app.use('/api/analyze', analyzeRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`FinSight AI server listening on ${PORT}`));
