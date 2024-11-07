import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const CarDetail = ({ cars, setCars }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize newMileage state at the top
  const [newMileage, setNewMileage] = useState('');

  // Attempt to retrieve the car based on the id
  const car = cars[id];

  // Redirect to home if the car is not found
  if (!car) {
    navigate('/');
    return null;
  }

  // Ensure mileageHistory exists to avoid undefined errors
  if (!car.mileageHistory) {
    car.mileageHistory = [];
  }

  const handleAddMileage = () => {
    if (newMileage) {
      const updatedCars = [...cars];
      updatedCars[id] = {
        ...updatedCars[id],
        mileageHistory: [
          ...updatedCars[id].mileageHistory,
          { date: new Date(), mileage: parseInt(newMileage) }
        ]
      };
      setCars(updatedCars);
      localStorage.setItem('cars', JSON.stringify(updatedCars));
      setNewMileage('');
    }
  };

  const mileageData = {
    labels: car.mileageHistory.map((entry) => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: `${car.make} ${car.model} Mileage Over Time`,
        data: car.mileageHistory.map((entry) => entry.mileage),
        fill: false,
        borderColor: '#4caf50',
      },
    ],
  };

  return (
    <div className="car-detail">
      <h1>{car.year} {car.make} {car.model}</h1>
      <img src={car.imageUrl} alt={`${car.make} ${car.model}`} style={{ width: '300px', height: 'auto', marginBottom: '20px' }} />
      
      <h2>Mileage History</h2>
      {car.mileageHistory.length > 0 ? (
        <Line data={mileageData} />
      ) : (
        <p>No mileage data available. Add a mileage entry to start tracking.</p>
      )}

      <h3>Update Mileage</h3>
      <input
        type="number"
        value={newMileage}
        onChange={(e) => setNewMileage(e.target.value)}
        placeholder="Enter new mileage"
      />
      <button onClick={handleAddMileage}>Add Mileage</button>
    </div>
  );
};

export default CarDetail;
