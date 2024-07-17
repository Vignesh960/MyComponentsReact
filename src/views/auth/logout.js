import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session storage
    sessionStorage.clear();
    // Redirect to the login page
    navigate('/login');
  }, [navigate]);

  // Render null because we don't need anything to be rendered
  return null;
};

export default Logout;
