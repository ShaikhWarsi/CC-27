import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import Sidebar from './sidebar/Sidebar';

// Types
interface AnalysisResult {
    overall_score: number;
    status: string;
    details: {
        intent?: string;
        explanation?: string;
        reasons?: { type: string, detail: string, severity: string }[];
        ai_results?: {
            risk_narrative?: string[];
        };
        suspicious_elements?: string[];
    };
}

// Global state for the root to allow updates
let reactRoot: Root | null = null;
let shadowRoot: ShadowRoot | null = null;

function getorCreateShadowRoot(): ShadowRoot {
    if (shadowRoot) return shadowRoot;

    const hostId = 'sentinel-shadow-host-' + Math.random().toString(36).substr(2, 9);
    let host = document.getElementById(hostId);
    if (!host) {
        host = document.createElement('div');
        host.id = hostId;
        host.style.position = 'fixed';
        host.style.top = '0';
        host.style.right = '0';
        host.style.zIndex = '2147483647'; // Max z-index
        host.style.pointerEvents = 'none'; // Let clicks pass through container, but sidebar will capture them
        document.body.appendChild(host);
    }
    shadowRoot = host.attachShadow({ mode: 'open' });
    
    // Inject Styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('content.css');
    shadowRoot.appendChild(link);

    // Inject Fonts (Google Fonts)
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap';
    shadowRoot.appendChild(fontLink);

    return shadowRoot;
}

function renderSidebar(props: any) {
    const rootEl = getorCreateShadowRoot();
    let container = rootEl.querySelector('#sentinel-react-root');
    if (!container) {
        container = document.createElement('div');
        container.id = 'sentinel-react-root';
        container.style.pointerEvents = 'auto'; // Re-enable pointer events for the sidebar
        rootEl.appendChild(container);
    }

    if (!reactRoot) {
        reactRoot = createRoot(container);
    }
    
    reactRoot.render(<Sidebar {...props} />);
}

function highlightSuspiciousElements(selectors: string[]) {
    console.log("Highlighting elements:", selectors);
    selectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el instanceof HTMLElement) {
                    el.style.border = "4px solid #ef4444";
                    el.style.boxShadow = "0 0 15px rgba(239, 68, 68, 0.6)";
                    el.style.position = "relative";
                    el.setAttribute("data-sentinel-highlight", "true");
                    
                    // Add a label
                    const label = document.createElement('div');
                    label.innerText = "⚠️ DETECTED";
                    label.style.position = "absolute";
                    label.style.top = "-20px";
                    label.style.left = "0";
                    label.style.background = "#ef4444";
                    label.style.color = "white";
                    label.style.fontSize = "10px";
                    label.style.padding = "2px 4px";
                    label.style.fontWeight = "bold";
                    label.style.zIndex = "10000";
                    el.appendChild(label);
                }
            });
        } catch (e) {
            console.warn("Invalid selector:", selector);
        }
    });
}

// --- ANALYSIS LOGIC ---

async function analyzePage() {
    const url = window.location.href;
    const hostname = new URL(url).hostname;
    
    // Whitelist check (Disabled for Demo/Testing so you can see it work everywhere)
    /*
    const whitelist = ['google.com', 'facebook.com', 'amazon.com', 'wikipedia.org', 'microsoft.com', 'youtube.com', 'github.com', 'stackoverflow.com', 'localhost'];
    if (whitelist.some(d => hostname.endsWith(d))) {
        console.log("Sentinel: Whitelisted domain.");
        return;
    }
    */
    console.log("Sentinel: Starting Analysis on " + url);

    // 1. Show Loading State
    renderSidebar({
        isLoading: true,
        initialData: null,
        onClose: () => {
            const host = shadowRoot?.host as HTMLElement;
            if (host) host.style.display = 'none';
        }, 
        onSafePreview: () => {},
        onShowRedPen: () => {},
        onKillSwitch: () => {}
    });

    try {
        // Capture DOM (Sanitized)
        let rawDom = document.documentElement.outerHTML;
        const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
        let cleanDom = rawDom.replace(emailRegex, "[REDACTED_EMAIL]");
        if (cleanDom.length > 50000) cleanDom = cleanDom.substring(0, 50000) + "...[TRUNCATED]";

        // Capture Screenshot
        let screenshot = "";
        try {
            screenshot = await new Promise<string>((resolve) => {
                chrome.runtime.sendMessage({ action: "CAPTURE_SCREENSHOT" }, (response) => {
                    resolve(response && response.screenshot ? response.screenshot : "");
                });
            });
        } catch (e) {
            console.warn("Screenshot capture failed:", e);
        }

        // Call Backend
        const response = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                url, 
                anchor_text: document.title, 
                context_text: "Page Load",
                dom_html: cleanDom,
                screenshot_data: screenshot
            })
        });

        const data: AnalysisResult = await response.json();

        // 2. Render Result
        renderSidebar({
            isLoading: false,
            initialData: data,
            onClose: () => {
                // Unmount or hide
                const host = shadowRoot?.host as HTMLElement;
                if (host) host.style.display = 'none';
            },
            onSafePreview: () => {
                // Safe Mode Implementation
                document.documentElement.innerHTML = `
                    <head>
                        <title>Sentinel Safe Mode</title>
                        <style>
                            body { font-family: monospace; padding: 40px; background: #f0f0f0; color: #333; max-width: 800px; margin: 0 auto; }
                            h1 { color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px; }
                            .warning { background: #fee2e2; color: #b91c1c; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                            pre { background: white; padding: 20px; border: 1px solid #ddd; overflow-x: auto; white-space: pre-wrap; }
                        </style>
                    </head>
                    <body>
                        <h1>🛡️ SENTINEL SAFE MODE</h1>
                        <div class="warning">
                            <strong>JavaScript Executed Blocked.</strong> External resources disabled. You are viewing a sanitized text-only version of this page.
                        </div>
                        <h2>Page Content</h2>
                        <pre>${document.body.innerText.replace(/</g, '&lt;')}</pre>
                    </body>
                `;
            },
            onShowRedPen: () => {
                // Highlight elements
                if (data.details.suspicious_elements) {
                    highlightSuspiciousElements(data.details.suspicious_elements);
                } else {
                    alert("No specific elements identified by Red Pen.");
                }
            },
            onKillSwitch: () => {
                if (confirm("⚠️ KILL SWITCH ACTIVATED\n\nThis will immediately terminate all sessions, clear cookies, and local storage for this domain. Are you sure?")) {
                    // 1. Clear Storage
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // 2. Clear Cookies
                    const cookies = document.cookie.split(";");
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i];
                        const eqPos = cookie.indexOf("=");
                        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    }
                    
                    // 3. Force Reload/Redirect
                    window.location.href = "about:blank";
                }
            }
        });

    } catch (error) {
        console.error("Sentinel Analysis Failed:", error);
        // Render Error State
        renderSidebar({
            isLoading: false,
            initialData: {
                overall_score: 0,
                status: "ERROR",
                details: { explanation: "Failed to connect to Sentinel Brain. Is the backend running?" }
            },
            onClose: () => {},
            onSafePreview: () => {},
            onShowRedPen: () => {},
            onKillSwitch: () => {}
        });
    }
}

// Start Analysis on Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', analyzePage);
} else {
    analyzePage();
}
