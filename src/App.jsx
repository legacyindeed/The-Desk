import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Selection from './Selection';
import WritingStudio from './WritingStudio';
import ReadingSanctuary from './ReadingSanctuary';
import Analytics from './Analytics';
import Settings from './Settings';
import Home from './Home';
import DashboardPage from './DashboardPage';
import Auth from './Auth';
import Entrance from './Entrance';

const ProfilePlaceholder = () => {
  const navigate = useNavigate();
  return (
    <div className="selection-page">
      <div className="container" style={{ textAlign: 'center', marginTop: '10rem' }}>
        <h1>👤 User Profile</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your stats and personal achievements here.</p>
        <button className="btn-back-fancy" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="app-main-wrapper">
      <div className="app-sanctuary-bg"></div>
      <div className="app-sanctuary-overlay"></div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/entrance" element={<Entrance />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/select" element={<Selection />} />
        <Route path="/track/read" element={<ReadingSanctuary />} />
        <Route path="/track/write" element={<WritingStudio />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<ProfilePlaceholder />} />
      </Routes>
    </div>
  );
}

export default App;
