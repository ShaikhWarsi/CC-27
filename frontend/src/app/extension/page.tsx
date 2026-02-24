'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Download, Shield, Eye, Zap, Chrome, CheckCircle, ArrowRight } from 'lucide-react';

const features = [
    {
        icon: Eye,
        title: 'Real-Time Link Scanning',
        description: 'Hover over any link and instantly see if it\'s safe or suspicious — powered by AI.',
        color: 'blue',
    },
    {
        icon: Shield,
        title: 'Phishing Protection',
        description: 'Get instant warnings before you click on dangerous phishing links hiding in emails and websites.',
        color: 'emerald',
    },
    {
        icon: Zap,
        title: 'Lightweight & Fast',
        description: 'Runs silently in the background with zero impact on your browsing speed.',
        color: 'amber',
    },
];

const steps = [
    {
        step: '1',
        title: 'Download the Extension',
        description: 'Click the download button to get the extension zip file.',
    },
    {
        step: '2',
        title: 'Extract the ZIP',
        description: 'Unzip the downloaded file to a folder on your computer.',
    },
    {
        step: '3',
        title: 'Open Chrome Extensions',
        description: 'Go to chrome://extensions and enable "Developer mode" in the top right.',
    },
    {
        step: '4',
        title: 'Load the Extension',
        description: 'Click "Load unpacked" and select the extracted folder. You\'re all set!',
    },
];

export default function ExtensionPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                <Chrome size={18} />
                                <span>Chrome Extension</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                                Fish Pish — <span className="text-blue-500">Phishing Detector</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg">
                                AI-powered real-time phishing detection for every link you encounter.
                                Stay protected while browsing with our free Chrome extension.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="/fish-pish-extension.zip"
                                    download="fish-pish-extension.zip"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
                                >
                                    <Download size={22} />
                                    Download Extension
                                </a>
                                <a
                                    href="#how-to-install"
                                    className="inline-flex items-center gap-2 px-6 py-4 bg-white text-slate-700 rounded-2xl font-semibold border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all"
                                >
                                    How to Install
                                    <ArrowRight size={18} />
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-[2rem] p-10 border border-white/50 shadow-2xl">
                                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-4">
                                    {/* Mock browser bar */}
                                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                        </div>
                                        <div className="flex-1 bg-slate-50 rounded-lg h-8 flex items-center px-3">
                                            <span className="text-xs text-slate-400">https://example.com</span>
                                        </div>
                                    </div>

                                    {/* Mock tooltip */}
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                        className="mt-4"
                                    >
                                        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                            <div className="h-3 bg-slate-200 rounded-full w-3/4" />
                                            <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                                            <div className="flex items-center gap-2 mt-3 text-blue-500 underline text-sm cursor-pointer">
                                                <span>suspicious-link.xyz/login</span>
                                            </div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1, duration: 0.4 }}
                                            className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3"
                                        >
                                            <div className="bg-red-500 text-white p-1.5 rounded-lg">
                                                <Shield size={16} />
                                            </div>
                                            <div>
                                                <div className="text-red-700 font-bold text-sm">⚠️ Phishing Detected!</div>
                                                <div className="text-red-500 text-xs">This link may steal your credentials</div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Use Fish Pish?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Our extension brings AI-powered phishing detection right to your browser — no configuration needed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const colorMap: Record<string, { bg: string; text: string }> = {
                                blue: { bg: 'bg-blue-500', text: 'text-blue-600' },
                                emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600' },
                                amber: { bg: 'bg-amber-500', text: 'text-amber-600' },
                            };
                            const colors = colorMap[feature.color];
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                    className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow"
                                >
                                    <div className={`${colors.bg} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6`}>
                                        <feature.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Installation Steps */}
            <section id="how-to-install" className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Install</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Get up and running in under a minute. Follow these simple steps.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {steps.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm"
                            >
                                <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                                    <p className="text-slate-600">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Final CTA */}
                    <div className="mt-16 text-center">
                        <motion.a
                            href="/fish-pish-extension.zip"
                            download="fish-pish-extension.zip"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                        >
                            <Download size={24} />
                            Download Fish Pish Extension
                        </motion.a>
                        <p className="text-slate-500 mt-4 text-sm flex items-center justify-center gap-2">
                            <CheckCircle size={16} className="text-emerald-500" />
                            Free &amp; open-source · Chrome compatible · v1.0.0
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
