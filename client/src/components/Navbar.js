import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';  // Import the styles for the navbar

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();  // Get the current path
  const navigate = useNavigate(); // For redirecting after logout

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle the user logout
  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include', // Ensure cookies are sent for session
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(false); // Reset login state
          navigate('/login'); // Redirect to login page after logout
        } else {
          console.error('Failed to log out.');
        }
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  // Filter out the current page from the dropdown options
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Log In', path: '/login' },
    { name: 'Sign Up', path: '/signup' }
  ].filter(page => page.path !== location.pathname);  // Exclude the current page

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Effortless Maintenance</Link>  {/* Link to the home page */}
      </div>
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropdown-btn">
          {/* Hamburger icon is shown via CSS */}
        </button>
        {dropdownOpen && (
          <ul className="dropdown-menu">
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-logout">Log Out</button>
                </li>
              </>
            ) : (
              pages.map((page) => (
                <li key={page.path}>
                  <Link to={page.path} onClick={() => setDropdownOpen(false)}>
                    {page.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
