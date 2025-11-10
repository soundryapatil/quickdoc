import React, { useState } from 'react';
// useNavigate not required here
import api from '../api';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleToggle = () => setIsRegister(!isRegister);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const res = await api.signup(name, email, password);
        localStorage.setItem('prescripto_token', res.token);
        // after signup, go to home
        window.location.href = '/';
      } else {
        const res = await api.login(email, password);
        localStorage.setItem('prescripto_token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        // Redirect based on user role
        if (res.user && res.user.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else if (res.user && res.user.role === 'doctor') {
          window.location.href = '/doctor/dashboard';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.message || err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {isRegister ? (
          <>
            <h2>Create Account</h2>
            <p>Please sign up to book appointment</p>
            <form onSubmit={handleSubmit}>
              <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Full name" required />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
              <button type="submit" className="btn btn-primary">Create account</button>
            </form>
            <p className="auth-toggle-text">
              Already have an account? <span onClick={handleToggle}>Login here</span>
            </p>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <p>Please login to book appointment</p>
            <form onSubmit={handleSubmit}>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p className="auth-toggle-text">
              Don't have an account? <span onClick={handleToggle}>Register here</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;