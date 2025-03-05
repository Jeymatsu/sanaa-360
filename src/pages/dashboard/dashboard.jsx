import React, { useState } from 'react';
import DefaultLayout from "../../pages/default/default";
import Hero from '../../components/hero/hero';
import ProcessSteps from '../../components/steps/processSteps';
import ChallengesSection, { ChallengeExplorer } from '../../components/challenges/challenges';
import TikTokAuth from '../login/auth';





const Dashboard = () => {
 

  return (
    
<DefaultLayout>
       
       <Hero/>
       <ProcessSteps/>
       <ChallengeExplorer/>
       </DefaultLayout>
  );
};

export default Dashboard;


