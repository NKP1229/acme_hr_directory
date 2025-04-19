const express = require("express");
const app = express();
const PORT = 3000;
const pg = require("pg");
const client = new pg.Client("postgres://localhost/acme_hr_directory");
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(require("morgan")("dev"));
app.listen(PORT, () => {
  console.log(`I am listening on port number ${PORT}`);
});
app.get("/", (req, res, next) => {
  res.status(200).json({ message: "You have reached the ACME Home Page" });
});
app.get("/api/employees", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * from employees
    `;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});
app.get("/api/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
            SELECT * from employees WHERE id = $1 
        `;
    const response = await client.query(SQL, [id]);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});
app.get("/api/departments", async (req, res, next) => {
  try {
    const SQL = `SELECT * FROM departments`;
    const response = await client.query(SQL);
    res.status(200).json(response.rows);
  } catch (error) {
    next(error);
  }
});
app.post("/api/employees", async (req, res, next) => {
  try {
    const { name, department_id } = req.body;
    const SQL = `
        INSERT INTO employees(name,department_id) VALUES($1, $2) RETURNING *
    `;
    response = await client.query(SQL, [name, department_id]);
    res.status(201).json(response.rows);
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
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
app.put("/api/employees/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { department_id } = req.body;
    const SQL = `
        UPDATE employees
        SET department_id = $1, updated_at = NOW()
        where id = $2
        RETURNING *
    `;
    const response = await client.query(SQL, [department_id, id]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    next(error);
  }
});
const init = async () => {
  await client.connect();
};
init();
