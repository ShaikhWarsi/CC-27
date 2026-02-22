'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

export default function Hero() {
    return (
        <section id="home" className="pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        <ShieldCheck size={18} />
                        <span>Protecting your digital footprint</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                        Stay Safe Online — Learn to Spot Phishing with <span className="text-blue-500">Confidence</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-10 max-w-lg">
                        Interactive cybersecurity awareness designed for students and everyday internet users.
                        Master the art of identifying digital threats in a calm, supportive environment.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="#hygiene" className="btn-primary">
                            Start Exploring <ArrowRight size={20} />
                        </a>
                        <a href="#quiz" className="bg-white text-slate-700 px-6 py-3 rounded-2xl font-semibold border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95">
                            Jump to Quiz
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative z-10 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-[2rem] p-12 aspect-square flex items-center justify-center border border-white/50 shadow-2xl overflow-hidden">
                        {/* Animated Illustration Mockup */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative"
                        >
                            <div className="bg-white w-48 h-64 rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4">
                                <div className="flex justify-between">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                                        <Mail size={16} />
                                    </div>
                                    <div className="w-12 h-4 rounded-full bg-slate-100" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full h-3 rounded-full bg-slate-50" />
                                    <div className="w-full h-3 rounded-full bg-slate-50" />
                                    <div className="w-2/3 h-3 rounded-full bg-slate-50" />
                                </div>
                                <div className="mt-auto w-full h-8 rounded-lg bg-emerald-50 content-center text-center">
                                    <div className="h-2 w-16 bg-emerald-200 mx-auto rounded-full" />
                                </div>
                            </div>

                            <motion.div
                                animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-blue-50 text-blue-500"
                            >
                                <ShieldCheck size={48} />
                            </motion.div>

                            <motion.div
                                animate={{ x: [0, 20, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-amber-50 text-amber-500"
                            >
                                <Lock size={32} />
                            </motion.div>
                        </motion.div>

                        {/* Background Decorations */}
                        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
