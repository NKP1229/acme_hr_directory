import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axios.get("/api/employees");
      setEmployees(response.data);
      setIsLoading(false);
    };
    fetchDepartments();
  }, []);

  async function getDetails(id) {
    try {
      const response = await axios.get(`/api/employees/${id}`);
      setSelectedEmployee(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  }
  if (isLoading) {
    return <section className="loading">Loading</section>;
  }
  if (selectedEmployee) {
    return (
      <main>
        <h1>
          <b>Selected Employee:</b>
        </h1>
        <h2>{selectedEmployee.name}</h2>
        <h3>employeeID: </h3>
        <h4>{selectedEmployee.id}</h4>
        <h3>Department: </h3>
        <h4>{selectedEmployee.department_id}</h4>
        <h3>Date Joined: </h3>
        <h3>Last Update: </h3>
        <button
          className="details"
          onClick={() => {
            setSelectedEmployee(null);
          }}
        >
          back
        </button>
      </main>
    );
  }
  return (
    <main>
      <h1>
        <b>Acme HR Directory:</b>
      </h1>
      <h2>Current Employees:</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <button className="" onClick={() => getDetails(employee.id)}>
              {employee.name}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default App;
