'use client';

import React from 'react';
import { Key, Smartphone, Share2, EyeOff, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const hygieneHabits = [
    {
        title: 'Strong Passwords',
        icon: Key,
        scenario: 'You reuse the same password for email and Instagram...',
        risk: 'If one platform gets breached, attackers try the same password elsewhere.',
        insight: 'This is called credential stuffing.',
        example: 'A breach at a small game forum exposes your password, which is then used to log into your bank account.',
        tip: 'Use a unique, long password or a password manager for every account.',
    },
    {
        title: 'Two-Factor Authentication (2FA)',
        icon: Smartphone,
        scenario: 'Someone gets your password but can\'t get into your account.',
        risk: 'Passwords alone are increasingly vulnerable to phishing and data breaches.',
        insight: '2FA adds a secondary layer of physical verification.',
        example: 'Even with your password, an attacker would need the time-sensitive code from your phone.',
        tip: 'Enable App-based 2FA (like Google Authenticator) whenever possible.',
    },
    {
        title: 'Public Wi-Fi Safety',
        icon: Share2,
        scenario: 'You connect to "Free Airport Wi-Fi" to check your banking.',
        risk: 'Attackers can set up "Evil Twin" hotspots to intercept your data traffic.',
        insight: 'Unencrypted networks are like shouting your data in a public room.',
        example: 'An attacker uses a "Man-in-the-Middle" attack to steal your login credentials while you browse.',
        tip: 'Use a VPN on public networks, or stick to your cellular data for sensitive tasks.',
    },
    {
        title: 'Privacy Settings',
        icon: EyeOff,
        scenario: 'Your social profile shows your pet\'s name and birth city.',
        risk: 'Social engineering often starts with personal details harvested from social media.',
        insight: 'Oversharing provides the "ammo" for targeted phishing (Spear Phishing).',
        example: 'An attacker sees your pet\'s name is "Buddy" and uses it to guess your security questions.',
        tip: 'Review your privacy settings quarterly and limit what "Everyone" can see.',
    },
    {
        title: 'Software Updates',
        icon: RefreshCw,
        scenario: 'You keep clicking "Remind me later" on system updates.',
        risk: 'Updates often contain critical security patches for "Zero-Day" vulnerabilities.',
        insight: 'Outdated software is the primary entry point for automated malware.',
        example: 'The "WannaCry" ransomware spread globally by exploiting a flaw that had already been patched.',
        tip: 'Enable automatic updates for your OS and web browsers.',
    },
    {
        title: 'Oversharing & Footprint',
        icon: AlertCircle,
        scenario: 'Posting a photo of your boarding pass or new office badge.',
        risk: 'Barcodes and IDs contain encoded data that can be used for identity theft.',
        insight: 'Your digital footprint is permanent and can be used against you.',
        example: 'A scammer uses the barcode on your boarding pass photo to access your frequent flyer account.',
        tip: 'Think twice before posting photos that contain QR codes, barcodes, or sensitive IDs.',
    },
];

export default function HygieneCards() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hygieneHabits.map((habit, index) => (
                <motion.div
                    key={habit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card-premium p-8 flex flex-col group"
                >
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                        <habit.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{habit.title}</h3>

                    <div className="space-y-4 flex-grow">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Scenario</p>
                            <p className="text-slate-600 italic">"{habit.scenario}"</p>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">The Risk</p>
                            <p className="text-slate-700 leading-relaxed">{habit.risk}</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">Why it matters</p>
                            <p className="text-sm text-slate-600">{habit.insight}</p>
                        </div>

                        <div className="hidden group-hover:block transition-all duration-300">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">Practical Example</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{habit.example}</p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-start gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-sm">
                            <span className="font-bold">Tip:</span>
                            <span>{habit.tip}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
