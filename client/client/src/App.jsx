import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axios.get("/api/departments");
      console.log(response.data);
      setDepartments(response.data);
      setIsLoading(false);
    };
    fetchDepartments();
  }, []);

  if (isLoading) {
    return <section className="loading">Loading</section>;
  }
  return (
    <main>
      <h1>
        <b>Acme HR Directory:</b>
      </h1>
      <h2>All Departments:</h2>
      <ul>
        {departments.map((department) => (
          <li key={department.id}>{department.name}</li>
        ))}
      </ul>
    </main>
  );
};

export default App;
