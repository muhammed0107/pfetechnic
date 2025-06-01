require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const workoutPlanRoutes = require("./routes/workoutPlan.routes");
const statsRoutes = require("./routes/stats.routes");
const diabetesRoutes = require("./routes/diabetes.routes");
const bpRoutes = require("./routes/blood_pressure.routes");
const vitalsRoutes = require("./routes/vitals.routes"); // ✅ Nouvelle route

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: "*", // ✅ remplacer par l’URL réelle de ton frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Routes
app.use("/api", userRoutes, workoutPlanRoutes, statsRoutes, diabetesRoutes, bpRoutes, vitalsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Connexion DB + Démarrage serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅ SERVEUR DÉMARRÉ SUR http://localhost:${PORT}`);
  });
});
