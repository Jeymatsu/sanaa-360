import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DefaultLayout from './pages/default/default'
import Hero from './components/hero/hero'
import ProcessSteps from './components/steps/processSteps'
import ChallengesSection from './components/challenges/challenges'
import TikTokAuth from './pages/login/auth'
import Dashboard from './pages/dashboard/dashboard';
import TermsOfService from './pages/legal/termsOfService';
import PrivacyPolicy from './pages/legal/privacyPolicy';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>

      <Route path="/" element={<Dashboard />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      </Routes>

    </Router>
   
     
  )
}

export default App
