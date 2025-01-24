const { client } = require("./common");

const seed = async () => {
  try {
    await client.connect();
    const SQL = `DROP TABLE IF EXISTS departments;
    DROP TABLE IF EXISTS employees;
    CREATE TABLE departments(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100)
    );
    CREATE TABLE employees(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        department_id
    );
    INSERT INTO departments(name) VALUES 
    (HR),
    (IT),
    (Finance),
    (Sales);
    INSERT INTO employees(name, department_id) VALUES
    (Ed, SELECT id FROM departments WHERE type = 'IT'),
    (Karen, SELECT id FROM departments WHERE type = 'HR'),
    (Jerry, SELECT id FROM departments WHERE type = 'Sales'),
    (Cynthia, SELECT id FROM departments WHERE type = 'Finance');
    `;
    await client.query(SQL);
    await client.end();
  } catch (error) {
    console.error(error);
  }
};

seed();
