'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import WhyAwareness from '@/components/WhyAwareness';
import BadgeSystem from '@/components/BadgeSystem';
import Footer from '@/components/Footer';

import { Shield, Target, Users, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 relative">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">About SafeSurf</h1>
            <p className="text-xl text-slate-600">We are dedicated to building a safer internet by empowering individuals with the tools and knowledge to protect themselves against evolving digital threats.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    <Target size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed">
                    Our mission is to democratize cyber security education. We believe that digital safety shouldn't be complicated or reserved for tech experts. Through interactive challenges and clear guidance, we help everyday users build a strong digital immune system.
                </p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="bg-emerald-100 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    <Lightbulb size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed">
                    We envision a world where phishing and social engineering are no longer effective because every user is equipped with the critical thinking skills to spot deceptive tactics instantly. A more aware digital society is a more secure one.
                </p>
            </div>
        </div>

        <div className="py-20 bg-blue-600 relative overflow-hidden rounded-[3rem] mb-20">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
                <div className="absolute bottom-20 right-20 w-60 h-60 border-4 border-white rounded-full" />
            </div>
            <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl font-bold text-white mb-6">Why Cyber Awareness Matters</h2>
                <WhyAwareness />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            <div className="lg:col-span-1">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Approach</h2>
                <p className="text-slate-600 mb-6">We use a three-pillar strategy to ensure effective learning and long-term retention of security habits.</p>
                <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-slate-700 font-medium">
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">1</div>
                        Learn through interaction
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 font-medium">
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">2</div>
                        Test with real-world scenarios
                    </li>
                    <li className="flex items-center gap-3 text-slate-700 font-medium">
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">3</div>
                        Reward progress and mastery
                    </li>
                </ul>
            </div>
            <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Gamified Mastery</h2>
                <p className="text-slate-600 mb-8">We believe in celebrating progress. Our achievement system tracks your journey from a security novice to a certified Quiz Master.</p>
                <BadgeSystem />
            </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
