# Environmental Incident Reporting System

A small full‑stack project to let citizens report environmental incidents (Pollution, Littering, Deforestation), assign response teams, record actions and collect feedback.

---

## Tech Stack

* Backend: Node.js, Express
* Database: PostgreSQL
* Frontend: Plain HTML/CSS/JS (static pages served by Express)
* DB driver: `pg` (node-postgres)

---

## Project Structure

```
incident-tracking-sys/
├── db.js                # Postgres Pool config
├── server.js            # Express server & API routes
├── index.html           # Report submission page
├── feedback.html        # Feedback submission page
├── report-confirmation.html # Confirmation page (team info)
├── package.json
└── package-lock.json
```

---

## Key Features

* Submit environmental reports (name, email, description, location, category).
* Assign response team based on category and return team contact details to user.
* Store feedback tied to users.
* Simple admin API to list reports.

---

## Database Schema (Postgres)

Main tables:

* `Users(user_id serial pk, user_name varchar, user_email varchar unique, created_at timestamp)`
* `ResponseTeam(response_id serial pk, team_name varchar, contact varchar)`
* `Reports(report_id serial pk, description text, date date default current_date, location varchar, category varchar, user_id int fk)`
* `Actions(action_id serial pk, description text, date date default current_date, report_id int fk, team_id int fk)`
* `Feedback(feedback_id serial pk, description text, user_email varchar, user_id int fk, created_at timestamp)`

---



## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure database credentials in `db.js` (or use environment variables). Example `db.js`:

```js
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'env_incident_db',
  password: 'your_db_password',
  port: 5432,
});
module.exports = pool;
```

3. Start server:

```bash
node server.js
# or
npx nodemon server.js
```

4. Open `http://localhost:3000/` in browser.

---

## Tips

* Ensure `db.js` uses **lowercase** database name unless you deliberately created a quoted mixed-case name.
* Use `psql` or `pgAdmin` to inspect tables.
---

