const express = require('express');
const cors = require('cors');
//const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 5000;


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

// API Express pentru ștergerea unei locații cu tot ce implică (autocar, curse, rezervări)
app.get("/api/locatii-status", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.idlocatie, l.nume, l.adresa,
        EXISTS (
          SELECT 1 FROM transport t
          WHERE t.idplecare = l.idlocatie OR t.idsosire = l.idlocatie
        ) AS este_folosita
      FROM locatii l
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la obținerea locațiilor:", err);
    res.status(500).json({ message: "Eroare server" });
  }
});


//sterge locatia
app.delete("/api/locatie/delete/:idlocatie", async (req, res) => {
  const { idlocatie } = req.params;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Găsește toate autocarele care au această locație ca plecare sau sosire
    const autocare = await client.query(
      `SELECT idtransport FROM transport WHERE idplecare = $1 OR idsosire = $1`,
      [idlocatie]
    );

    const idsTransport = autocare.rows.map((r) => r.idtransport);

    if (idsTransport.length > 0) {
      // 2. Șterge rezervările asociate transporturilor
      await client.query(
        `DELETE FROM rezervari WHERE idtransport = ANY($1::int[])`,
        [idsTransport]
      );

      // 3. Șterge cursele asociate
      await client.query(
        `DELETE FROM ora_plecare WHERE idtransport = ANY($1::int[])`,
        [idsTransport]
      );

      // 4. Șterge autocarele (transporturile)
      await client.query(
        `DELETE FROM transport WHERE idtransport = ANY($1::int[])`,
        [idsTransport]
      );
    }

    // 5. Șterge locația propriu-zisă
    await client.query(`DELETE FROM locatii WHERE idlocatie = $1`, [idlocatie]);

    await client.query("COMMIT");
    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Eroare la ștergerea locației:", err);
    res.status(500).json({ success: false, message: "Eroare la server" });
  } finally {
    client.release();
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
  const { id } = req.params;
  
  try {
    // Șterge înregistrările din ora_plecare
    await pool.query('DELETE FROM ora_plecare WHERE idtransport = $1', [id]);

    // Șterge autocarul
    const result = await pool.query('DELETE FROM transport WHERE idtransport = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.json({ success: false, message: "Autocarul nu a fost găsit" });
    }

    res.json({ success: true });
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
        o.idora,
        t.idtransport,
        t.numar_inmatriculare,
        l1.nume AS plecare,
        l2.nume AS sosire,
        o.ora
      FROM transport t
      JOIN ora_plecare o ON t.idtransport = o.idtransport
      JOIN locatii l1 ON t.idplecare = l1.idlocatie
      JOIN locatii l2 ON t.idsosire = l2.idlocatie
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la obținerea curselor:", err);
    res.status(500).json({ message: "Eroare server" });
  }
});





//sterge cursa din ora_plecare

app.delete('/api/sterge-cursa/:idora', async (req, res) => {
  const { idora } = req.params;

  try {
    // 1. Aflăm ora și transportul asociate cursei
    const detalii = await pool.query(
      `SELECT ora, idtransport FROM ora_plecare WHERE idora = $1`,
      [idora]
    );

    if (detalii.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Cursa nu a fost găsită." });
    }

    const { ora, idtransport } = detalii.rows[0];

    // 2. Ștergem rezervările care aveau acea oră și acel transport
    await pool.query(
      `DELETE FROM rezervari WHERE idtransport = $1 AND ora_rezervare = $2`,
      [idtransport, ora]
    );

    // 3. Ștergem ora de plecare
    await pool.query(`DELETE FROM ora_plecare WHERE idora = $1`, [idora]);

    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la ștergerea cursei:", err);
    res.status(500).json({ success: false, message: "Eroare server." });
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
  const { email, idtransport, idora, numar_locuri, data } = req.body;

  try {
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Utilizatorul nu a fost găsit" });
    }

    const iduser = userRes.rows[0].id;

    const oraRes = await pool.query('SELECT ora FROM ora_plecare WHERE idora = $1', [idora]);
    const ora_rezervare = oraRes.rows[0]?.ora || null;

    const transportRes = await pool.query('SELECT numar_locuri FROM transport WHERE idtransport = $1', [idtransport]);
    const locuriDisponibile = transportRes.rows[0]?.numar_locuri || 0;

    if (numar_locuri > locuriDisponibile) {
      return res.status(400).json({ success: false, message: `Nu sunt suficiente locuri disponibile. Mai sunt ${locuriDisponibile}.` });
    }

    await pool.query(`
      INSERT INTO rezervari (iduser, idtransport, data_rezervare, numar_locuri, ora_rezervare)
      VALUES ($1, $2, $3, $4, $5)
    `, [iduser, idtransport, data, numar_locuri, ora_rezervare]);

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



//Actualizeaza locatiile
app.put('/api/locatii/update', async (req, res) => {
  const { idlocatie, nume, adresa } = req.body;

  try {
    await pool.query(
      `UPDATE locatii SET nume = $1, adresa = $2 WHERE idlocatie = $3`,
      [nume, adresa, idlocatie]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la actualizarea locației:", err);
    res.status(500).json({ success: false });
  }
});

//actualizeaza autocar
app.put("/api/autocar/update", async (req, res) => {
  const { idtransport, tip, numar_locuri, numar_inmatriculare } = req.body;

  try {
    await pool.query(`
      UPDATE transport 
      SET tip = $1, numar_locuri = $2, numar_inmatriculare = $3 
      WHERE idtransport = $4
    `, [tip, numar_locuri, numar_inmatriculare, idtransport]);

    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la actualizare autocar:", err);
    res.status(500).json({ success: false });
  }
});

//actualizeaza cursele
app.put('/api/cursa/update', async (req, res) => {
  const { idora, ora } = req.body;

  try {
    await pool.query(
      'UPDATE ora_plecare SET ora = $1 WHERE idora = $2',
      [ora, idora]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la actualizarea orei:", err);
    res.status(500).json({ success: false });
  }
});

//ia autocare rezervate
app.get('/api/rezervari-pe-autocar/:idtransport', async (req, res) => {
  const { idtransport } = req.params;

  try {
    const result = await pool.query(
      'SELECT 1 FROM rezervari WHERE idtransport = $1 LIMIT 1',
      [idtransport]
    );

    res.json(result.rows.length > 0);
  } catch (err) {
    console.error("Eroare la verificarea rezervărilor:", err);
    res.status(500).json(false);
  }
});


//sterge autocare rezervate
app.delete('/api/sterge-rezervari-pe-autocar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM rezervari WHERE idtransport = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Eroare la ștergerea rezervărilor:", err);
    res.status(500).json({ success: false });
  }
});



app.get('/api/autocare-cu-ora', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT t.idtransport, t.numar_inmatriculare,
             l1.nume AS plecare_oras, l2.nume AS destinatie_oras
      FROM transport t
      JOIN ora_plecare o ON t.idtransport = o.idtransport
      JOIN locatii l1 ON t.idplecare = l1.idlocatie
      JOIN locatii l2 ON t.idsosire = l2.idlocatie
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Eroare la obținerea autocarelor cu oră:", err);
    res.status(500).json({ message: "Eroare server" });
  }
});
