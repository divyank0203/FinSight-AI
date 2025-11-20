const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { parseFile } = require('../utils/parser');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file' });

    const records = await parseFile(file.path, file.originalname);
    // return parsed transactions (client will send them for analysis)
    res.json({ status: 'ok', transactions: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Parsing failed' });
  }
});

module.exports = router;
