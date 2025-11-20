const fs = require('fs');
const csvParse = require('csv-parse/lib/sync');
const pdfParse = require('pdf-parse');

async function parseFile(filePath, originalName) {
  const ext = originalName.split('.').pop().toLowerCase();
  const buffer = fs.readFileSync(filePath);
  if (ext === 'csv' || ext === 'txt') {
    const content = buffer.toString('utf8');
    const records = csvParse(content, { columns: true, skip_empty_lines: true });
    // map to common format
    return records.map(r => ({
      date: r.Date || r.date || r.TransactionDate || '',
      desc: r.Description || r.Narration || r.Description1 || '',
      amount: Number(r.Amount || r.amount || r.Value || 0)
    }));
  } else if (ext === 'pdf') {
    const data = await pdfParse(buffer);
    const lines = data.text.split('\n').map(l => l.trim()).filter(Boolean);
    const tx = [];
    // very naive: look for lines that contain a date and an amount
    for (const line of lines) {
      const dateMatch = line.match(/\b(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})\b/);
      const amtMatch = line.match(/(-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/);
      if (dateMatch && amtMatch) {
        tx.push({
          date: dateMatch[0],
          desc: line.replace(dateMatch[0], '').replace(amtMatch[0], '').trim(),
          amount: Number(amtMatch[0].replace(/,/g, ''))
        });
      }
    }
    return tx;
  } else {
    throw new Error('Unsupported file type');
  }
}

module.exports = { parseFile };
