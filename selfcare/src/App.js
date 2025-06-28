import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeList from './pages/RecipeList'; // ייבוא RecipeList בצורה יחסית

function App() {
  return (
    <Router>
      <Routes>
        {/* דף הבית */}
        <Route path="/" element={<h1>Welcome to the Home Page!</h1>} />
        {/* דף רשימת המתכונים */}
        <Route path="/recipes" element={<RecipeList />} />
      </Routes>
    </Router>
  );
}

export default App;
