'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, ShieldCheck, ShieldAlert, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
    {
        id: 1,
        display: 'https://www.amazon.com/orders/view',
        actual: 'https://amzn-order-verify.sh/login',
        title: 'Order Tracking Link',
        context: 'Received in an SMS saying your package is delayed.',
        status: 'Unsafe',
        reason: 'The actual destination (amzn-order-verify.sh) is completely different from the displayed text. Official Amazon links always end in amazon.com.',
    },
    {
        id: 2,
        display: 'https://github.com/login/oauth/authorize',
        actual: 'https://github.com/login/oauth/authorize',
        title: 'GitHub Authentication',
        context: 'Commonly seen when using your GitHub account to log into other developer tools.',
        status: 'Safe',
        reason: 'The display URL matches the actual destination exactly. It uses HTTPS and the official github.com domain.',
    },
    {
        id: 3,
        display: 'https://paypalsupport.com',
        actual: 'http://paypalsupport.com',
        title: 'Support Portal',
        context: 'Sent via email to "update your security questions."',
        status: 'Unsafe',
        reason: 'It uses "paypalsupport.com" instead of the official "paypal.com". Also, it uses HTTP instead of the secure HTTPS protocol.',
    },
    {
        id: 4,
        display: 'https://edu-portal.nic.in/login',
        actual: 'https://edu-portal.nic.in/login',
        title: 'Government Education Portal',
        context: 'A link to check your scholarship status.',
        status: 'Safe',
        reason: 'Uses the official government domain suffix (nic.in) and HTTPS. The display text and actual URL are consistent.',
    }
];

export default function LinkDetective() {
    const [selectedLink, setSelectedLink] = useState<number | null>(null);
    const [userAssessment, setUserAssessment] = useState<'Safe' | 'Suspicious' | 'Unsafe' | null>(null);

    const currentLink = links.find(l => l.id === selectedLink);

    const handleLinkClick = (id: number) => {
        setSelectedLink(id);
        setUserAssessment(null);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
                {/* Link List */}
                <div className="lg:col-span-2 space-y-3">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select a Link to Inspect</p>
                    {links.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleLinkClick(link.id)}
                            className={cn(
                                "w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group",
                                selectedLink === link.id
                                    ? "bg-blue-500 border-blue-500 text-white shadow-soft-blue"
                                    : "bg-white border-slate-100 text-slate-600 hover:border-blue-200"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-xl",
                                    selectedLink === link.id ? "bg-white/20" : "bg-slate-50"
                                )}>
                                    <Search size={18} />
                                </div>
                                <span className="font-bold">{link.title}</span>
                            </div>
                            <ChevronRight size={18} className={cn(selectedLink === link.id ? "opacity-100" : "opacity-0 group-hover:opacity-50")} />
                        </button>
                    ))}
                </div>

                {/* Inspection Panel */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {!selectedLink ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center text-slate-400 h-full"
                            >
                                <div className="bg-slate-200 p-6 rounded-full mb-6 text-slate-300">
                                    <Search size={48} />
                                </div>
                                <h4 className="text-xl font-bold mb-2">Ready to Inspect</h4>
                                <p>Select a link from the left to begin your investigation.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={selectedLink}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-10"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h4 className="text-2xl font-bold text-slate-900 mb-2">{currentLink?.title}</h4>
                                        <p className="text-slate-500">{currentLink?.context}</p>
                                    </div>
                                    <div className="bg-blue-50 text-blue-500 p-4 rounded-2xl">
                                        <Search size={32} />
                                    </div>
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Display Text (What you see)</p>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-sm text-blue-600 break-all">
                                            {currentLink?.display}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Actual Destination (Where it goes)</p>
                                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-sm text-emerald-400 break-all flex items-center justify-between gap-4">
                                            <span>{currentLink?.actual}</span>
                                            <div className="shrink-0 flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-[10px] text-white">
                                                <Info size={12} /> Hover Reveal
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!userAssessment ? (
                                    <div className="space-y-4">
                                        <p className="font-bold text-slate-900">What's your verdict on this link?</p>
                                        <div className="grid grid-cols-3 gap-4">
                                            <button
                                                onClick={() => setUserAssessment('Safe')}
                                                className="p-4 rounded-xl border-2 border-slate-50 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 font-bold transition-all"
                                            >
                                                Safe
                                            </button>
                                            <button
                                                onClick={() => setUserAssessment('Suspicious')}
                                                className="p-4 rounded-xl border-2 border-slate-50 bg-slate-50 hover:bg-amber-50 hover:border-amber-500 hover:text-amber-700 font-bold transition-all"
                                            >
                                                Suspicious
                                            </button>
                                            <button
                                                onClick={() => setUserAssessment('Unsafe')}
                                                className="p-4 rounded-xl border-2 border-slate-50 bg-slate-50 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 font-bold transition-all"
                                            >
                                                Unsafe
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "p-8 rounded-[2rem] border mt-6",
                                            currentLink?.status === 'Safe' ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            {currentLink?.status === 'Safe' ? (
                                                <ShieldCheck size={32} className="text-emerald-600" />
                                            ) : (
                                                <ShieldAlert size={32} className="text-blue-600" />
                                            )}
                                            <h5 className={cn(
                                                "text-xl font-bold",
                                                currentLink?.status === 'Safe' ? "text-emerald-800" : "text-blue-800"
                                            )}>
                                                Verdict: {currentLink?.status}
                                            </h5>
                                        </div>
                                        <p className={cn(
                                            "leading-relaxed mb-6",
                                            currentLink?.status === 'Safe' ? "text-emerald-700" : "text-blue-700"
                                        )}>
                                            {currentLink?.reason}
                                        </p>
                                        {userAssessment === currentLink?.status ? (
                                            <div className="bg-white/50 p-3 rounded-xl inline-flex items-center gap-2 text-emerald-800 font-bold text-sm">
                                                <ShieldCheck size={16} /> Spot on! You analyzed it correctly.
                                            </div>
                                        ) : (
                                            <div className="bg-white/50 p-3 rounded-xl inline-flex items-center gap-2 text-slate-700 font-medium text-sm">
                                                <Info size={16} /> Learning point: Take note of the domain difference.
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
