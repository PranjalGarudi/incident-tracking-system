Environmental Incident Reporting System

A small full‑stack project to let citizens report environmental incidents (Pollution, Littering, Deforestation), assign response teams, record actions and collect feedback.
Tech Stack

Backend: Node.js, Express
Database: PostgreSQL
Frontend: Plain HTML/CSS/JS (static pages served by Express)
DB driver: pg (node-postgres)

Project Structure
incident-tracking-sys/
├── db.js # Postgres Pool config
├── server.js # Express server & API routes
├── index.html # Report submission page
├── feedback.html # Feedback submission page
├── report-confirmation.html # Confirmation page (team info)
├── package.json
└── package-lock.json

Key Features:
Submit environmental reports (name, email, description, location, category).
Auto-create users when unknown (by email).
Assign response team based on category and return team contact details to user.
Store feedback tied to users.
Simple admin API to list reports.
