// Background Service Worker for Sentinel Layer
// Handles privileged operations like screenshots

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "CAPTURE_SCREENSHOT") {
        console.log("[Sentinel Background] Capturing screenshot...");
        
        // Capture the visible tab
        chrome.tabs.captureVisibleTab(
            sender.tab?.windowId, 
            { format: "png", quality: 80 }, 
            (dataUrl) => {
                if (chrome.runtime.lastError) {
                    console.error("[Sentinel Background] Error capturing screenshot:", chrome.runtime.lastError);
                    sendResponse({ error: chrome.runtime.lastError.message });
                } else {
                    console.log("[Sentinel Background] Screenshot captured successfully.");
                    sendResponse({ screenshot: dataUrl });
                }
            }
        );
        
        // Return true to indicate we will send a response asynchronously
        return true; 
    }

    if (request.action === "KILL_SESSION") {
        console.log("[Sentinel Background] Killing session for tab:", sender.tab?.url);
        
        if (sender.tab && sender.tab.url) {
            try {
                const url = new URL(sender.tab.url);
                const domain = url.hostname;
                
                chrome.cookies.getAll({ domain: domain }, (cookies) => {
                    cookies.forEach((cookie) => {
                        const protocol = cookie.secure ? "https:" : "http:";
                        const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;
                        chrome.cookies.remove({ url: cookieUrl, name: cookie.name });
                    });
                    console.log(`[Sentinel Background] Cleared ${cookies.length} cookies for ${domain}`);
                    sendResponse({ success: true, count: cookies.length });
                });
            } catch (e) {
                console.error("[Sentinel Background] Error clearing cookies:", e);
                sendResponse({ success: false, error: String(e) });
            }
        } else {
            sendResponse({ success: false, error: "No URL found" });
        }
        return true;
    }
});

// Optional: Log installation
chrome.runtime.onInstalled.addListener(() => {
    console.log("Sentinel Layer (Fish-Pish) Installed.");
});
