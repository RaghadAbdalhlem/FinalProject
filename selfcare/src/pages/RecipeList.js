import React, { useEffect, useState } from 'react';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]); // מגדירים state לאחסון המתכונים

  // פעולה לשליפת המתכונים מ-API
  useEffect(() => {
    fetch('http://localhost:5000/api/recipes')  // כתובת ה-API לשליפת המתכונים
      .then((response) => response.json())  // המרה ל-JSON
      .then((data) => setRecipes(data))  // עדכון state עם הנתונים שהתקבלו
      .catch((error) => console.error('Error:', error));  // טיפול בשגיאות
  }, []);

  return (
    <div>
      <h1>Recipe List</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <h2>{recipe.name}</h2>
            <p>{recipe.description}</p>
            <p>Category: {recipe.category}</p>
            <p>Rating: {recipe.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
