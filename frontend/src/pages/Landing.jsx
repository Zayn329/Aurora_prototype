import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import OperationLayer from '../components/landing/OperationLayer';
import OperationWorkspace from '../components/landing/OperationWorkspace';
import IntelligenceSection from '../components/landing/IntelligenceSection';
import PolarFrontier from '../components/landing/PolarFrontier';
import CommandShowcase from '../components/landing/CommandShowcase';
import LandingCta from '../components/landing/LandingCta';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100/70 via-blue-50/50 via-cyan-50/30 to-slate-100 text-slate-900 flex flex-col font-sans selection:bg-sky-900 selection:text-white relative overflow-x-clip scroll-smooth">
      {/* Subtle Polar Ocean Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-sky-300/40 via-blue-200/25 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-tr from-blue-200/20 via-sky-300/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[2200px] left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-br from-cyan-200/20 via-sky-200/15 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Polar Navigation */}
      <Navbar />

      {/* Main Landing Sections Flow */}
      <main className="flex-1 pt-16">
        {/* 01 — HERO: Plan. Move. Monitor. Respond. */}
        <Hero secondaryCtaLink="#how-it-works" />

        {/* 02 — WORKFLOW VIDEO: Mission Command in Extreme Environments */}
        <HowItWorks videoSrc="/over.mp4" />

        {/* 03 — ONE OPERATIONAL LAYER: Southern Ocean & Ice-Shelf Resupply */}
        <OperationLayer />

        {/* 04 — INTELLIGENCE LAYER: From raw data to mission decisions */}
        <IntelligenceSection />

       

        

        
      </main>

      {/* 08 — CTA & POLAR FOOTER: Coordinate the next operation. */}
      <LandingCta />
    </div>
  );
}
