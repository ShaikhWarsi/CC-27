'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ModuleLayout from '@/components/ModuleLayout';
import HygieneCards from '@/components/HygieneCards';
import PhishingGuide from '@/components/PhishingGuide';
import RealFakeChallenge from '@/components/RealFakeChallenge';
import CyberQuiz from '@/components/CyberQuiz';
import LinkDetective from '@/components/LinkDetective';
import BadgeSystem from '@/components/BadgeSystem';
import WhyAwareness from '@/components/WhyAwareness';
import Footer from '@/components/Footer';
import { ShieldCheck, Search, BookOpen, HelpCircle, UserCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 relative">
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-slate-100">
        <motion.div
          className="h-full bg-blue-500"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Demo Mode Toggle */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-all border-2 ${isDemoMode
              ? 'bg-amber-500 text-white border-amber-400'
              : 'bg-white text-slate-600 border-slate-100'
            }`}
        >
          <Zap size={18} fill={isDemoMode ? "currentColor" : "none"} />
          <span>{isDemoMode ? 'Demo Mode: ON' : 'Enable Demo Mode'}</span>
        </button>
      </div>

      <Navbar />

      <Hero />

      <ModuleLayout
        id="hygiene"
        title="Smart Cyber Hygiene Habits"
        description="Good security starts with the basics. Master these simple habits to build a strong digital immune system."
        icon={ShieldCheck}
        variant="blue"
      >
        <HygieneCards />
      </ModuleLayout>

      <ModuleLayout
        id="phishing"
        title="Recognizing Phishing Red Flags"
        description="Hackers use predictable psychological tricks. Learn to spot the signs before you click."
        icon={Search}
        variant="amber"
      >
        <PhishingGuide />
      </ModuleLayout>

      <div className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-60 h-60 border-4 border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Why Cyber Awareness Matters</h2>
          <WhyAwareness />
        </div>
      </div>

      <ModuleLayout
        id="challenge"
        title="Real vs Fake Challenge"
        description="Put your new skills to the test. Can you distinguish a legitimate message from a deceptive one?"
        icon={HelpCircle}
        variant="emerald"
      >
        <RealFakeChallenge />
      </ModuleLayout>

      <div className="bg-slate-100/50 py-20">
        <ModuleLayout
          id="quiz"
          title="Cyber Hygiene Knowledge Quiz"
          description="A quick check to reinforce what you've learned. No pressure, just progress!"
          icon={BookOpen}
          variant="blue"
        >
          <CyberQuiz />
        </ModuleLayout>
      </div>

      <ModuleLayout
        id="detective"
        title="Link Detective"
        description="Inspect suspicious URLs and learn how to uncover the true destination of any link."
        icon={Search}
        variant="blue"
      >
        <LinkDetective />
      </ModuleLayout>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <BadgeSystem />
      </div>

      <Footer />
    </main>
  );
}
