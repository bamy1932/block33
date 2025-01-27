const { client } = require("./common");
const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(require("morgan")("dev"));

app.listen(PORT, async () => {
  await client.connect();
  console.log(`I am listening on port number ${PORT}`);
});

//Returns array of employees
app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM employees;
        `;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

//Returns an array of departments
app.get("/api/departments", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * FROM departments;
        `;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

// Returns a created employee
app.post("/api/employees", async (req, res, next) => {
  try {
    const { name, department_id } = req.body;
    const SQL = `
        INSERT INTO employees(name, department_id) VALUES($1, $2)
        RETURNING *;
    `;
    const response = await client.query(SQL, [name, department_id]);
    console.log(response.rows);
    res.status(200).send(response.rows);
  } catch (error) {
    next(error);
  }
});

// Deletes employee using the ID
app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
    DELETE FROM employees WHERE id = $1
    `;
    await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// Returns an updated employee
app.put("/api/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, department_id } = req.body;
    const SQL = `
        UPDATE employees
        SET name=$1, department_id=$2
        WHERE id=$3
        RETURNING *
        `;
    const response = await client.query(SQL, [name, department_id, id]);
    console.log(response.rows);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});
