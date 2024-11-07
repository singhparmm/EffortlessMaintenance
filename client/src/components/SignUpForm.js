
import React, { useState, useEffect } from 'react';
import './SignUpForm.css'; // Separate CSS for signup form

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    retype_password: ''
  });

  const [message, setMessage] = useState(''); // To display feedback to the user

  useEffect(() => {
    const supercarImages = document.querySelector('.supercar-images');
    let positionY = 0;
    const speed = 0.8; // Speed of scrolling (pixels per frame)

    const cloneImages = () => {
      const originalImages = Array.from(supercarImages.children);
      originalImages.forEach((image) => {
        const clone = image.cloneNode(true); // Clone each image
        supercarImages.appendChild(clone); // Append the clone to the end
      });
    };

    cloneImages(); // Duplicate the images for smooth looping

    const moveImages = () => {
      positionY += speed;
      supercarImages.style.transform = `translateY(-${positionY}px)`;

      if (positionY >= supercarImages.scrollHeight / 2) {
        positionY = 0; // Reset to the top for seamless looping
      }

      requestAnimationFrame(moveImages);
    };

    moveImages();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (formData.password !== formData.retype_password) {
      setMessage("Passwords do not match.");
      return;
    }

    fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => {
          throw new Error(data.message);
        });
      }
    })
    .then(data => {
      setMessage(data.message); // Display server success message
    })
    .catch(error => {
      setMessage(`Error: ${error.message}`);
      console.error("Error during sign-up:", error);
    });
  };

  return (
    <div className="signup-page">
      <video autoPlay muted loop className="video-background">
        <source src="/12421669_3840_2160_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content-wrapper">
        <div className="signup-container">
          <h2>Create Your Account</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="retype_password"
              placeholder="Retype Password"
              value={formData.retype_password}
              onChange={handleChange}
              required
            />
            {message && <p className="message">{message}</p>} {/* Display feedback message */}
            <button type="submit" className="btn-signup">Sign Up</button>
          </form>
        </div>

        <div className="supercar-container">
          <div className="supercar-images">
            <img src="/supercars/car7.jfif" alt="Aston Martin Vantage" />
            <img src="/supercars/car1.jfif" alt="911 GT3 RS" />
            <img src="/supercars/car2.jfif" alt="Camaro ZL1" />
            <img src="/supercars/car3.jfif" alt="Bugatti Chiron Pur Sport" />
            <img src="/supercars/car4.jfif" alt="SF90 Stradale" />
            <img src="/supercars/car5.jfif" alt="Lamborghini Aventador" />
            <img src="/supercars/car6.jfif" alt="Lamborghini Revuelto" />
          </div>
        </div>
      </div>

      <div className="additional-section">
        <p>       Join our community of car enthusiasts and stay ahead of your vehicle’s maintenance needs with our smart tracking system. Our platform helps you organize all your car’s service records, get personalized maintenance reminders, and predict upcoming care based on your driving patterns. Sign up today to ensure your car is always in top shape, save time, and avoid costly repairs. With a sleek interface and easy-to-use features, keeping your vehicle well-maintained has never been simpler. Drive smarter, drive safer—sign up now!</p>
      </div>
    </div>
  );
};

export default SignUpForm;
