const fs = require('fs');
const { parse } = require('csv-parse/sync');
const pdfParse = require('pdf-parse');

async function parseFile(filePath, originalName) {
  const ext = originalName.split('.').pop().toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (ext === 'csv' || ext === 'txt') {
    return parseCSV(buffer.toString('utf8'));
  } else if (ext === 'pdf') {
    return parsePDF(buffer);
  } else {
    throw new Error('Unsupported file type: ' + ext);
  }
}

/* -------------------------------
   CSV PARSER
-------------------------------- */
function parseCSV(content) {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true
  });

  return records.map(r => ({
    date: r.Date || r.date || r.TransactionDate || '',
    desc: r.Description || r.Narration || r.Details || '',
    amount: Number((r.Amount || r.amount || r.Value || '0').replace(/,/g, ""))
  }));
}

/* -------------------------------
   PDF PARSER (Option B)
   Regex + Table Detection
-------------------------------- */
async function parsePDF(buffer) {
  const data = await pdfParse(buffer);

  const lines = data.text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const tx = [];

  // Regex patterns for date detection
  const dateRegex =
    /\b(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2}|\d{2}\s+[A-Za-z]{3}\s+\d{4})\b/;

  // Regex for amount (DR/CR optional)
  const amountRegex =
    /(-?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(CR|DR)?\b/i;

  for (const line of lines) {
    const dateMatch = line.match(dateRegex);
    const amountMatch = line.match(amountRegex);

    // If both present in line → likely a transaction row
    if (dateMatch && amountMatch) {
      const date = dateMatch[1];
      const rawAmount = amountMatch[1].replace(/,/g, "");
      const sign = amountMatch[2]?.toUpperCase() === "CR" ? 1 : -1;
      const amount = Number(rawAmount) * sign;

      // Description is everything BETWEEN date and amount
      const desc = cleanDescription(
        line.replace(date, "").replace(amountMatch[0], "")
      );

      tx.push({ date, desc, amount });
    }
  }

  return tx;
}

/* -------------------------------
   Helper to clean descriptions
-------------------------------- */
function cleanDescription(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/(UPI|IMPS|NEFT)\s+REF.*$/i, "") // Remove long refs
    .trim();
}

module.exports = { parseFile };
