import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, X, MessageSquare, Eye, ExternalLink, Activity, Lock, Zap } from 'lucide-react';

// Types (Mirrors the backend/content script types)
interface AnalysisResult {
    overall_score: number;
    status: string;
    details: {
        intent?: string;
        explanation?: string;
        reasons?: { type: string; detail: string; severity: string }[];
        ai_results?: {
            risk_narrative?: string[];
        };
        suspicious_elements?: string[];
    };
}

interface SidebarProps {
    initialData: AnalysisResult | null;
    isLoading: boolean;
    onClose: () => void;
    onSafePreview: () => void;
    onShowRedPen: () => void;
    onKillSwitch: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ initialData, isLoading, onClose, onSafePreview, onShowRedPen, onKillSwitch }) => {
    const [data, setData] = useState<AnalysisResult | null>(initialData);
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
        { role: 'ai', text: "I'm Sentinel. I've analyzed this page. What would you like to know?" }
    ]);
    const [input, setInput] = useState("");

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        const newMsgs = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(newMsgs);
        setInput("");
        
        // Add loading state
        const loadingId = Date.now();
        setMessages(prev => [...prev, { role: 'ai', text: "Analyzing..." }]); // Placeholder
        
        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMsg,
                    context_data: {
                        url: window.location.href, // Or pass from props
                        status: data?.status,
                        overall_score: data?.overall_score,
                        details: data?.details
                    }
                })
            });
            
            const result = await response.json();
            
            // Replace loading message with actual response
            setMessages(prev => {
                const filtered = prev.filter(m => m.text !== "Analyzing...");
                return [...filtered, { role: 'ai', text: result.response }];
            });
            
        } catch (e: any) {
            setMessages(prev => {
                const filtered = prev.filter(m => m.text !== "Analyzing...");
                return [...filtered, { role: 'ai', text: `Connection error: ${e.message}. (Mixed Content?)` }];
            });
        }
    };

    if (isLoading) {
        return (
            <div className="fixed top-0 right-0 h-screen w-96 bg-sentinel-bg border-l border-sentinel-border shadow-2xl z-[999999] flex flex-col items-center justify-center text-sentinel-text font-sans">
                <Activity className="w-12 h-12 text-sentinel-accent animate-pulse mb-4" />
                <div className="text-lg font-bold text-sentinel-text-bright tracking-wider">SCANNING TARGET</div>
                <div className="text-xs font-mono mt-2 text-sentinel-text opacity-70">
                    <div>{'>'} ANALYZING DOM STRUCTURE</div>
                    <div>{'>'} VERIFYING BRAND ASSETS</div>
                    <div>{'>'} RUNNING SENTINEL AI MODEL</div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const isSafe = data.status === "SAFE";
    const riskColor = isSafe ? "text-sentinel-success" : (data.status === "DANGEROUS" || data.status === "VERIFIED_PHISH" ? "text-sentinel-danger" : "text-sentinel-warning");
    const HeaderIcon = isSafe ? ShieldCheck : ShieldAlert;

    // Mock logo for demo (In real app, we'd fetch the real brand logo from Clearbit or similar)
    const getBrandLogo = (brandName: string) => `https://logo.clearbit.com/${brandName.toLowerCase()}.com`;
    
    // Check for visual match evidence
    const visualMatch = data.details.reasons?.find(r => r.type === 'VISUAL_SPOOF' || r.type === 'BRAND_MISMATCH');
    const detectedBrand = visualMatch ? visualMatch.detail.split(' ').pop()?.replace('.', '') : null;

    return (
        <div className="fixed top-0 right-0 h-screen w-[400px] bg-sentinel-bg border-l border-sentinel-border shadow-2xl z-[999999] flex flex-col font-sans animate-slide-in text-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-sentinel-border bg-sentinel-card flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <HeaderIcon className={`w-6 h-6 ${riskColor}`} />
                    <div>
                        <h1 className="font-bold text-sm text-sentinel-text-bright tracking-wide flex items-center gap-2">
                            SENTINEL SOC
                            {isSafe && <CheckCircle2 className="w-4 h-4 text-sentinel-success" />}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            {/* Risk Meter Visual */}
                            <div className="h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${isSafe ? 'bg-sentinel-success' : 'bg-sentinel-danger'} transition-all duration-500`} 
                                    style={{ width: `${Math.max(5, data.overall_score)}%` }}
                                />
                            </div>
                            <div className={`text-xs font-mono ${riskColor} font-bold`}>{data.overall_score}/100</div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-sentinel-border rounded text-sentinel-text hover:text-white transition">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto sentinel-scrollbar p-4 space-y-6">
                
                {/* Visual Evidence Section (New) */}
                {detectedBrand && (
                    <div className="bg-sentinel-card rounded-lg p-4 border border-sentinel-border relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded-bl">Doppelganger Detected</div>
                         <h2 className="text-xs font-bold text-sentinel-text uppercase mb-3 tracking-wider flex items-center gap-2">
                            <Eye className="w-3 h-3" /> Visual Forensics
                        </h2>
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto border-2 border-green-500 p-2">
                                    <img src={getBrandLogo(detectedBrand)} alt="Real" className="max-w-full max-h-full" onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50?text=?'} />
                                </div>
                                <div className="text-[10px] text-green-400 font-bold">REAL BRAND</div>
                            </div>
                            <div className="text-2xl text-sentinel-text">vs</div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2 mx-auto border-2 border-red-500 overflow-hidden">
                                     {/* We would ideally use the screenshot crop here, but for now we use a generic 'Current Site' placeholder or the favicon */}
                                     <div className="text-xs text-slate-400">Current<br/>Site</div>
                                </div>
                                <div className="text-[10px] text-red-400 font-bold">THIS PAGE</div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-3 text-center">
                            This site visually mimics <strong>{detectedBrand}</strong> but is hosted on a different domain.
                        </p>
                    </div>
                )}

                {/* Executive Summary */}
                <div className="bg-sentinel-card rounded-lg p-4 border border-sentinel-border">
                    <h2 className="text-xs font-bold text-sentinel-text uppercase mb-2 tracking-wider">Analysis Verdict</h2>
                    <p className="text-sm leading-relaxed text-sentinel-text-bright">
                        {data.details.explanation || "No explanation provided."}
                    </p>
                </div>

                {/* Evidence List */}
                <div>
                    <h2 className="text-xs font-bold text-sentinel-text uppercase mb-3 tracking-wider flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Detected Threats
                    </h2>
                    <div className="space-y-2">
                        {data.details.reasons?.map((reason, idx) => (
                            <div key={idx} className={`p-3 rounded border text-sm ${reason.severity === 'CRITICAL' ? 'bg-red-900/20 border-red-900/50' : 'bg-slate-800 border-slate-700'}`}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-xs uppercase opacity-75">[{reason.type}]</span>
                                    {reason.severity === 'CRITICAL' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                                </div>
                                <div className="text-slate-300">{reason.detail}</div>
                            </div>
                        ))}
                        {(!data.details.reasons || data.details.reasons.length === 0) && (
                            <div className="text-sm text-slate-500 italic">No specific threats detected.</div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div>
                    <h2 className="text-xs font-bold text-sentinel-text uppercase mb-3 tracking-wider">Countermeasures</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={onShowRedPen}
                            className="flex items-center justify-center gap-2 p-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition text-sm font-medium"
                        >
                            <Eye className="w-4 h-4 text-blue-400" />
                            Red Pen
                        </button>
                        <button 
                            onClick={onSafePreview}
                            className="flex items-center justify-center gap-2 p-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition text-sm font-medium"
                        >
                            <Lock className="w-4 h-4 text-green-400" />
                            Safe Preview
                        </button>
                        <button 
                            onClick={onKillSwitch}
                            className="col-span-2 flex items-center justify-center gap-2 p-3 rounded bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-lg hover:shadow-red-500/50 group"
                        >
                            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            KILL SWITCH
                        </button>
                    </div>
                    <button 
                        onClick={() => {
                            const report = {
                                timestamp: new Date().toISOString(),
                                url: window.location.href,
                                verdict: data.status,
                                score: data.overall_score,
                                evidence: data.details.reasons,
                                explanation: data.details.explanation
                            };
                            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `sentinel-incident-report-${Date.now()}.json`;
                            a.click();
                            alert("Incident Report Downloaded! Send this file to your IT security team.");
                        }}
                        className="w-full mt-2 flex items-center justify-center gap-2 p-3 rounded bg-red-900/30 hover:bg-red-900/50 border border-red-900/50 text-red-200 transition text-sm font-medium"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Report to IT Security
                    </button>
                </div>
            </div>

            {/* Chat Interface (Collapsible/Fixed at bottom) */}
            <div className="border-t border-sentinel-border bg-sentinel-card">
                <div 
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition"
                    onClick={() => setChatOpen(!chatOpen)}
                >
                    <div className="flex items-center gap-2 text-sm font-medium text-sentinel-text-bright">
                        <MessageSquare className="w-4 h-4 text-sentinel-accent" />
                        Ask Sentinel AI
                    </div>
                    <div className={`transform transition ${chatOpen ? 'rotate-180' : ''}`}>▲</div>
                </div>
                
                {chatOpen && (
                    <div className="h-64 flex flex-col border-t border-sentinel-border bg-slate-900">
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-2 rounded text-xs ${m.role === 'user' ? 'bg-sentinel-accent text-white' : 'bg-slate-800 text-slate-300'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 border-t border-sentinel-border flex gap-2">
                            <input 
                                className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-sentinel-accent"
                                placeholder="Why is this suspicious?"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="px-3 py-2 bg-sentinel-accent hover:bg-blue-600 rounded text-white text-sm font-medium"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
