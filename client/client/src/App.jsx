import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [department, setDepartment] = useState("");

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
  async function updateEmployee(event) {
    event.preventDefault();
    try {
      const id = selectedEmployee.id;
      const data = await axios.get("/api/departments");
      const search = data.data.find((dept) => dept.name === department);
      const response = await axios.put(`/api/employees/${id}`, {
        department_id: search.id,
      });
      setIsUpdating(false);
      getDetails(id);
    } catch (error) {
      console.error(error);
      setIsUpdating(false);
    }
  }
  if (isLoading) {
    return <section className="loading">Loading</section>;
  }
  if (isUpdating) {
    return (
      <>
        <button onClick={() => setIsUpdating(false)}>back</button>
        <main>
          <h1>
            <b>Updating {selectedEmployee.name}:</b>
          </h1>
          <form onSubmit={updateEmployee}>
            <div className="formDiv">
              <label>Department:</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="Accounting">Accounting</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Finance">Finance</option>
                <option value="Info Tech">Info Tech</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        </main>
      </>
    );
  } else if (selectedEmployee) {
    return (
      <>
        <button
          onClick={() => {
            setSelectedEmployee(null);
          }}
        >
          back
        </button>
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
          <h4>{selectedEmployee.created_at}</h4>
          <h3>Last Update: </h3>
          <h4>{selectedEmployee.updated_at}</h4>
          <button
            onClick={() => {
              setIsUpdating(true);
            }}
          >
            update
          </button>
        </main>
      </>
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
