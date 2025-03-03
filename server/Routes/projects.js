const express = require('express');
const router = express.Router();
const pool = require("../config/db");

// http://localhost:8081/projects/
// Get all Projects
router.get("/", async (req, res) => {
    const projects = await pool.query("SELECT * FROM projects");
    res.status(200).json({
        success: true,
        message: "Fetched all projects",
        data: projects.rows,
    })
});

// http://localhost:8081/projects/1
//Get single Project by their id
router.get("/:id", async(req, res) => {
    const {id} = req.params;
    const project = await pool.query("SELECT * FROM projects WHERE project_id = $1", [id]);
    if(project.rows.length === 0) {
        return res.status(404).json({
            success : false,
            message : "Project Doesn't Exist !!",
        });
    }
    return res.status(200).json({
        success : true,
        message : "Project Found by thier ID",
        data : project.rows[0],
    });
});

// http://localhost:8081/projects/
// Create a new Project
router.post("/", async(req,res) => {
    // console.log(req.body);
    const {name, description, created_by} = req.body;
    const project = await pool.query(
        "INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING * ",
        [name, description, created_by]
    );
    // console.log("Inserted Project: ", project.rows[0]);
    res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project.rows[0],
    });
});

// http://localhost:8081/projects/1
// Update a Project by their id
router.put("/:id", async(req,res) => {
    const { id } = req.params;
    const { name, description, created_by } = req.body;
    const updatedProject = await pool.query(
        "UPDATE projects SET name = $1, description = $2, created_by = $3 WHERE project_id = $4 RETURNING *",
        [name, description, created_by, id]
    );

    if (updatedProject.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: updatedProject.rows[0],
    });
});

// http://localhost:8081/projects/1
// Delete a Project by their id
router.delete("/:id", async(req, res) => {
    const { id } = req.params;
    const project = await pool.query("DELETE FROM projects WHERE project_id = $1 RETURNING *", [id]);
    if (project.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
    });
});

module.exports = router;