"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { ThemeToggle } from "./theme-toggle";

function formatTime(totalSeconds: number) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Home() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Inaktiv");
  const [project, setProject] = useState("Relaunch Kundenportal");
  const [task, setTask] = useState("UI-Prototyping");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([
    ["Relaunch Kundenportal", "Wireframes & Layout", "02:30", "Gebucht"],
    ["CRM Migration", "Workshop Vorbereitung", "01:45", "Entwurf"],
    ["Marketing Website", "Hero-Sektion", "03:10", "Gebucht"],
    ["Intern", "Jour fixe", "00:50", "Prüfen"],
  ]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const time = formatTime(seconds);

  function startTimer() {
    setRunning(true);
    setStatus("Aktiv");
  }

  function pauseTimer() {
    setRunning(false);
    setStatus("Pausiert");
  }

  async function saveEntry() {
  if (seconds === 0) {
    alert("Bitte zuerst Zeit erfassen.");
    return;
  }

  const newEntry = {
  project: "TEST",
  task: "TEST TASK",
  time: "00:00:05",
  status: "Gebucht",
};

  const { error } = await supabase
    .from("entries")
    .insert([newEntry]);
console.log("Supabase Error:", error);
  if (error) {
    console.error(error);
    alert("Fehler beim Speichern.");
    return;
  }

  setEntries([[project, task, time, "Gebucht"], ...entries]);

  setSeconds(0);
  setRunning(false);
  setStatus("Inaktiv");
  setNote("");

  alert("Eintrag erfolgreich gespeichert.");
}

   

  function stopAndSaveEntry() {
    if (seconds === 0) {
      alert("Bitte zuerst den Timer starten.");
      return;
    }

    setEntries([[project, task, time, "Gebucht"], ...entries]);
    setSeconds(0);
    setRunning(false);
    setStatus("Inaktiv");
    alert("Zeit wurde gespeichert.");
  }
  useEffect(() => {
    const savedEntries = localStorage.getItem("entries");

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand__logo">SD</div>
          <div className="brand__text">
            <p className="eyebrow">SaaS Prototype</p>
            <h1>Stundendashboard</h1>
          </div>
        </div>

        <nav className="nav">
          <a className="nav__item nav__item--active" href="#overview">Übersicht</a>
          <a className="nav__item" href="#time-tracking">Zeiterfassung</a>
          <a className="nav__item" href="#projects">Projekte</a>
          <a className="nav__item" href="#tasks">Aufgaben</a>
          <a className="nav__item" href="#team">Team</a>
          <a className="nav__item" href="#reports">Reports</a>
          <a className="nav__item" href="#billing">Abrechnung</a>
          <a className="nav__item" href="#settings">Einstellungen</a>
        </nav>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="topbar__intro">
            <p className="eyebrow">Willkommen zurück</p>
            <h2>Arbeitszeiten & Auslastung auf einen Blick</h2>
          </div>

          <div className="topbar__actions">
            <label className="search">
              <span>Suche</span>
              <input type="text" placeholder="Projekt, Aufgabe, Nutzer" />
            </label>
            <button className="button button--ghost">Export</button>
            <button className="button button--primary">+ Zeit erfassen</button>
            <ThemeToggle />
            <div className="avatar">LK</div>
          </div>
        </header>

        <section className="hero-panel glass">
          <div className="hero-panel__content">
            <p className="eyebrow">Heute · Mittwoch</p>
            <h3>Team Nord hat bereits 42,5 Stunden erfasst</h3>
            <p>
              Der Prototyp zeigt Zeittracking, Auslastung, Projektübersicht und Reports.
            </p>
          </div>

          <div className="hero-panel__badges">
            <span className="badge">Live Timer sichtbar</span>
            <span className="badge">Manuelle Einträge vorbereitet</span>
            <span className="badge">Team-Analytics angedeutet</span>
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card glass">
            <p>Erfasste Stunden heute</p>
            <h3>{time.slice(0, 5)}</h3>
            <span className="trend trend--up">Live Timer</span>
          </article>
          <article className="stat-card glass">
            <p>Aktive Projekte</p>
            <h3>06</h3>
            <span className="trend">2 mit hoher Priorität</span>
          </article>
          <article className="stat-card glass">
            <p>Offene Aufgaben</p>
            <h3>17</h3>
            <span className="trend trend--warning">4 ohne Buchung</span>
          </article>
          <article className="stat-card glass">
            <p>Team-Auslastung</p>
            <h3>84 %</h3>
            <span className="trend trend--up">Stabil diese Woche</span>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel panel--timer glass" id="time-tracking">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Kernfunktion</p>
                <h3>Timer & Schnellbuchung</h3>
              </div>
              <span
                className="status-pill"
                style={{
                  color:
                    status === "Aktiv"
                      ? "#3ddc97"
                      : status === "Pausiert"
                        ? "#ffb648"
                        : "#97a3c4",
                }}
              >
                {status}
              </span>
            </div>

            <div className="timer-display">
              <div className="timer-display__ring">
                <span>{time}</span>
              </div>

              <div className="timer-display__meta">
                <p><strong>Projekt:</strong> {project}</p>
                <p><strong>Aufgabe:</strong> {task}</p>
                <p><strong>Team:</strong> Design & Frontend</p>
              </div>
            </div>

            <div className="button-group">
              <button className="button button--primary" onClick={startTimer}>Timer starten</button>
              <button className="button button--ghost" onClick={pauseTimer}>Pausieren</button>
              <button className="button button--primary" onClick={stopAndSaveEntry}>
                Timer stoppen & speichern
              </button>
            </div>

            <form className="mini-form">
              <div className="field">
                <label>Projekt</label>
                <select value={project} onChange={(e) => setProject(e.target.value)}>
                  <option>Relaunch Kundenportal</option>
                  <option>CRM Migration</option>
                  <option>Marketing Website</option>
                </select>
              </div>

              <div className="field">
                <label>Aufgabe</label>
                <select value={task} onChange={(e) => setTask(e.target.value)}>
                  <option>UI-Prototyping</option>
                  <option>API-Konzept</option>
                  <option>Testing</option>
                </select>
              </div>

              <div className="field">
                <label>Dauer</label>
                <input type="text" value={time} readOnly />
              </div>

              <div className="field field--full">
                <label>Notiz</label>
                <input
                  type="text"
                  placeholder="Kurze Beschreibung"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </form>

            <div className="form-actions">
              <button className="button button--primary" onClick={saveEntry}>
                Eintrag speichern
              </button>
            </div>
          </article>

          <article className="panel glass" id="reports">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Visualisierung</p>
                <h3>Wochenübersicht</h3>
              </div>
              <button className="button button--ghost button--small">Diese Woche</button>
            </div>

            <div className="bar-chart">
              {[
                ["Mo", "68%", "6.8h"],
                ["Di", "84%", "8.4h"],
                ["Mi", "72%", "7.2h"],
                ["Do", "91%", "9.1h"],
                ["Fr", "63%", "6.3h"],
                ["Sa", "24%", "2.4h"],
                ["So", "14%", "1.4h"],
              ].map(([day, height, hours]) => (
                <div className="bar-chart__item" key={day}>
                  <span>{day}</span>
                  <div className="bar" style={{ height }}></div>
                  <strong>{hours}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel glass" id="projects">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Analyse</p>
                <h3>Zeit nach Projekt</h3>
              </div>
              <button className="button button--ghost button--small">Monat</button>
            </div>

            <div className="donut-mock">
              <div className="donut-mock__chart"></div>
              <div className="legend">
                <div><span className="legend__dot legend__dot--1"></span> Kundenportal <strong>38%</strong></div>
                <div><span className="legend__dot legend__dot--2"></span> CRM Migration <strong>27%</strong></div>
                <div><span className="legend__dot legend__dot--3"></span> Marketing Site <strong>21%</strong></div>
                <div><span className="legend__dot legend__dot--4"></span> Intern <strong>14%</strong></div>
              </div>
            </div>
          </article>

          <article className="panel panel--wide glass" id="tasks">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Heute</p>
                <h3>Letzte Zeiteinträge</h3>
              </div>
              <button className="button button--ghost button--small">Alle anzeigen</button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Projekt</th>
                    <th>Aufgabe</th>
                    <th>Zeit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry[0]}</td>
                      <td>{entry[1]}</td>
                      <td>{entry[2]}</td>
                      <td>
                        <span className={
                          entry[3] === "Entwurf"
                            ? "table-badge table-badge--muted"
                            : entry[3] === "Prüfen"
                              ? "table-badge table-badge--warning"
                              : "table-badge"
                        }>
                          {entry[3]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel glass" id="team">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Team</p>
                <h3>Auslastung</h3>
              </div>
              <button className="button button--ghost button--small">Details</button>
            </div>

            <div className="team-list">
              {[
                ["Lisa K.", "Frontend", "88%"],
                ["Jan M.", "Backend", "76%"],
                ["Sofia R.", "Design", "93%"],
                ["Ben T.", "QA", "61%"],
              ].map(([name, role, width]) => (
                <div className="team-member" key={name}>
                  <div>
                    <strong>{name}</strong>
                    <p>{role}</p>
                  </div>
                  <div className="progress">
                    <span style={{ width }}></span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel glass" id="settings">
            <div className="panel__header">
              <div>
                <p className="eyebrow">Erinnerungen</p>
                <h3>Benachrichtigungen</h3>
              </div>
            </div>

            <div className="notification-list">
              <div className="notification-item">
                <strong>Fehlender Eintrag</strong>
                <p>Für Dienstag fehlen noch 1,5 Stunden.</p>
              </div>
              <div className="notification-item">
                <strong>Wochensummary</strong>
                <p>Der automatische Wochenreport wird am Freitag erzeugt.</p>
              </div>
              <div className="notification-item" id="billing">
                <strong>Upgrade-Hinweis</strong>
                <p>Weitere Teammitglieder können später per Subscription ergänzt werden.</p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}