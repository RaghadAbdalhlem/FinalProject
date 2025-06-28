import React from 'react';
import './Dashboard.css'; // ייבוא CSS

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <div className="card">
          <h2>Students</h2>
          <p>Manage and view student data.</p>
        </div>
        <div className="card">
          <h2>Quizzes</h2>
          <p>Create and edit quizzes.</p>
        </div>
        <div className="card">
          <h2>Reports</h2>
          <p>View performance reports.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
