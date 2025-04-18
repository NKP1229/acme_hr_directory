const express = require("express");
const app = express();
const PORT = 3000;
const pg = require("pg");
const client = new pg.Client("postgres://localhost/acme_hr_directory");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.listen(PORT, () => {
  console.log(`I am listening on port number ${PORT}`);
});
app.get("/", (req, res, next) => {
  res.status(200).json({ message: "You have reached the ACME Home Page" });
});
app.get("/api/employees", async (req, res, next) => {
  try {
    res.status(200).send("Returns array of employees.");
  } catch (error) {
    next(error);
  }
});
app.get("/api/departments", async (req, res, next) => {
  try {
    res.status(200).send("Returns an array of departments.");
  } catch (error) {
    next(error);
  }
});
app.post("/api/employees", async (req, res, next) => {
  try {
    res
      .status(200)
      .send(
        "Returns a created employee. The payload is the employee to create."
      );
  } catch (error) {
    next(error);
  }
});
app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    res
      .status(200)
      .send(
        "Returns nothing. The ID of the employee to delete is passed in the URL."
      );
  } catch (error) {
    next(error);
  }
});
app.put("/api/employees/:id", async (req, res, next) => {
  try {
    res
      .status(200)
      .send(
        "Returns an updated employee. The payload is the employee to update."
      );
  } catch (error) {
    next(error);
  }
});
