const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Show all tasks
router.get("/", async (req, res) => {
    const tasks = await Task.find();
    res.render("index", { tasks });
});

// Add a new task
router.post("/add", async (req, res) => {
    await Task.create({ title: req.body.title });
    res.redirect("/");
});

// Mark task as completed
router.post("/complete/:id", async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, { completed: true });
    res.redirect("/");
});

// Delete task
router.post("/delete/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

module.exports = router;
