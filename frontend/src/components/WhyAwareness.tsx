'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ShieldAlert, BadgeDollarSign, Fingerprint } from 'lucide-react';

const reasons = [
    {
        title: 'Social Engineering',
        description: 'Phishing isn’t just a technical attack; it’s a psychological one. Attackers manipulate human emotions like trust, fear, and curiosity.',
        icon: Brain,
        color: 'text-blue-500 bg-blue-50'
    },
    {
        title: 'Identity Theft',
        description: 'A single stolen login can lead to attackers taking over your entire digital identity, from social media to government services.',
        icon: Fingerprint,
        color: 'text-emerald-500 bg-emerald-50'
    },
    {
        title: 'Financial Loss',
        description: 'Phishing is the #1 way attackers gain access to bank accounts and corporate financial systems, causing billions in losses globally.',
        icon: BadgeDollarSign,
        color: 'text-amber-500 bg-amber-50'
    },
    {
        title: 'Data Breaches',
        description: 'Many of the world\'s largest data breaches started with a single employee clicking on a phishing link.',
        icon: ShieldAlert,
        color: 'text-purple-500 bg-purple-50'
    }
];

export default function WhyAwareness() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, index) => (
                <motion.div
                    key={reason.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${reason.color}`}>
                        <reason.icon size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{reason.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{reason.description}</p>
                </motion.div>
            ))}
        </div>
    );
}
