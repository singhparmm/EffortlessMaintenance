import React, { useEffect } from 'react';
import './CarForm.css';  // Import the CarForm CSS

const CarForm = ({ onAddCar }) => {
  useEffect(() => {
    // Initialize CarQuery API
    const carQueryInit = () => {
      const carquery = new window.CarQuery();

      // Run the carquery init function to get things started
      carquery.init();

      // Optional: Set filters to show only US models
      carquery.setFilters({ sold_in_us: true });

      // Initialize the year, make, model, and trim dropdowns
      carquery.initYearMakeModelTrim('car-years', 'car-makes', 'car-models', 'car-model-trims');
    };

    // Ensure CarQuery is available
    if (window.CarQuery) {
      carQueryInit();
    } else {
      console.error('CarQuery library not loaded.');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedCar = {
      year: e.target['car-years'].value,
      make: e.target['car-makes'].value,
      model: e.target['car-models'].value,
      trim: e.target['car-model-trims'].value,
      mileage: e.target['mileage'].value,
    };

    onAddCar(selectedCar);
  };

  return (
    <form onSubmit={handleSubmit} className="car-form">
      <h2>Add Car</h2>
      
      <div>
        <label>Year:</label>
        <select name="car-years" id="car-years" required></select>
      </div>

      <div>
        <label>Make:</label>
        <select name="car-makes" id="car-makes" required></select>
      </div>

      <div>
        <label>Model:</label>
        <select name="car-models" id="car-models" required></select>
      </div>

      <div>
        <label>Trim:</label>
        <select name="car-model-trims" id="car-model-trims"></select>
      </div>

      <div>
        <label>Mileage:</label>
        <input type="text" name="mileage" placeholder="Mileage" required />
      </div>

      <button type="submit" className="btn-submit">Add Car</button>
    </form>
  );
};

export default CarForm;
