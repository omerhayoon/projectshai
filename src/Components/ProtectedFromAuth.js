
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedFromAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post('http://localhost:9124/api/check-session', null, {
          withCredentials: true
        });
        setIsAuthenticated(response.data.success);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  
  return isAuthenticated ? <Navigate to="/homepage" /> : children;
};

export default ProtectedFromAuth;