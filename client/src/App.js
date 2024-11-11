import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Navbar from './components/Navbar';
import CarForm from './components/CarForm';
import CarDetail from './components/CarDetail'; // New import for CarDetail component
import './App.css';


const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.REACT_APP_GOOGLE_CSE_ID;


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState(() => {
    const savedCars = localStorage.getItem('cars');
    return savedCars ? JSON.parse(savedCars) : [];
  });

  const checkLoginStatus = () => {
    fetch('http://localhost:5000/api/check-login', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) return response.json();
        else setIsLoggedIn(false);
      })
      .then((data) => {
        if (data?.user) {
          setIsLoggedIn(true);
          setUser(data);
        }
      })
      .catch((error) => console.error('Error checking login status:', error));
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleAddCar = (newCar) => {
    fetchCarImage(newCar.make, newCar.model, newCar.year).then((imageUrl) => {
      const updatedCars = [...cars, { ...newCar, imageUrl, mileageHistory: [{ date: new Date(), mileage: newCar.mileage }] }];
      setCars(updatedCars);
      localStorage.setItem('cars', JSON.stringify(updatedCars));
    });
  };

  const handleRemoveCar = (index) => {
    const updatedCars = cars.filter((_, i) => i !== index);
    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));
  };

  const fetchCarImage = async (make, model, year) => {
    const query = `${year} ${make} ${model} car`;
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${GOOGLE_CSE_ID}&key=${GOOGLE_API_KEY}&searchType=image&num=1`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.items?.[0]?.link || 'https://via.placeholder.com/300';
    } catch {
      return 'https://via.placeholder.com/300';
    }
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} user={user} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} user={user} cars={cars} onAddCar={handleAddCar} onRemoveCar={handleRemoveCar} />} />
        <Route path="/login" element={<LoginForm setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/car-detail/:id" element={<CarDetail cars={cars} setCars={setCars} />} /> {/* New route for car detail */}
      </Routes>
    </Router>
  );
}

function Home({ isLoggedIn, user, cars, onAddCar, onRemoveCar }) {
  const navigate = useNavigate();

  const handleCarClick = (index) => {
    navigate(`/car-detail/${index}`); // Navigate to car detail page
  };

  return (
    <div className="homepage">
      <video autoPlay muted loop className="video-background">
        <source src="/video.mp4" type="video/mp4" />
      </video>
      {isLoggedIn ? (
        <div className="car-management-section">
          <CarForm onAddCar={onAddCar} />
          <div className="car-list-section">
            {cars.length === 0 ? (
              <p>No cars added yet.</p>
            ) : (
              <ul>
                {cars.map((car, index) => (
                  <li key={index} onClick={() => handleCarClick(index)} style={{ cursor: 'pointer' }}>
                    <img src={car.imageUrl} alt={`${car.make} ${car.model}`} style={{ width: '200px', height: 'auto' }} />
                    <div>{car.year} {car.make} {car.model} - {car.mileage} miles</div>
                    <button onClick={(e) => { e.stopPropagation(); onRemoveCar(index); }} className="remove-car-btn">Remove</button> {/* Prevents propagation */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="content">
          <h1>Welcome to Effortless Maintenance Tracking</h1>
          <p>Sign up to easily track and manage your car's maintenance with predictive care and personalized alerts.</p>
          <div className="button-group">
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/signup" className="btn btn-signup">Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
