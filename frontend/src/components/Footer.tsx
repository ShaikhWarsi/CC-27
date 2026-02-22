'use client';

import React from 'react';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-blue-500 p-2 rounded-xl text-white">
                            <Shield size={24} />
                        </div>
                        <span className="text-2xl font-bold text-slate-900">SafeSurf</span>
                    </div>
                    <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
                        Empowering students and everyday internet users with the knowledge to navigate the digital world safely. Awareness is your strongest shield.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                            <Linkedin size={20} />
                        </a>
                        <a href="#" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                            <Github size={20} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 mb-6">Learn</h4>
                    <ul className="space-y-4 text-slate-500">
                        <li><a href="#hygiene" className="hover:text-blue-500 transition-colors">Cyber Hygiene</a></li>
                        <li><a href="#phishing" className="hover:text-blue-500 transition-colors">Spotting Phishing</a></li>
                        <li><a href="#challenge" className="hover:text-blue-500 transition-colors">Interactive Challenge</a></li>
                        <li><a href="#quiz" className="hover:text-blue-500 transition-colors">Knowledge Quiz</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
                    <ul className="space-y-4 text-slate-500">
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Security Checklist</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Report a Scam</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Student Guide</a></li>
                        <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                <p>© 2024 SafeSurf Cybersecurity Education. Built for the Hackathon.</p>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-slate-600 transition-colors">Privacy Settings</a>
                </div>
            </div>
        </footer>
    );
}
