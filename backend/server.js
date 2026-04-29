const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, "db.json");
const FRONTEND_DIST_PATH = path.join(__dirname, "..", "frontend", "dist");
const FRONTEND_INDEX_PATH = path.join(FRONTEND_DIST_PATH, "index.html");
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);
app.use(express.json());

if (fs.existsSync(FRONTEND_DIST_PATH)) {
  app.use(express.static(FRONTEND_DIST_PATH));
}

function readDb() {
  const rawData = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(rawData);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function generateTaskId(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 1;
  }
  const maxId = tasks.reduce((acc, task) => Math.max(acc, task.id || 0), 0);
  return maxId + 1;
}

function generateSubjectId(subjects) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return 1;
  }
  const maxId = subjects.reduce((acc, subject) => Math.max(acc, subject.id || 0), 0);
  return maxId + 1;
}

app.get("/subjects", (req, res) => {
  const db = readDb();
  res.json(db.subjects || []);
});

app.post("/subjects", (req, res) => {
  const db = readDb();
  const subjects = db.subjects || [];
  const name = (req.body.name || "").trim();

  if (!name) {
    return res.status(400).json({ message: "Nom de matiere obligatoire" });
  }

  const newSubject = {
    id: generateSubjectId(subjects),
    name,
    color: req.body.color || null
  };

  subjects.push(newSubject);
  db.subjects = subjects;
  writeDb(db);

  return res.status(201).json(newSubject);
});

app.delete("/subjects/:id", (req, res) => {
  const subjectId = Number(req.params.id);
  const db = readDb();
  const subjects = db.subjects || [];
  const subjectIndex = subjects.findIndex((item) => item.id === subjectId);

  if (subjectIndex === -1) {
    return res.status(404).json({ message: "Matiere introuvable" });
  }

  const deletedSubject = subjects[subjectIndex];
  subjects.splice(subjectIndex, 1);
  db.subjects = subjects;

  if (Array.isArray(db.tasks)) {
    db.tasks = db.tasks.filter((task) => task.subjectId !== subjectId);
  }

  writeDb(db);

  return res.json(deletedSubject);
});

app.get("/tasks", (req, res) => {
  const db = readDb();
  res.json(db.tasks || []);
});

app.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const db = readDb();
  const task = (db.tasks || []).find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Tache introuvable" });
  }

  return res.json(task);
});

app.post("/tasks", (req, res) => {
  const db = readDb();
  const tasks = db.tasks || [];
  const newTask = {
    id: generateTaskId(tasks),
    title: req.body.title,
    description: req.body.description,
    subjectId: req.body.subjectId,
    type: req.body.type,
    priority: req.body.priority,
    status: req.body.status,
    dueDate: req.body.dueDate
  };

  tasks.push(newTask);
  db.tasks = tasks;
  writeDb(db);

  return res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const db = readDb();
  const tasks = db.tasks || [];
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Tache introuvable" });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    title: req.body.title,
    description: req.body.description,
    subjectId: req.body.subjectId,
    type: req.body.type,
    priority: req.body.priority,
    status: req.body.status,
    dueDate: req.body.dueDate
  };

  tasks[taskIndex] = updatedTask;
  db.tasks = tasks;
  writeDb(db);

  return res.json(updatedTask);
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const db = readDb();
  const tasks = db.tasks || [];
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Tache introuvable" });
  }

  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  db.tasks = tasks;
  writeDb(db);

  return res.json(deletedTask);
});

app.get("/stats", (req, res) => {
  const db = readDb();
  const tasks = db.tasks || [];
  const total = tasks.length;
  const enCours = tasks.filter((task) => task.status === "en_cours").length;
  const termine = tasks.filter((task) => task.status === "termine").length;

  res.json({
    total,
    en_cours: enCours,
    termine
  });
});

app.post("/login", (req, res) => {
  // Authentification simulee : on accepte tous les identifiants
  const user = {
    id: 1,
    name: "Etudiant Demo",
    email: req.body.email || "demo@mystudyplanner.fr"
  };

  res.json({
    user,
    token: "token-demo-123456"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("*", (req, res, next) => {
  const apiRoutes = ["/subjects", "/tasks", "/stats", "/login", "/health"];
  const isApiRequest = apiRoutes.some(
    (route) => req.path === route || req.path.startsWith(`${route}/`)
  );

  if (isApiRequest) {
    return next();
  }

  if (fs.existsSync(FRONTEND_INDEX_PATH)) {
    return res.sendFile(FRONTEND_INDEX_PATH);
  }

  return res.status(404).json({
    message: "Frontend non compile. Lancez le build frontend avant le deploy.",
  });
});

app.listen(PORT, () => {
  console.log(`Serveur MyStudyPlanner demarre sur le port ${PORT}`);
});
