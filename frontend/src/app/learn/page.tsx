'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import ModuleLayout from '@/components/ModuleLayout';
import HygieneCards from '@/components/HygieneCards';
import PhishingGuide from '@/components/PhishingGuide';
import CyberQuiz from '@/components/CyberQuiz';
import Footer from '@/components/Footer';
import { ShieldCheck, Search, BookOpen } from 'lucide-react';

import Link from 'next/link';

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-slate-50 relative">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Cyber Security Learning Hub</h1>
        <p className="text-xl text-slate-600 mb-12">Master the basics of digital safety with our interactive guides and quizzes.</p>

        <div className="flex flex-col gap-20">
            {/* Cyber Hygiene Section */}
            <section className="space-y-12">
                <ModuleLayout
                    id="hygiene"
                    title="Smart Cyber Hygiene Habits"
                    description="Good security starts with the basics. Master these simple habits to build a strong digital immune system."
                    icon={ShieldCheck}
                    variant="blue"
                >
                    <HygieneCards />
                </ModuleLayout>

                <div className="p-10 bg-blue-50 rounded-[2.5rem] border border-blue-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h3 className="text-3xl font-bold text-blue-900 mb-6">Password Best Practices</h3>
                            <p className="text-blue-800/80 mb-6 text-lg">A strong password is your first line of defense. Follow these industry standards to keep your accounts secure.</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "12-16 characters minimum",
                                    "Mix of letters & symbols",
                                    "Unique for every site",
                                    "Use a Password Manager",
                                    "Enable 2FA everywhere",
                                    "Avoid personal info"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-blue-800 font-semibold bg-white/50 p-3 rounded-xl border border-blue-100">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm flex flex-col justify-center text-center">
                            <div className="text-blue-600 mb-4 flex justify-center">
                                <ShieldCheck size={48} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">The "Golden Rule"</h4>
                            <p className="text-slate-600">If you use the same password twice, you are twice as vulnerable. Use a unique password for every single account.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phishing Section */}
            <section className="space-y-12">
                <ModuleLayout
                    id="phishing"
                    title="Recognizing Phishing Red Flags"
                    description="Hackers use predictable psychological tricks. Learn to spot the signs before you click."
                    icon={Search}
                    variant="amber"
                >
                    <PhishingGuide />
                </ModuleLayout>

                <div className="p-10 bg-amber-50 rounded-[2.5rem] border border-amber-100 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2">
                            <h3 className="text-3xl font-bold text-amber-900 mb-6">Spotting Deceptive Links</h3>
                            <p className="text-amber-800/80 mb-8 text-lg">Before clicking any link, always verify its destination. Attackers often hide malicious URLs behind friendly-looking text.</p>
                            
                            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-1">
                                        <p className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-wider">Example Message</p>
                                        <p className="text-slate-800 text-lg">Your account has been locked. <span className="text-blue-600 underline font-bold cursor-pointer hover:text-blue-800 transition-colors">Click here to verify.</span></p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm w-full md:w-auto">
                                        <p className="text-slate-400 mb-1">Hover Preview:</p>
                                        <p className="text-red-500 font-bold break-all">http://secure-login-fake.com/steal-creds</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-amber-600 p-8 rounded-3xl text-white shadow-lg shadow-amber-200 flex flex-col justify-center">
                            <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Search size={24} />
                                The Secret
                            </h4>
                            <p className="text-amber-50 leading-relaxed">
                                Most phishing links use "Typosquatting"—subtle misspellings like <strong>g00gle.com</strong> or <strong>microssoft.com</strong>. Always read the domain name character by character.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 mt-20 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to test your knowledge?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Now that you've reviewed the basics of cyber hygiene and phishing, see how much you've retained by taking our official assessment.
            </p>
            <Link href="/quiz" className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200">
                <BookOpen size={24} />
                Start the Quiz Now
            </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
