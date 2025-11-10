import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllDoctors from './pages/AllDoctors';
import DoctorDetails from './pages/DoctorDetails';
import AboutUs from './pages/AboutUs';    
import ContactUs from './pages/ContactUs';  
import AuthPage from './pages/AuthPage';   
import MyAppointments from './pages/MyAppointments';
import Profile from './pages/Profile';
import AdminLayout from './admin/AdminLayout';
import AdminRoute from './admin/AdminRoute';
import Dashboard from './admin/Dashboard';
import AdminAppointments from './admin/Appointments';
import AddDoctor from './admin/AddDoctor';
import DoctorsList from './admin/DoctorsList';

import DoctorLayout from './doctor/DoctorLayout';
import DoctorRoute from './doctor/DoctorRoute';
import DoctorDashboard from './doctor/Dashboard';
import DoctorAppointments from './doctor/Appointments';
import DoctorProfile from './doctor/Profile';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<AllDoctors />} />
          <Route path="/doctor-details" element={<DoctorDetails />} />
          <Route path="/about" element={<AboutUs />} />      
          <Route path="/contact" element={<ContactUs />} />    
          <Route path="/login" element={<AuthPage />} />       
          <Route path="/register" element={<AuthPage />} />    
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="add-doctor" element={<AddDoctor />} />
            <Route path="doctors-list" element={<DoctorsList />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor/*" element={
            <DoctorRoute>
              <DoctorLayout />
            </DoctorRoute>
          }>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="profile" element={<DoctorProfile />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;