const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const { Pool } = require('pg');

const userRoutes = require("./Routes/users.js");
const projectRoutes = require("./Routes/projects.js");
const taskRoutes = require("./Routes/tasks.js");

dotenv.config();

const app = express();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const PORT = 8081;

app.use(cors());
app.use(express.json());

// http://localhost:8081/
app.get('/', (req, res) => res.send('API is running...'));

// http://localhost:8081/users/
app.use("/users", userRoutes);
// http://localhost:8081/projects/
app.use("/projects", projectRoutes);
// http://localhost:8081/tasks/
app.use("/tasks", taskRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));