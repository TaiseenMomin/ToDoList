const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const Task = require("./models/Task");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set views directory and template engine
app.set("views", path.join(__dirname, "../frontend")); // ✅ Fix: Correct views path
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Routes
app.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render("index", { tasks });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.post("/add", async (req, res) => {
    const { title } = req.body;
    if (!title) return res.redirect("/");
    await Task.create({ title, completed: false });
    res.redirect("/");
});

app.post("/complete/:id", async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, { completed: true });
    res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
