const express = require('express');
const cors = require('cors');
//const fetch = require('node-fetch');
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



const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'proiect_pw',
  password: 'parola123',
  port: 5432,
});

// Aici vine ruta pentru înregistrare:
app.post('/api/register', async (req, res) => {
  const {
    username,
    email,
    parola,
    telefon,
    rol,
    companie,
    oras,
    masini,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO users (username, email, parola, telefon, rol, companie, oras, masini)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [username, email, parola, telefon, rol, companie, oras, masini]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Eroare la înregistrare' });
  }
});



app.post('/api/login', async (req, res) => {
  const { email, parola } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND parola = $2',
      [email, parola]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        rol: user.rol,
        telefon: user.telefon,
        companie: user.companie,
        oras: user.oras,
        masini: user.masini
      }
    });
  } catch (err) {
    console.error('Eroare la login:', err);
    res.status(500).json({ success: false, message: 'Eroare la login' });
  }
});



// app.get('/api/users/:username', async (req, res) => {
//   const { username } = req.params;
  

//   try {
//     const result = await pool.query(
//       'SELECT email, telefon FROM users WHERE username = $1',
//       [username]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
//     }

//     const user = result.rows[0];
//     res.json({
//       email: user.email,
//       telefon: user.telefon
//     });
//   } catch (err) {
//     console.error('Eroare la preluarea utilizatorului:', err);
//     res.status(500).json({ message: "Eroare server" });
//   }
// });



app.get('/api/locatii', async (req, res) => {
  try {
    const result = await pool.query('SELECT nume, adresa FROM locatii');
    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la obținerea locațiilor:", err);
    res.status(500).json({ message: "Eroare la server" });
  }
});



app.post('/api/locatii/add', async (req, res) => {
  const { nume, adresa } = req.body;

  try {
    await pool.query(
      'INSERT INTO locatii (nume, adresa) VALUES ($1, $2)',
      [nume, adresa]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la inserare locație:", err);
    res.status(500).json({ success: false });
  }
});




app.delete('/api/locatii/delete', async (req, res) => {
  const { nume, adresa } = req.body;

  try {
    const result = await pool.query(
      'DELETE FROM locatii WHERE nume = $1 AND adresa = $2 RETURNING *',
      [nume, adresa]
    );

    if (result.rowCount === 0) {
      return res.json({ success: false, message: "Locația nu a fost găsită" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la ștergere locație:", err);
    res.status(500).json({ success: false });
  }
});




app.get('/api/locatii/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT idlocatie, nume, adresa FROM locatii');
    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la preluarea locațiilor:", err);
    res.status(500).json({ message: "Eroare server" });
  }
});


//ADAUGA AUTOCAR

app.post('/api/autocar/add', async (req, res) => {
  const { tip, numar_locuri, idplecare, idsosire, numar_inmatriculare } = req.body;
  console.log("Date primite:", req.body);

  try {
    await pool.query(
      `INSERT INTO transport (tip, numar_locuri, idplecare, idsosire, numar_inmatriculare)
       VALUES ($1, $2, $3, $4, $5)`,
      [tip, numar_locuri, idplecare, idsosire, numar_inmatriculare]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la inserare autocar:", err);
    res.status(500).json({ success: false });
  }
});



//CAUTA CURSELE CA SA LE INTRODUCI ORA

app.get('/api/autocare-disponibile', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.idtransport, t.numar_inmatriculare, l1.nume AS plecare_oras, l2.nume AS destinatie_oras
      FROM transport t
      JOIN locatii l1 ON t.idplecare = l1.idlocatie
      JOIN locatii l2 ON t.idsosire = l2.idlocatie
      LEFT JOIN ora_plecare o ON t.idtransport = o.idtransport
    `);
    res.json(result.rows);
    console.log("Autocare disponibile:", result.rows);
  } catch (err) {
    console.error("Eroare la obținerea autocarelor disponibile:", err);
    res.status(500).json({ message: "Eroare la server" });
  }
});



//ADAUGA CURSA CU ORA DE PLECARE

app.post('/api/adauga-cursa', async (req, res) => {
  const { autocarId, oraPlecare } = req.body;

  try {
    await pool.query(
      `INSERT INTO ora_plecare (idtransport, ora) VALUES ($1, $2)`,
      [autocarId, oraPlecare]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la adăugarea orei de plecare:", err);
    res.status(500).json({ success: false });
  }
});

//STERGE AUTOCARUL

app.delete('/api/autocar/:id', async (req, res) => {
  const { id } = req.params; // Preia ID-ul autocarului din URL

  try {
    // Șterge înregistrările din tabela ora_plecare care fac referire la acest autocar
    await pool.query('DELETE FROM ora_plecare WHERE idtransport = $1', [id]);

    // Șterge autocarul din tabela transport
    const result = await pool.query('DELETE FROM transport WHERE idtransport = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.json({ success: false, message: "Autocarul nu a fost găsit" });
    }

    res.json({ success: true, message: "Autocar șters cu succes!" });
  } catch (err) {
    console.error("Eroare la ștergerea autocarului:", err);
    res.status(500).json({ success: false });
  }
});


//cauta cursele de sters

app.get('/api/curse-de-sters', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        t.idtransport AS id,
        t.numar_inmatriculare,
        l1.nume AS plecare,
        l2.nume AS sosire,
        o.ora
      FROM transport t
      LEFT JOIN locatii l1 ON t.idplecare = l1.idlocatie
      LEFT JOIN locatii l2 ON t.idsosire = l2.idlocatie
      LEFT JOIN ora_plecare o ON t.idtransport = o.idtransport
      where o.idtransport is not null
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la obținerea curselor de șters:", err);
    res.status(500).json({ message: "Eroare la server" });
  }
});




//sterge cursa din ora_plecare

app.delete('/api/sterge-cursa/:id', async (req, res) => {
  const { id } = req.params; // Preia ID-ul cursei din URL

  try {
    // Șterge cursa din tabela ora_plecare
    const result = await pool.query('DELETE FROM ora_plecare WHERE idtransport = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.json({ success: false, message: "Cursa nu a fost găsită" });
    }

    res.json({ success: true, message: "Cursa a fost ștearsă cu succes!" });
  } catch (err) {
    console.error("Eroare la ștergerea cursei:", err);
    res.status(500).json({ success: false, message: "Eroare la server" });
  }
});




//pentru mockup curse in timp real harta




const fetchCoordsFromNominatim = async (oras) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(oras)}`);
  const data = await response.json();
  if (data.length > 0) {
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  } else {
    return [0, 0]; // fallback dacă nu găsește
  }
};




app.get("/api/curse-in-desfasurare", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.idtransport, l1.nume AS orasStart, l2.nume AS orasDestinatie
      FROM transport t
      JOIN locatii l1 ON t.idplecare = l1.idlocatie
      JOIN locatii l2 ON t.idsosire = l2.idlocatie
    `);

    const curse = await Promise.all(result.rows.map(async (cursa) => {
      const coordStart = await fetchCoordsFromNominatim(cursa.orasstart);
      const coordDest = await fetchCoordsFromNominatim(cursa.orasdestinatie);

      return {
        id: cursa.idtransport,
        orasStart: cursa.orasstart,
        orasDestinatie: cursa.orasdestinatie,
        coordStart,
        coordDest,
      };
    }));

    res.json(curse);
  } catch (err) {
    console.error("Eroare la obținerea curselor:", err);
    res.status(500).json({ error: "Eroare server" });
  }
});


//cauta rutele din tabela transport




//cer ora de plecare pentru a rezerva

app.get('/api/ora-plecare-transport/:idtransport', async (req, res) => {
  const { idtransport } = req.params;

  try {
    const result = await pool.query(`
      SELECT o.idora, o.ora, t.numar_inmatriculare
      FROM ora_plecare o
      JOIN transport t ON o.idtransport = t.idtransport
      WHERE t.idtransport = $1
    `, [idtransport]);

    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la obținerea orelor:", err);
    res.status(500).json({ error: "Eroare server" });
  }
});



//api pentru rezervare a cursei din RezervaCursa.js
app.post('/api/rezerva', async (req, res) => {
  const { email, idtransport, idora, numar_locuri } = req.body;

  try {
    // 1. Obține id-ul userului
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Utilizatorul nu a fost găsit" });
    }
    const iduser = userRes.rows[0].id;

    // 2. Obține ora de plecare
    const oraRes = await pool.query('SELECT ora FROM ora_plecare WHERE idora = $1', [idora]);
    const ora_rezervare = oraRes.rows[0]?.ora || null;

    // 3. Verifică locurile disponibile
    const transportRes = await pool.query('SELECT numar_locuri FROM transport WHERE idtransport = $1', [idtransport]);
    const locuriDisponibile = transportRes.rows[0]?.numar_locuri || 0;

    if (numar_locuri > locuriDisponibile) {
      return res.status(400).json({ success: false, message: `Nu sunt suficiente locuri disponibile. Mai sunt ${locuriDisponibile}.` });
    }

    // 4. Creează rezervarea
    await pool.query(`
      INSERT INTO rezervari (iduser, idtransport, data_rezervare, numar_locuri, ora_rezervare)
      VALUES ($1, $2, NOW(), $3, $4)
    `, [iduser, idtransport, numar_locuri, ora_rezervare]);

    // 5. Actualizează numărul de locuri rămase
    await pool.query(`
      UPDATE transport SET numar_locuri = numar_locuri - $1 WHERE idtransport = $2
    `, [numar_locuri, idtransport]);

    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la rezervare:", err);
    res.status(500).json({ success: false, message: "Eroare la rezervare" });
  }
});



//vezi rezervarile tale
app.get('/api/rezervarile-mele', async (req, res) => {
  const { iduser } = req.query;

  if (!iduser) {
    return res.status(400).json({ message: "Lipsește iduser" });
  }

  try {
    const rezervariResult = await pool.query(`
      SELECT r.idrezervare, r.numar_locuri, r.ora_rezervare, r.data_rezervare,
             l1.nume AS plecare, l2.nume AS destinatie, t.numar_inmatriculare
      FROM rezervari r
      JOIN transport t ON r.idtransport = t.idtransport
      JOIN locatii l1 ON t.idplecare = l1.idlocatie
      JOIN locatii l2 ON t.idsosire = l2.idlocatie
      WHERE r.iduser = $1
      ORDER BY r.data_rezervare DESC
    `, [iduser]);

    res.json(rezervariResult.rows);
  } catch (err) {
    console.error("Eroare la preluarea rezervărilor:", err);
    res.status(500).json({ message: "Eroare server" });
  }
});





//preia user curent

app.get('/api/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, username, email, telefon FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilizatorul nu a fost găsit" });
    }

    console.log("Rezultat din DB:", result.rows[0]); // ← log important

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Eroare la preluarea utilizatorului:", err);
    res.status(500).json({ message: "Eroare server" });
  }
});










//sterge rezervarea
app.delete('/api/sterge-rezervare/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Obține detalii despre rezervare (pentru a ști câte locuri să adăugăm înapoi)
    const rezervareRes = await pool.query(
      'SELECT idtransport, numar_locuri FROM rezervari WHERE idrezervare = $1',
      [id]
    );

    if (rezervareRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Rezervarea nu a fost găsită" });
    }

    const { idtransport, numar_locuri } = rezervareRes.rows[0];

    // 2. Șterge rezervarea
    await pool.query('DELETE FROM rezervari WHERE idrezervare = $1', [id]);

    // 3. Actualizează locurile disponibile înapoi
    await pool.query(
      'UPDATE transport SET numar_locuri = numar_locuri + $1 WHERE idtransport = $2',
      [numar_locuri, idtransport]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la ștergerea rezervării:", err);
    res.status(500).json({ success: false, message: "Eroare server" });
  }
});

