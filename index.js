const { client } = require("./common");
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;
app.use(require("morgan")("dev"));

app.listen(PORT, async () => {
  await client.connect();
  console.log(`I am listening on port number ${PORT}`);
});

app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = `
    SELECT * FROM employees
        `;
    const response = await client.query(SQL);
    res.status(200).send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/departments", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * FROM departments
        `;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/employees", async (req, res, next) => {
  try {
    const { type, name } = req.body;
    const SQL = `
        INSERT INTO employees(name, department_id) VALUES($1, (SELECT id from departments where type=$2))
        RETURNING *
    `;
    const response = await client.query(SQL, [type, name]);
    res.status(200).send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
    DELETE FROM employees WHERE id = $1
    `;
    await client.query(SQL, [id]);
    res.status(204);
  } catch (error) {
    next(error);
  }
});

app.put("/api/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const SQL = `
        UPDATE employees
        SET department_id = (SELECT id FROM departments WHERE type = $2)
        WHERE id = $1
        RETURNING *
        `;
    const response = await client.query(SQL, [id, type]);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});
