import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const admin = await authService.isAdmin();
        setIsAdmin(admin);
        console.log(`User is ${admin ? 'Admin' : 'User'}`); // Log user role
        if (adminOnly && !admin) {
          navigate('/');
        }
      } else {
        navigate('/login');
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, adminOnly]);

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (adminOnly && !isAdmin) {
    return null;
  }

  return children;
};

export default ProtectedRoute;