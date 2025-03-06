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
import Callback from './components/callback/callback';
import ChallengeDetails from './components/challenges/challengeDetails';
import TikTokUploader from './components/content/posting';
import HowItWorks from './components/resources/howItWorks';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/login" element={<TikTokAuth />} />
      <Route path="/challenges/:challengeId" element={<ChallengeDetails />} />
      <Route path="/content" element={<TikTokUploader />} />
      <Route path="/how-it-works" element={<HowItWorks />} />


      </Routes>
    </Router>


     
  )
}

export default App
