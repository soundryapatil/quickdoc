import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';

const DoctorRoute = ({ children }) => {
  const user = getUserFromToken();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'doctor') return <Navigate to="/" />;
  return children;
};

export default DoctorRoute;
