const pg = require("pg");
const client = new pg.Client("postgres://localhost/acme_hr_directory");
const init = async () => {
  try {
    await client.connect();
    const SQL = `
            DROP TABLE IF EXISTS departments;
            CREATE TABLE departments(
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100)
            );
            DROP TABLE IF EXISTS employees;
            CREATE TABLE employees(
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100),
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now(),
                department_id UUID REFERENCES departments(id) NOT NULL
            );
            
        `;
    await client.query(SQL);
    console.log("seeded");
    await client.end();
  } catch (error) {
    console.error(error);
  }
};
init();
