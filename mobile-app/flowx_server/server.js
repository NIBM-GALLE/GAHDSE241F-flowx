require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Add your API routes here

app.listen(PORT, () => {
  console.log(`FlowX backend listening on http://0.0.0.0:${PORT}`);
});
