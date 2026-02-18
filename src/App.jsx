import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Selection from './Selection';
import WritingStudio from './WritingStudio';
import ReadingSanctuary from './ReadingSanctuary';
import Analytics from './Analytics';
import Settings from './Settings';
import LandingPage from './LandingPage';
import HomePage from './HomePage';
import DashboardPage from './DashboardPage';
import Auth from './Auth';
import Entrance from './Entrance';
import Profile from './Profile';

function App() {
  return (
    <div className="app-main-wrapper">
      <div className="app-sanctuary-bg"></div>
      <div className="app-sanctuary-overlay"></div>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/entrance" element={<Entrance />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/select" element={<Selection />} />
        <Route path="/track/read" element={<ReadingSanctuary />} />
        <Route path="/track/write" element={<WritingStudio />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
