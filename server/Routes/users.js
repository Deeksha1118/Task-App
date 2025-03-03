const express = require('express');
const router = express.Router();
const pool = require("../config/db");

// http://localhost:8081/users/
// Get all Users
router.get("/", async (req, res) => {
    const users = await pool.query("SELECT * FROM users");
    res.status(200).json({
        success: true,
        message: "Fetched all users",
        data: users.rows,
    })
});

// http://localhost:8081/users/1
//Get single User by their id
router.get("/:id", async(req, res) => {
    const {id} = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if(user.rows.length === 0) {
        return res.status(404).json({
            success : false,
            message : "User Doesn't Exist !!",
        });
    }
    return res.status(200).json({
        success : true,
        message : "User Found by thier ID",
        data : user.rows[0],
    });
});

// http://localhost:8081/users/
// Create a new User
router.post("/", async(req,res) => {
    // console.log(req.body);
    const {name, email, role} = req.body;
    const user = await pool.query(
        "INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING * ",
        [ name, email, role]
    );
    // console.log("Inserted User: ", user.rows[0]);
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user.rows[0],
    });
});

// http://localhost:8081/users/1
// Update a User by their id
router.put("/:id", async(req,res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const updatedUser = await pool.query(
        "UPDATE users SET name = $1, email = $2, role = $3  WHERE user_id = $4 RETURNING *",
        [name, email, role, id]
    );

    if (updatedUser.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser.rows[0],
    });
});

// http://localhost:8081/users/1
// Delete a User by their id
router.delete("/:id", async(req, res) => {
    const { id } = req.params;
    const user = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [id]);
    if (user.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

module.exports = router;