const { client } = require("./common");

const seed = async () => {
  try {
    await client.connect();
    const SQL = `DROP TABLE IF EXISTS departments;
    DROP TABLE IF EXISTS employees;
    CREATE TABLE departments(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE
    );
    CREATE TABLE employees(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        department_id INTEGER REFERENCES departments(id) NOT NULL
    );
    INSERT INTO departments(name) VALUES('HR');
    INSERT INTO departments(name) VALUES('IT');
    INSERT INTO departments(name) VALUES('Finance');
    INSERT INTO departments(name) VALUES('Sales');
    INSERT INTO employees(name, department_id) VALUES('Ed', (SELECT id FROM departments WHERE name = 'IT'));
    INSERT INTO employees(name, department_id) VALUES('Karen', (SELECT id FROM departments WHERE name = 'HR'));
    INSERT INTO employees(name, department_id) VALUES('Jerry', (SELECT id FROM departments WHERE name = 'Sales'));
    INSERT INTO employees(name, department_id) VALUES('Cynthia', (SELECT id FROM departments WHERE name = 'Finance'));
    `;
    await client.query(SQL);
    console.log("SQL");
    await client.end();
  } catch (error) {
    console.error(error);
  }
};

seed();
