const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: "Salutări de la server!" });
});

app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});

app.get('/api/curse', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clienti;');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Eroare la interogare');
  }
});
