// utils/pdfAiParser.js
const pdfParse = require('pdf-parse');
const axios = require('axios'); // if using HTTP to OpenAI, or use official SDK

async function parsePDFWithAI(buffer) {
  const data = await pdfParse(buffer);
  const fullText = data.text;

  // If the statement is long, chunk it (e.g., by pages)
  const chunks = chunkText(fullText, 4000); // chars approx

  let allTx = [];
  for (const chunk of chunks) {
    const txFromChunk = await callLLMForTransactions(chunk);
    allTx = allTx.concat(txFromChunk);
  }

  // Deduplicate / clean
  allTx = normalizeTransactions(allTx);

  return allTx;
}

function chunkText(text, maxChars) {
  const lines = text.split('\n');
  const chunks = [];
  let current = '';

  for (const line of lines) {
    if ((current + '\n' + line).length > maxChars) {
      chunks.push(current);
      current = line;
    } else {
      current += '\n' + line;
    }
  }
  if (current.trim()) chunks.push(current);
  return chunks;
}

async function callLLMForTransactions(textChunk) {
  const prompt = `
You are a bank statement parser.

You are given raw text from one part of a bank statement. Extract ONLY the actual transaction rows.

Return a JSON array. Each element: 
{ "date": "YYYY-MM-DD or original format", "description": "string", "amount": number, "type": "debit" or "credit" }

- Ignore headers, footers, running balances, opening/closing balances.
- Use minus sign or DR as debit, CR as credit.
- If not sure about a line, skip it.

Text:
"""${textChunk}"""
`;

  // Example using OpenAI Chat Completions with JSON-style output
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4.1-mini',  // or any model you pick
      messages: [
        { role: 'system', content: 'You output ONLY valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 800
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const content = res.data.choices?.[0]?.message?.content || '[]';

  try {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];
    // Ensure shape
    return parsed.map(t => ({
      date: t.date || '',
      desc: t.description || '',
      amount: Number(t.amount || 0)
    }));
  } catch (e) {
    console.error('Failed to parse LLM JSON for chunk', e);
    return [];
  }
}

function normalizeTransactions(arr) {
  // Basic cleanup: remove zero-amount rows, trim descriptions
  const seen = new Set();
  const out = [];

  for (const t of arr) {
    const key = `${t.date}|${t.desc}|${t.amount}`;
    if (!key.trim() || seen.has(key)) continue;
    seen.add(key);
    out.push({
      date: String(t.date || '').trim(),
      desc: String(t.desc || '').trim(),
      amount: Number(t.amount || 0)
    });
  }

  return out;
}

module.exports = { parsePDFWithAI };
