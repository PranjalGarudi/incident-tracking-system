// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve index.html from root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Serve feedback page
app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'feedback.html'));
});

// ✅ Serve confirmation page
app.get('/report-confirmation', (req, res) => {
  res.sendFile(path.join(__dirname, 'report-confirmation.html'));
});

// ✅ Submit a new environmental report (auto-create user + team assign)
app.post('/api/report', async (req, res) => {
  try {
    const { user_name, user_email, description, location, category } = req.body;

    if (!user_name || !user_email || !description || !location || !category) {
      return res.status(400).json({ message: '⚠️ All fields are required.' });
    }

    // -----------------------------------------------------------
    // 1️⃣ Check if user exists
    // -----------------------------------------------------------
    let userResult = await pool.query(
      'SELECT user_id FROM Users WHERE user_email = $1',
      [user_email]
    );

    let user_id;
    if (userResult.rows.length > 0) {
      user_id = userResult.rows[0].user_id;
    } else {
      const insertUser = await pool.query(
        'INSERT INTO Users (user_name, user_email) VALUES ($1, $2) RETURNING user_id',
        [user_name, user_email]
      );
      user_id = insertUser.rows[0].user_id;
    }

    // -----------------------------------------------------------
    // 2️⃣ Insert report
    // -----------------------------------------------------------
    const reportResult = await pool.query(
      `INSERT INTO Reports (description, location, category, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING report_id`,
      [description, location, category, user_id]
    );

    const report_id = reportResult.rows[0].report_id;

    // -----------------------------------------------------------
    // 3️⃣ Assign team based on category
    // -----------------------------------------------------------
    const teamQuery = await pool.query(
      `SELECT * FROM ResponseTeam WHERE response_id =
          CASE 
              WHEN $1 = 'Pollution' THEN 1
              WHEN $1 = 'Littering' THEN 2
              WHEN $1 = 'Deforestation' THEN 3
              ELSE 4
          END`,
      [category]
    );

    const team = teamQuery.rows[0];

    // Return team information for confirmation page
    res.json({
      message: "Report submitted successfully!",
      report_id,
      team_name: team.team_name,
      team_contact: team.contact,
      user_name
    });

  } catch (err) {
    console.error('❌ Error submitting report:', err);
    res.status(500).json({ message: '❌ Database error while submitting report.' });
  }
});

// -----------------------------------------------------------
// 4️⃣ Feedback submission
// -----------------------------------------------------------
app.post('/api/feedback', async (req, res) => {
  try {
    const { user_email, description } = req.body;

    if (!user_email || !description) {
      return res.status(400).json({ message: '⚠️ All fields are required.' });
    }

    const user = await pool.query('SELECT user_id FROM Users WHERE user_email = $1', [user_email]);
    const user_id = user.rows.length ? user.rows[0].user_id : null;

    await pool.query(
      `INSERT INTO Feedback (description, user_email, user_id)
       VALUES ($1, $2, $3)`,
      [description, user_email, user_id]
    );

    res.json({ message: '✅ Feedback submitted successfully!' });
  } catch (err) {
    console.error('❌ Error submitting feedback:', err);
    res.status(500).json({ message: '❌ Database error while submitting feedback.' });
  }
});

// -----------------------------------------------------------
//  Fetch all reports
// -----------------------------------------------------------

app.get('/api/reports', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.report_id, r.description, r.date, r.location, r.category, u.user_name
      FROM Reports r
      JOIN Users u ON r.user_id = u.user_id
      ORDER BY r.report_id DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching reports:', err);
    res.status(500).json({ message: '❌ Could not fetch reports.' });
  }
});

app.listen(PORT, () => {
  console.log(`🌿 Server running at http://localhost:${PORT}`);
});

