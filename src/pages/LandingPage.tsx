import React from 'react';
import { useLenis } from '../hooks/useLenis';
import ScrollProgress from '../components/ScrollProgress';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import HowItWorks from '../components/HowItWorks';
import FounderMode from '../components/FounderMode';
import VCMode from '../components/VCMode';
import WowMoment from '../components/WowMoment';
import ChatGPTComparison from '../components/ChatGPTComparison';
import FallingPatternDemo from '../components/FallingPatternDemo';
import Closing from '../components/Closing';

export default function LandingPage() {
  // Initialize smooth scroll
  useLenis();

  return (
    <>
      <ScrollProgress />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      
      <div className="space-y-0">
        <FounderMode />
        <VCMode />
      </div>
      
      <WowMoment />
      <ChatGPTComparison />
      <div className="px-4 md:px-20">
        <FallingPatternDemo />
      </div>
      <Closing />
    </>
  );
}
