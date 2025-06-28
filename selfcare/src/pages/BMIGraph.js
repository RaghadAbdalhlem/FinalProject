import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import '../styles/BMIGraph.css'; // וודא שהנתיב הזה נכון

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const BMIGraph = () => {
  console.log("BMIGraph loaded!"); // הודעה ש-BMIGraph נטען

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const bmiValue = weight / ((height / 100) ** 2);
      return bmiValue.toFixed(2);
    }
    return 0;
  };

  const handleCalculate = () => {
    const bmiValue = calculateBMI(height, weight);
    setBmi(bmiValue);
  };

  const data = {
    labels: ['Normal BMI', 'Your BMI'],
    datasets: [
      {
        label: 'BMI',
        data: [22, bmi || 0],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="bmi-container">
      <h2>BMI Calculator</h2>
      <form className="bmi-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="height">Height (cm):</label>
        <input
          type="number"
          id="height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Enter height in cm"
        />

        <label htmlFor="weight">Weight (kg):</label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight in kg"
        />

        <button type="button" onClick={handleCalculate}>
          Calculate BMI
        </button>
      </form>

      {bmi && <h3>Your BMI: {bmi}</h3>}

      <div className="bmi-chart">
        <Line data={data} />
      </div>
    </div>
  );
};

export default BMIGraph;
