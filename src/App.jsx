import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import RegisterCompany from './pages/RegisterCompany';
import AppointSecretary from './pages/AppointSecretary';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register-company" element={<RegisterCompany />} />
        <Route path="/appoint-secretary" element={<AppointSecretary />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </Router>
  );
}

export default App;
