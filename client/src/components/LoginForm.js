import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // CSS for login form

const LoginForm = ({ setUser, setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setMessage("Login failed: Invalid credentials.");
        throw new Error("Login failed");
      }

      const data = await response.json();
      setMessage("Login successful");
      setUser({ email: data.user, first_name: data.first_name });
      setIsLoggedIn(true);
      navigate("/");

    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <video autoPlay muted loop className="video-background">
        <source src="/12421669_3840_2160_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-container">
        <h2>Log In to Your Account</h2>
        <form className="login-form" onSubmit={handleSubmit}>
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
          {message && <p className="message">{message}</p>}
          <button type="submit" className="btn-login">Log In</button>
        </form>
      </div>

      <ArticleSlider /> {/* Render the article slider on the right side */}
    </div>
  );
};

const ArticleSlider = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const fetchArticles = async () => {
    try {
      const response = await fetch(`https://api.currentsapi.services/v1/search?keywords=automotive&language=en&apiKey=28brq1VNE_rhZxORBs7LL-TuA-uBzkoGDZKynymBtOQyQhBa`);
      
      if (!response.ok) {
        throw new Error("Failed to load articles");
      }

      const data = await response.json();
      setArticles(data.news);

      // Cache articles and timestamp in localStorage
      localStorage.setItem('cachedArticles', JSON.stringify(data.news));
      localStorage.setItem('cacheTimestamp', Date.now());
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to load articles. Please try again later.");
    }
  };

  useEffect(() => {
    const cachedArticles = JSON.parse(localStorage.getItem('cachedArticles'));
    const cacheTimestamp = localStorage.getItem('cacheTimestamp');

    if (cachedArticles && cacheTimestamp) {
      const isCacheValid = Date.now() - cacheTimestamp < CACHE_DURATION;
      if (isCacheValid) {
        setArticles(cachedArticles);
      } else {
        fetchArticles(); // Fetch fresh articles if cache has expired
      }
    } else {
      fetchArticles(); // No cache found, fetch articles
    }
  }, []);

  return (
    <div className="article-slider">
      <h2 className="article-section-title">Latest Automotive News</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="articles">
        {articles.slice(0, 10).map((article, index) => (
          <div key={index} className="article">
            <img src={article.image || 'https://via.placeholder.com/250'} alt={article.title} className="article-image" />
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginForm;
