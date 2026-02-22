'use client';

import React, { useState } from 'react';
import { ChevronDown, AlertTriangle, User, Globe, Link, FileText, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const redFlags = [
    {
        title: 'Urgent or Threatening Language',
        icon: AlertTriangle,
        example: 'Subject: URGENT - Your account will be DELETED in 2 hours!',
        highlight: '...will be DELETED in 2 hours!',
        explanation: 'Attackers create a false sense of urgency to bypass your critical thinking. They want you to act before you have time to verify the claim.',
        psychology: 'Triggers a "fight or flight" emotional response, making you more likely to follow instructions without question.',
        action: 'Slow down. Real organizations (banks, government) rarely send high-stakes threats via unsolicited email.',
    },
    {
        title: 'Generic or Missing Greetings',
        icon: User,
        example: 'Dear Valued Customer, We noticed unusual activity...',
        highlight: 'Dear Valued Customer',
        explanation: 'Phishing emails are often sent in bulk to thousands. They don\'t know your name, so they use generic greetings.',
        psychology: 'Attempting to sound professional and official while remaining broad enough for mass distribution.',
        action: 'Be wary of any email from a service you use that doesn\'t address you by your actual name.',
    },
    {
        title: 'Suspicious Sender Domains',
        icon: Globe,
        example: 'From: PayPal Support <support@pay-pal-security.com>',
        highlight: '@pay-pal-security.com',
        explanation: 'The "Friendly Name" might say PayPal, but the actual email domain is slightly off. They use typosquatting or subdomains.',
        psychology: 'Exploits the fact that many users only look at the display name, not the actual email address.',
        action: 'Hover over or click the sender name to see the full email address. Check for typos like "paypa1.com".',
    },
    {
        title: 'Fake Login Pages / Shortened Links',
        icon: Link,
        example: 'Click here to verify: bit.ly/secure-login-2024',
        highlight: 'bit.ly/secure-login-2024',
        explanation: 'Attackers hide the true destination behind link shorteners or buttons that lead to a look-alike login page designed to steal credentials.',
        psychology: 'Visual deception. The page looks identical to the real one, making you feel safe entering your password.',
        action: 'Never click links in emails to log in. Instead, go directly to the website by typing the address in your browser.',
    },
    {
        title: 'Unexpected or Weird Attachments',
        icon: FileText,
        example: 'Attached: Invoice_9921_SCAN.zip',
        highlight: '.zip (or .exe, .scr, .iso)',
        explanation: 'Attachments can contain malware or ransomware. They often use ZIP or EXE files disguised as "Invoices", "Receipts", or "Job Offers".',
        psychology: 'Curiosity and duty. You feel obligated to check an invoice or an important document related to your "account".',
        action: 'Do not open attachments you aren\'t expecting. Verify with the sender via a different communication channel.',
    },
    {
        title: 'Emotional Manipulation',
        icon: Heart,
        example: 'Hi! I\'m stuck at the airport and lost my phone. Please send $50...',
        highlight: 'I\'m stuck... Please send $50',
        explanation: 'Attackers prey on empathy, fear, or greed. They might pose as a friend in trouble or a charity needing urgent help.',
        psychology: 'Empathy-driven decision making. When emotions are high, logic is often low.',
        action: 'If a "friend" asks for money or personal info, call them directly or contact them through another trusted method.',
    },
];

export default function PhishingGuide() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            {redFlags.map((flag, index) => (
                <div key={flag.title} className="card-premium overflow-hidden border-none shadow-sm">
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className={cn(
                            "w-full flex items-center justify-between p-6 text-left transition-colors",
                            openIndex === index ? "bg-slate-50" : "hover:bg-slate-50/50"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-2 rounded-xl transition-colors",
                                openIndex === index ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500"
                            )}>
                                <flag.icon size={24} />
                            </div>
                            <span className="text-xl font-bold text-slate-900">{flag.title}</span>
                        </div>
                        <ChevronDown
                            className={cn("text-slate-400 transition-transform duration-300", openIndex === index && "rotate-180")}
                            size={24}
                        />
                    </button>

                    <AnimatePresence>
                        {openIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="p-8 pt-0 border-t border-slate-100 bg-slate-50/30">
                                    <div className="mt-6 space-y-6">
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">The Example</p>
                                            <div className="text-slate-800 font-medium text-lg">
                                                {flag.example.split(flag.highlight).map((part, i, arr) => (
                                                    <React.Fragment key={i}>
                                                        {part}
                                                        {i < arr.length - 1 && (
                                                            <span className="bg-amber-100 text-amber-800 px-1 rounded border-b-2 border-amber-400">
                                                                {flag.highlight}
                                                            </span>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    What&apos;s happening?
                                                </h4>
                                                <p className="text-slate-600 leading-relaxed">{flag.explanation}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Psychology
                                                </h4>
                                                <p className="text-slate-600 leading-relaxed">{flag.psychology}</p>
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 items-start">
                                            <div className="bg-emerald-500 text-white p-1 rounded-full mt-0.5 shrink-0">
                                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                                    <Shield size={12} fill="currentColor" />
                                                </motion.div>
                                            </div>
                                            <div>
                                                <span className="font-bold text-emerald-800 block mb-1">Safe Action</span>
                                                <p className="text-emerald-700">{flag.action}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
