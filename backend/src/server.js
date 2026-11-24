require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const qualityRoutes = require("./routes/qualityRoutes");

const app = express();

// ------------------------------------
// 1. CORS Configuration
// ------------------------------------

const allowedOrigins = (
    process.env.FRONTEND_ORIGIN ||
    "http://localhost:5173,http://localhost:5174"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ------------------------------------
// 2. Middleware
// ------------------------------------

app.use(express.json({ limit: "1mb" }));

// ------------------------------------
// 3. Root Route
// ------------------------------------

app.get("/", (_req, res) => {
    res.json({
        name: "TestPilot-AI API",
        status: "running"
    });
});

// ------------------------------------
// 4. Health Check Route
// ------------------------------------

app.get("/api/health", async (_req, res) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            status: "ok",
            database: "connected"
        });

    } catch (error) {

        console.error(
            "Database health check failed:",
            error.message
        );

        res.status(503).json({
            status: "error",
            database: "unavailable"
        });
    }
});

// ------------------------------------
// 5. API Routes
// ------------------------------------

app.use("/api/auth", authRoutes);

app.use("/api", qualityRoutes);

// ------------------------------------
// 6. 404 Handler
// ------------------------------------

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

// ------------------------------------
// 7. Global Error Handler
// ------------------------------------

app.use((error, _req, res, _next) => {

    console.error("API error:", error.message);

    res.status(500).json({
        success: false,
        message: "Something went wrong."
    });
});

// ------------------------------------
// 8. Start Backend Server
// ------------------------------------

async function startServer() {

    try {

        // Check PostgreSQL connection first.
        await pool.query("SELECT 1");

        console.log("PostgreSQL connection verified.");

        const port = Number(process.env.PORT || 5000);

        const server = app.listen(port, () => {

            console.log(
                `TestPilot-AI API listening on port ${port}`
            );

        });

        server.on("error", (error) => {

            console.error(
                "HTTP server error:",
                error.message
            );

        });

    } catch (error) {

        console.error(
            "Failed to start backend:",
            error.message
        );

        process.exitCode = 1;
    }
}

// Start only when executed directly.
if (require.main === module) {
    startServer();
}

module.exports = app;