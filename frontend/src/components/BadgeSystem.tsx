'use client';

import React from 'react';
import { Award, Shield, CheckCircle, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const badges = [
    { id: 'hygiene', name: 'Hygiene Learner', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', active: true },
    { id: 'redflag', name: 'Red Flag Spotter', icon: Target, color: 'bg-blue-50 text-blue-600', active: true },
    { id: 'detective', name: 'Link Detective', icon: Shield, color: 'bg-indigo-50 text-indigo-600', active: false },
    { id: 'smart', name: 'Cyber Smart', icon: Award, color: 'bg-amber-50 text-amber-600', active: false },
    { id: 'champion', name: 'SafeSurf Hero', icon: Users, color: 'bg-purple-50 text-purple-600', active: false },
];

export default function BadgeSystem() {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/3">
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Your Achievements</h3>
                    <p className="text-slate-500 mb-6">As you explore modules and complete challenges, you'll unlock special badges that certify your cyber-awareness.</p>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex justify-between text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">
                            <span>Progress</span>
                            <span>40%</span>
                        </div>
                        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                whileInView={{ width: '40%' }}
                                viewport={{ once: true }}
                            />
                        </div>
                    </div>
                </div>

                <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-500 ${badge.active ? badge.color : 'bg-slate-100 text-slate-300 grayscale'}`}>
                                <badge.icon size={32} />
                            </div>
                            <span className={`text-xs font-bold text-center ${badge.active ? 'text-slate-700' : 'text-slate-400'}`}>
                                {badge.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
