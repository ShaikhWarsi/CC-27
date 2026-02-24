'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import WhyAwareness from '@/components/WhyAwareness';
import { Zap, Shield, Lock, Eye, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 relative">
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

      {/* Featured Sections / Quick Links */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Start Your Security Journey</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Choose a path to begin building your digital defenses. We recommend starting with the Learning Hub.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Link href="/learn" className="group p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-blue-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <Shield size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Learning Hub</h3>
            <p className="text-slate-600 mb-6">Master essential cyber hygiene and learn to spot phishing attempts before they catch you.</p>
            <span className="text-blue-600 font-semibold flex items-center gap-2">
              Start Learning <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>

          <Link href="/tools" className="group p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-emerald-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <Lock size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Security Tools</h3>
            <p className="text-slate-600 mb-6">Use our interactive tools to analyze links and test your ability to distinguish real from fake.</p>
            <span className="text-emerald-600 font-semibold flex items-center gap-2">
              Try Tools <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>

          <Link href="/about" className="group p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-purple-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Achievement Path</h3>
            <p className="text-slate-600 mb-6">Track your progress, earn badges, and understand why cyber awareness is critical today.</p>
            <span className="text-purple-600 font-semibold flex items-center gap-2">
              View Progress <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-6">
                <BookOpen size={16} />
                Knowledge Check
              </div>
              <h2 className="text-4xl font-bold mb-6">Ready to certify your skills?</h2>
              <p className="text-slate-400 text-lg mb-8">Take our comprehensive cyber security quiz to earn your first set of badges and prove your mastery of digital safety.</p>
              <Link href="/quiz" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
                Take the Quiz
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-1">10+</div>
                <div className="text-slate-400 text-sm">Security Questions</div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-1">5</div>
                <div className="text-slate-400 text-sm">Unique Badges</div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-slate-400 text-sm">Free Forever</div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-1">AI</div>
                <div className="text-slate-400 text-sm">24/7 Doubts Assistant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <Footer />
    </main>
  );
}
