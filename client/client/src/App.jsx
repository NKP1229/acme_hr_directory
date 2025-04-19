import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await axios.get("/api/employees");
      setEmployees(response.data);
      setIsLoading(false);
    };
    fetchEmployees();
  }, [isAdding]);
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
  async function addEmployee(event) {
    event.preventDefault();
    try {
      console.log("new employee: ", employeeName, employeeDepartment);
      const data = await axios.get("/api/departments");
      const search = data.data.find((dept) => dept.name === employeeDepartment);
      const response = await axios.post(`/api/employees`, {
        name: employeeName,
        department_id: search.id,
      });
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      setIsAdding(false);
    }
  }
  async function fetchDepartment() {
    try {
      const data = await axios.get("/api/departments");
      return data.data;
    } catch (error) {
      console.error(error);
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
    const logDepartments = async () => {
      const list = await fetchDepartment();
      const search = list.find(
        (dept) => dept.id === selectedEmployee.department_id
      );
      setDepartment(search.name);
    };
    logDepartments();
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
          <div>
            <span>
              <b>employeeID: </b>
              {selectedEmployee.id}
            </span>
          </div>
          <div>
            <span>
              <b>Department: </b>
              {department}
            </span>
          </div>
          <div>
            <span>
              <b>Date Joined: </b>
              {selectedEmployee.created_at}
            </span>
          </div>
          <div>
            <span>
              <b>Last Update: </b>
              {selectedEmployee.updated_at}
            </span>
          </div>
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
  if (isAdding) {
    return (
      <main>
        <button className="details right" onClick={() => setIsAdding(false)}>
          back
        </button>
        <h1>
          <b>Add New Employee:</b>
        </h1>
        <form onSubmit={addEmployee}>
          <div className="formDiv">
            <label>Full Name: </label>
            <input
              type="text"
              name="employeeName"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Please Enter Full Name"
            />
          </div>
          <div className="formDiv">
            <label>Department: </label>
            <select
              value={employeeDepartment}
              onChange={(e) => setEmployeeDepartment(e.target.value)}
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
      <button onClick={() => setIsAdding(true)}>Add Employee</button>
    </main>
  );
};

export default App;
