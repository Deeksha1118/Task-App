const express = require('express');
const router = express.Router();
const pool = require("../config/db");

// http://localhost:8081/tasks/
// Get all Tasks
router.get("/", async (req, res) => {
        const tasks = await pool.query("SELECT * FROM tasks");
        res.status(200).json({
            success: true,
            message: "Fetched all tasks",
            data: tasks.rows,
        })
    });

// http://localhost:8081/tasks/1
//Get single Task by their id
router.get("/:id", async(req, res) => {
    const {id} = req.params;
    const task = await pool.query("SELECT * FROM tasks WHERE task_id = $1", [id]);
    if(task.rows.length === 0) {
        return res.status(404).json({
            success : false,
            message : "Task Doesn't Exist !!",
        });
    }
    return res.status(200).json({
        success : true,
        message : "Task Found by thier ID",
        data : task.rows[0],
    });
});

// http://localhost:8081/tasks/
// Create a new Task
router.post("/", async(req,res) => {
    // console.log(req.body);
    const {project_id, title, description, assigned_to, status, due_date} = req.body;
    const task = await pool.query(
        "INSERT INTO tasks (project_id, title, description, assigned_to, status, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ",
        [ project_id, title, description, assigned_to, status, due_date]
    );
    // console.log("Inserted Task: ", task.rows[0]);
    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task.rows[0],
    });
});

// http://localhost:8081/tasks/1
// Update a Task by their id
router.put("/:id", async(req,res) => {
    const { id } = req.params;
    const { project_id, title, description, assigned_to, status, due_date } = req.body;
    const updatedTask = await pool.query(
        "UPDATE tasks SET project_id = $1, title = $2, description = $3, assigned_to = $4, status = $5, due_date = $6  WHERE task_id = $7 RETURNING *",
        [project_id, title, description, assigned_to, status, due_date, id]
    );

    if (updatedTask.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask.rows[0],
    });
});

// http://localhost:8081/tasks/1
// Delete a Task by their id
router.delete("/:id", async(req, res) => {
    const { id } = req.params;
    const task = await pool.query("DELETE FROM tasks WHERE task_id = $1 RETURNING *", [id]);
    if (task.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
    });
});
    
module.exports = router;