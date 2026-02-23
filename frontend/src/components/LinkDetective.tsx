
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    ShieldAlert, 
    Activity, 
    Terminal, 
    Lock, 
    Cpu, 
    AlertTriangle, 
    CheckCircle,
    Zap,
    Globe,
    Search,
    Play
} from 'lucide-react';

// Simulation Scenarios
const SCENARIOS = [
    {
        id: 'bank',
        title: 'Financial Fraud',
        desc: 'Bank of America Account Suspension',
        path: '/demo/fake-bank',
        difficulty: 'Medium',
        color: 'text-red-400'
    },
    {
        id: 'hr',
        title: 'Corporate Impersonation',
        desc: 'Microsoft HR Payroll Update',
        path: '/demo/fake-hr',
        difficulty: 'Hard',
        color: 'text-blue-400'
    },
    {
        id: 'crypto',
        title: 'Web3 Scam',
        desc: 'Binance Airdrop Event',
        path: '/demo/fake-crypto',
        difficulty: 'Easy',
        color: 'text-yellow-400'
    }
];

export default function LinkDetective() {
    const [url, setUrl] = useState('');
    const [anchorText, setAnchorText] = useState('');
    const [context, setContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Simulated Live Logs
    useEffect(() => {
        const interval = setInterval(() => {
            const actions = [
                "Scanning DOM...", 
                "Verifying SSL Certificate...", 
                "Checking Brand Reputation...", 
                "Analyzing Favicon Hash...", 
                "Detecting Homoglyphs...",
                "Running Heuristic Analysis..."
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const time = new Date().toLocaleTimeString();
            setLogs(prev => [...prev.slice(-4), `[${time}] ${randomAction}`]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleAnalyze = async () => {
        if (!url) return;
        setLoading(true);
        setLogs(prev => [...prev, `[SYSTEM] Initiating Deep Scan: ${url}`]);
        setResult(null);

        try {
            const res = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url,
                    anchor_text: anchorText || "No Anchor Text",
                    context: context || "No Context Provided"
                })
            });
            const data = await res.json();
            setResult(data);
            setLogs(prev => [...prev, `[SYSTEM] Scan Complete. Verdict: ${data.status}`]);
        } catch (error) {
            console.error(error);
            setLogs(prev => [...prev, `[ERROR] Connection Failed.`]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-mono p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: CONTROL PANEL */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Header */}
                    <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
                        <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">SENTINEL LAYER</h1>
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                                <span className="flex w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span>SYSTEM ONLINE</span>
                                <span className="text-slate-600">|</span>
                                <span>v2.4.0 (STABLE)</span>
                            </div>
                        </div>
                    </div>

                    {/* LIVE FIRE SIMULATOR */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                LIVE THREAT SIMULATOR
                            </h2>
                            <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">
                                DEMO MODE
                            </span>
                        </div>
                        <div className="p-6 grid md:grid-cols-3 gap-4">
                            {SCENARIOS.map((scenario) => (
                                <a 
                                    key={scenario.id} 
                                    href={scenario.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg p-4 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Globe className={`w-5 h-5 ${scenario.color}`} />
                                        <Play className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-white mb-1">{scenario.title}</h3>
                                    <p className="text-xs text-slate-400 mb-3">{scenario.desc}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                                            {scenario.difficulty}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* MANUAL ANALYSIS TERMINAL */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-green-400" />
                                MANUAL ANALYSIS OVERRIDE
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 uppercase tracking-wider">Target URL</label>
                                    <div className="relative">
                                        <input 
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-3 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                                            placeholder="https://sus-link.com/login"
                                        />
                                        <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3.5" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 uppercase tracking-wider">Anchor Text</label>
                                    <input 
                                        value={anchorText}
                                        onChange={(e) => setAnchorText(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                                        placeholder="e.g. 'Update Password'"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 uppercase tracking-wider">Contextual Payload</label>
                                <textarea 
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono h-20 resize-none"
                                    placeholder="Paste email body or surrounding text..."
                                />
                            </div>
                            <button 
                                onClick={handleAnalyze}
                                disabled={loading}
                                className={`w-full py-3 rounded font-bold uppercase tracking-widest text-sm transition-all
                                    ${loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}
                                `}
                            >
                                {loading ? 'SCANNING NETWORK...' : 'INITIATE ANALYSIS'}
                            </button>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: STATUS & LOGS */}
                <div className="space-y-8">
                    
                    {/* SYSTEM VITALS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                <Activity className="w-4 h-4" />
                                <span className="text-xs font-bold">THREAT LEVEL</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">LOW</div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                <Cpu className="w-4 h-4" />
                                <span className="text-xs font-bold">ENGINE LOAD</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-400">12%</div>
                        </div>
                    </div>

                    {/* LIVE LOGS */}
                    <div className="bg-black border border-slate-800 rounded-xl overflow-hidden h-64 flex flex-col">
                        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                            <span className="text-xs font-mono text-slate-400">TERMINAL OUTPUT</span>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>
                        <div className="p-4 font-mono text-xs text-green-500/80 space-y-1 overflow-y-auto flex-1">
                            {logs.map((log, i) => (
                                <div key={i}>{log}</div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>

                    {/* ANALYSIS RESULT */}
                    <AnimatePresence>
                        {result && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`rounded-xl border p-6 ${
                                    result.status === 'SAFE' ? 'bg-green-900/20 border-green-500/50' :
                                    result.status === 'SUSPICIOUS' ? 'bg-yellow-900/20 border-yellow-500/50' :
                                    'bg-red-900/20 border-red-500/50'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    {result.status === 'SAFE' ? <CheckCircle className="w-8 h-8 text-green-500" /> :
                                     result.status === 'SUSPICIOUS' ? <AlertTriangle className="w-8 h-8 text-yellow-500" /> :
                                     <ShieldAlert className="w-8 h-8 text-red-500" />}
                                    <div>
                                        <div className="text-sm text-slate-400 uppercase font-bold">VERDICT</div>
                                        <div className={`text-xl font-bold ${
                                            result.status === 'SAFE' ? 'text-green-400' :
                                            result.status === 'SUSPICIOUS' ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>{result.status}</div>
                                    </div>
                                    <div className="ml-auto text-2xl font-bold text-slate-500">
                                        {result.overall_score}/100
                                    </div>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    {result.details?.ai_results?.reasons?.map((reason: any, idx: number) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded">
                                            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                                {reason.type}
                                            </span>
                                            {reason.detail}
                                        </div>
                                    ))}
                                    {(!result.details?.ai_results?.reasons || result.details?.ai_results?.reasons.length === 0) && (
                                        <p className="text-sm text-slate-400">{result.details.explanation}</p>
                                    )}
                                </div>
                                
                                {result.details?.ai_results?.llm_explanation && (
                                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Cpu className="w-3 h-3 text-blue-400" />
                                            <span className="text-xs font-bold text-blue-400">AI REASONING ENGINE</span>
                                        </div>
                                        <p className="text-sm text-slate-300 italic">
                                            "{result.details.ai_results.llm_explanation}"
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}
