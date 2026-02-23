import React, { useState, useEffect, useRef } from 'react';

// Types (mirrored from content.ts)
interface AnalysisResult {
    overall_score: number;
    status: string;
    details: {
        intent?: string;
        explanation?: string;
        reasons?: { type: string, detail: string, severity: string }[];
        suspicious_elements?: string[];
    };
}

interface SidebarProps {
    initialData: AnalysisResult | null;
    url: string;
    onClose: () => void;
    onSafeMode: () => void;
    onKillSwitch: () => void;
    onHighlight: (selectors: string[]) => void;
}

const SentinelSidebar: React.FC<SidebarProps> = ({ initialData, url, onClose, onSafeMode, onKillSwitch, onHighlight }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'analysis' | 'chat'>('analysis');
    const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
        { role: 'ai', content: `Sentinel Active. I've analyzed ${new URL(url).hostname}. What would you like to know?` }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    useEffect(() => {
        // Slide in animation
        const timer = setTimeout(() => setIsOpen(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        
        const userMsg = chatInput;
        setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput('');
        setIsTyping(true);

        // Simulate AI response (replace with actual backend call later)
        setTimeout(() => {
            let response = "I'm analyzing that specific aspect...";
            if (userMsg.toLowerCase().includes("safe")) {
                response = initialData?.status === 'SAFE' 
                    ? "Based on my analysis, this page appears safe. The SSL certificate is valid and no suspicious patterns were found." 
                    : "I would NOT recommend trusting this page. It exhibits several phishing indicators.";
            } else if (userMsg.toLowerCase().includes("why")) {
                response = initialData?.details.explanation || "This site matches known phishing patterns.";
            }
            
            setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
            setIsTyping(false);
        }, 1000);
    };

    const getRiskColor = (score: number) => {
        if (score > 70) return 'text-sentinel-danger';
        if (score > 40) return 'text-sentinel-warning';
        return 'text-sentinel-success';
    };

    const getRiskLabel = (score: number) => {
        if (score > 70) return 'CRITICAL RISK';
        if (score > 40) return 'SUSPICIOUS';
        return 'SAFE';
    };

    const score = initialData?.overall_score || 0;
    const reasons = initialData?.details.reasons || [];

    return (
        <div className={`fixed top-0 right-0 h-full w-[400px] bg-sentinel-bg text-sentinel-text shadow-2xl border-l border-sentinel-border transform transition-transform duration-300 z-[2147483647] font-sans flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            
            {/* Header */}
            <div className="p-4 border-b border-sentinel-border bg-sentinel-card flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${score > 50 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className="font-bold text-lg tracking-tight">SENTINEL SOC</span>
                </div>
                <button onClick={onClose} className="text-sentinel-muted hover:text-white">✕</button>
            </div>

            {/* Risk Dashboard */}
            <div className="p-6 bg-gradient-to-b from-sentinel-card to-sentinel-bg border-b border-sentinel-border">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-sentinel-muted font-mono">RISK SCORE</span>
                    <span className={`text-4xl font-bold font-mono ${getRiskColor(score)}`}>{score}/100</span>
                </div>
                <div className="w-full bg-sentinel-border h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${score > 70 ? 'bg-red-500' : score > 40 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${score}%` }}></div>
                </div>
                <div className="mt-2 text-center font-mono text-sm tracking-widest font-bold">
                    {getRiskLabel(score)}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex border-b border-sentinel-border">
                <button 
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'text-sentinel-accent border-b-2 border-sentinel-accent bg-sentinel-card' : 'text-sentinel-muted hover:text-white'}`}
                    onClick={() => setActiveTab('analysis')}
                >
                    🛡️ ANALYST NOTEBOOK
                </button>
                <button 
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'chat' ? 'text-sentinel-accent border-b-2 border-sentinel-accent bg-sentinel-card' : 'text-sentinel-muted hover:text-white'}`}
                    onClick={() => setActiveTab('chat')}
                >
                    💬 LIVE OPS
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto sentinel-scroll p-4 bg-sentinel-bg">
                {activeTab === 'analysis' ? (
                    <div className="space-y-4">
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <button 
                                onClick={() => onHighlight(initialData?.details.suspicious_elements || [])}
                                className="p-2 bg-sentinel-card border border-sentinel-border rounded hover:bg-sentinel-border transition-colors text-xs font-mono flex items-center justify-center gap-2"
                            >
                                👁️ RED PEN
                            </button>
                             <button 
                                onClick={onSafeMode}
                                className="p-2 bg-sentinel-card border border-sentinel-border rounded hover:bg-sentinel-border transition-colors text-xs font-mono flex items-center justify-center gap-2"
                            >
                                🛡️ SAFE MODE
                            </button>
                             <button 
                                onClick={onKillSwitch}
                                className="col-span-2 p-2 bg-red-900/20 border border-red-900/50 text-red-400 rounded hover:bg-red-900/40 transition-colors text-xs font-mono flex items-center justify-center gap-2"
                            >
                                ☠️ KILL SWITCH (WIPE DATA)
                            </button>
                        </div>

                        {/* Evidence List */}
                        <div>
                            <h3 className="text-xs font-bold text-sentinel-muted uppercase tracking-wider mb-3">Detected Evidence</h3>
                            {reasons.length === 0 ? (
                                <div className="text-sm text-sentinel-muted italic">No specific threats detected.</div>
                            ) : (
                                <ul className="space-y-3">
                                    {reasons.map((r, i) => (
                                        <li key={i} className="bg-sentinel-card p-3 rounded border-l-2 border-sentinel-accent text-sm">
                                            <div className="flex justify-between mb-1">
                                                <span className="font-bold text-xs text-sentinel-accent px-1.5 py-0.5 bg-blue-900/30 rounded">{r.type}</span>
                                            </div>
                                            <p className="text-gray-300 leading-relaxed">{r.detail}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 space-y-4 mb-4">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-sentinel-accent text-white rounded-br-none' 
                                            : 'bg-sentinel-card text-gray-200 rounded-bl-none border border-sentinel-border'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-sentinel-card p-3 rounded-lg rounded-bl-none border border-sentinel-border">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask Sentinel..."
                                    className="w-full bg-sentinel-card border border-sentinel-border rounded p-3 pr-10 text-sm text-white focus:outline-none focus:border-sentinel-accent"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sentinel-muted hover:text-white"
                                >
                                    ➤
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SentinelSidebar;
