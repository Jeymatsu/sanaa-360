import React, { useState } from 'react';
import DefaultLayout from "../../pages/default/default";
import Hero from '../../components/hero/hero';
import ProcessSteps from '../../components/steps/processSteps';
import ChallengesSection from '../../components/challenges/challenges';
import TikTokAuth from '../login/auth';





const Dashboard = () => {
 

  return (
    
<DefaultLayout>
       
       <Hero/>
       <ProcessSteps/>
       <ChallengesSection/>
       <TikTokAuth/>
       
       </DefaultLayout>
  );
};

export default Dashboard;


