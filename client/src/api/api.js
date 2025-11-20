import axios from 'axios';

const SERVER = 'http://localhost:5001';

export const uploadFile = (formData) =>
  axios.post(`${SERVER}/api/upload`, formData);

export const analyzeTransactions = (transactions) =>
  axios.post(`${SERVER}/api/analyze`, { transactions });
