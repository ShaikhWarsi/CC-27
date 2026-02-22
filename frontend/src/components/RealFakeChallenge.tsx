'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Assessment = 'Legitimate' | 'Suspicious' | 'Fake';

interface Scenario {
    id: number;
    type: string;
    sender: string;
    subject: string;
    body: string;
    correctType: Assessment;
    hints: string[];
    explanation: string;
    reasons: { id: string; label: string; isCorrect: boolean }[];
}

const scenarios: Scenario[] = [
    {
        id: 1,
        type: 'Bank Alert',
        sender: 'security@chase-online-verify.com',
        subject: 'Urgent: Your account is temporarily locked',
        body: 'We detected unusual login attempts on your account. For your security, we have temporarily locked access. Please click the button below to verify your identity and restore access immediately. Failure to verify within 24 hours will result in permanent closure.',
        correctType: 'Fake',
        hints: ['Urgent tone', 'Suspicious sender domain', 'threat of closure'],
        explanation: 'This is a classic phishing email. Banks never use domains like "chase-online-verify.com" (should be chase.com) and rarely threaten permanent account closure via email.',
        reasons: [
            { id: 'domain', label: 'Suspicious sender domain', isCorrect: true },
            { id: 'urgency', label: 'Urgent/Threatening tone', isCorrect: true },
            { id: 'personal', label: 'Asks for sensitive info', isCorrect: true },
            { id: 'link', label: 'Redirects to a verify.com link', isCorrect: true },
        ]
    },
    {
        id: 2,
        type: 'Internship Offer',
        sender: 'careers@google.co.in',
        subject: 'Internship Opportunity - Application Received',
        body: 'Hi Sarah, thank you for applying to our Summer 2024 Engineering Internship. We’ve reviewed your profile and would like to invite you for a preliminary video screening. Please log in to your applicant portal to schedule a slot.',
        correctType: 'Legitimate',
        hints: ['Official domain', 'Personalized name', 'Expected action'],
        explanation: 'This appears legitimate. The domain (google.co.in) is an official regional Google domain, it uses a personal name, and refers to an action (applying) that the user likely performed.',
        reasons: [
            { id: 'name', label: 'Uses my actual name', isCorrect: true },
            { id: 'expected', label: 'I actually applied for this', isCorrect: true },
            { id: 'domain-google', label: 'Official google.com/co.in domain', isCorrect: true },
        ]
    },
    {
        id: 3,
        type: 'Delivery Update',
        sender: 'no-reply@fedex-shipments.net',
        subject: 'Package Delivery Failure: Action Required',
        body: 'Your package #CN-9921-X cannot be delivered due to an incomplete address. To reschedule delivery, please pay a small re-routing fee ($1.99) using the link below.',
        correctType: 'Fake',
        hints: ['Payment requested', 'Generic ID', 'Net domain'],
        explanation: 'Scammers often use "small fees" to steal credit card details. Major carriers like FedEx don\'t use .net domains for customer notifications and won\'t ask for re-routing fees via email links.',
        reasons: [
            { id: 'payment', label: 'Requests money/payment', isCorrect: true },
            { id: 'non-official', label: 'Uses .net instead of .com', isCorrect: true },
            { id: 'generic', label: 'Package ID looks fake', isCorrect: true },
        ]
    }
];

export default function RealFakeChallenge() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);

    const scenario = scenarios[currentIndex];

    const handleAssessment = (type: Assessment) => {
        setAssessment(type);
        if (type === 'Legitimate' && scenario.correctType !== 'Legitimate') {
            // Automatic "let's look closer" for wrong legitimate choice
            setShowFeedback(true);
        }
    };

    const toggleReason = (id: string) => {
        if (selectedReasons.includes(id)) {
            setSelectedReasons(selectedReasons.filter(r => r !== id));
        } else {
            setSelectedReasons([...selectedReasons, id]);
        }
    };

    const nextScenario = () => {
        if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(currentIndex + 1);
            resetState();
        }
    };

    const resetState = () => {
        setAssessment(null);
        setSelectedReasons([]);
        setShowFeedback(false);
    };

    const isCorrect = assessment === scenario.correctType;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
                <span className="text-slate-500 font-medium text-sm">Case Study {currentIndex + 1} of {scenarios.length}</span>
                <div className="flex gap-2">
                    {scenarios.map((_, i) => (
                        <div key={i} className={cn("w-8 h-1.5 rounded-full transition-colors", i === currentIndex ? "bg-blue-500" : i < currentIndex ? "bg-blue-200" : "bg-slate-200")} />
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Email Content */}
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-full"
                >
                    <div className="bg-slate-50 p-4 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                {scenario.sender[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">{scenario.sender}</p>
                                <p className="text-xs text-slate-500">To: you@example.com</p>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-700">Subject: {scenario.subject}</p>
                    </div>
                    <div className="p-6 text-slate-600 space-y-4 flex-grow italic">
                        <p>{scenario.body}</p>
                    </div>
                    <div className="p-4 bg-slate-50 mt-auto flex justify-center">
                        <div className="w-1/2 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold opacity-50">
                            {scenario.id === 2 ? 'Schedule Interview' : scenario.id === 1 ? 'Verify Account' : 'Pay Re-routing Fee'}
                        </div>
                    </div>
                </motion.div>

                {/* Interaction Panel */}
                <div className="space-y-6">
                    {!assessment ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-slate-900">What’s your assessment?</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => handleAssessment('Legitimate')}
                                    className="p-4 rounded-xl border-2 border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left flex items-center justify-between group"
                                >
                                    <span className="font-semibold text-slate-700">Looks Legitimate</span>
                                    <Check className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                                <button
                                    onClick={() => handleAssessment('Suspicious')}
                                    className="p-4 rounded-xl border-2 border-slate-100 hover:border-amber-300 hover:bg-amber-50 transition-all text-left flex items-center justify-between group"
                                >
                                    <span className="font-semibold text-slate-700">Suspicious</span>
                                    <HelpCircle className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                                <button
                                    onClick={() => handleAssessment('Fake')}
                                    className="p-4 rounded-xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-left flex items-center justify-between group"
                                >
                                    <span className="font-semibold text-slate-700">Definitely Fake</span>
                                    <X className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {assessment === 'Legitimate' && scenario.correctType !== 'Legitimate' ? (
                                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-6">
                                    <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                                        <Info size={20} /> Let&apos;s analyze this together
                                    </h4>
                                    <p className="text-amber-700">While it might look official at first glance, there are some hidden red flags we should check.</p>
                                </div>
                            ) : assessment === scenario.correctType ? (
                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-6">
                                    <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-2">
                                        <Check size={20} /> Correct Assessment!
                                    </h4>
                                    <p className="text-emerald-700">You spotted the nature of this message correctly.</p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-6">
                                    <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                                        <HelpCircle size={20} /> Good effort!
                                    </h4>
                                    <p className="text-blue-700">This one was tricky. Let&apos;s see why it&apos;s actually {scenario.correctType}.</p>
                                </div>
                            )}

                            {(assessment === 'Suspicious' || assessment === 'Fake' || assessment === 'Legitimate') && (
                                <div className="space-y-4">
                                    <p className="font-bold text-slate-900">Why do you think so? (Select any that apply)</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {scenario.reasons.map((reason) => (
                                            <button
                                                key={reason.id}
                                                onClick={() => toggleReason(reason.id)}
                                                className={cn(
                                                    "p-4 rounded-xl border transition-all text-left text-sm font-medium",
                                                    selectedReasons.includes(reason.id)
                                                        ? "bg-blue-500 text-white border-blue-500"
                                                        : "bg-white text-slate-600 border-slate-100 hover:border-blue-200"
                                                )}
                                            >
                                                {reason.label}
                                            </button>
                                        ))}
                                    </div>

                                    {selectedReasons.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 p-6 bg-slate-900 text-white rounded-2xl"
                                        >
                                            <h4 className="font-bold mb-2 flex items-center gap-2 text-emerald-400">
                                                <Info size={18} /> Reality Check
                                            </h4>
                                            <p className="text-slate-300 text-sm leading-relaxed">{scenario.explanation}</p>

                                            <div className="mt-6 flex gap-4">
                                                <button
                                                    onClick={nextScenario}
                                                    className="flex-grow btn-secondary"
                                                >
                                                    {currentIndex < scenarios.length - 1 ? 'Next Scenario' : 'Finish Challenge'} <ArrowRight size={18} />
                                                </button>
                                                <button
                                                    onClick={resetState}
                                                    className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
                                                >
                                                    <RotateCcw size={20} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
