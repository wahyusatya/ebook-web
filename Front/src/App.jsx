import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Import ProtectedRoute
import ProtectedRoute from './components/ProtectedRoute';

// Import main styles
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full text-gray-900"> {/* Added w-full */}
        {/* Header can be placed here if it's common to all pages */}
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* User Routes - Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Protected and Admin Only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* TODO: Add a 404 Not Found page */}
        </Routes>
        {/* Footer can be placed here if it's common to all pages */}
      </div>
    </BrowserRouter>
  );
}

export default App;