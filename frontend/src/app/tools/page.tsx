'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import ModuleLayout from '@/components/ModuleLayout';
import RealFakeChallenge from '@/components/RealFakeChallenge';
import LinkDetective from '@/components/LinkDetective';
import Footer from '@/components/Footer';
import { HelpCircle, Search, ExternalLink, ShieldAlert, MousePointer2, AlertTriangle, Link as LinkIcon } from 'lucide-react';

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-slate-50 relative">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div className="mb-12 max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Security Tools & Challenges</h1>
            <p className="text-xl text-slate-600">Interactive tools to help you identify threats and test your security skills in a safe environment. Practice here, stay safe everywhere.</p>
        </div>

        <div className="grid grid-cols-1 gap-20">
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shadow-sm">
                            <HelpCircle size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Real vs Fake Challenge</h2>
                            <p className="text-slate-500 font-medium">Practice your identification skills with real-world examples.</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-8">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 w-full">
                        <RealFakeChallenge />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex gap-4">
                            <div className="bg-amber-100 p-3 rounded-xl h-fit">
                                <ShieldAlert className="text-amber-600" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">What to look for?</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">Check the sender's email address for subtle misspellings, look for urgent language, and inspect any links before clicking.</p>
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl h-fit">
                                <ExternalLink className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">Why practice?</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">Phishing is the #1 way hackers gain access. Regular practice builds the "muscle memory" needed to stay safe.</p>
                            </div>
                        </div>
                        <div className="p-6 bg-emerald-600 rounded-3xl text-white shadow-lg shadow-emerald-200 flex gap-4">
                            <div className="bg-white/20 p-3 rounded-xl h-fit">
                                <AlertTriangle className="text-white" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold mb-1">Pro Tip</h4>
                                <p className="text-emerald-50 text-sm leading-relaxed">When in doubt, don't click. Contact the sender through a known, trusted channel to verify.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-sm">
                            <Search size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Link Detective</h2>
                            <p className="text-slate-500 font-medium">Uncover the truth behind suspicious URLs.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 w-full">
                        <LinkDetective />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-lg shadow-blue-200">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <LinkIcon size={28} />
                                The Detective Method
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                    <div className="flex items-center gap-2 font-bold mb-2">
                                        <MousePointer2 size={18} className="text-blue-200" />
                                        01 Hover First
                                    </div>
                                    <p className="text-blue-100 text-sm leading-relaxed">Hover over links to see where they go. Don't trust display text.</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                    <div className="flex items-center gap-2 font-bold mb-2">
                                        <AlertTriangle size={18} className="text-blue-200" />
                                        02 Check Domain
                                    </div>
                                    <p className="text-blue-100 text-sm leading-relaxed">Look for misspellings like "g00gle.com" or "paypa1.com".</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                    <div className="flex items-center gap-2 font-bold mb-2">
                                        <ShieldAlert size={18} className="text-blue-200" />
                                        03 Verify SSL
                                    </div>
                                    <p className="text-blue-100 text-sm leading-relaxed">Check for HTTPS, but remember even malicious sites can use it.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <ShieldAlert size={24} />
                                </div>
                                <h4 className="text-2xl font-bold">Safe Browsing</h4>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Use this tool to safely inspect links without actually visiting them. Our engine analyzes URL structures, SSL certificates, and reputation databases to keep you safe.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
