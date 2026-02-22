(function () {
    let popup = null;
    let debounceTimer = null;
    let currentHoveredLink = null;

    // Create the popup element
    function createPopup() {
        if (popup) return;
        popup = document.createElement('div');
        popup.id = 'fish-pish-popup';
        document.body.appendChild(popup);
    }

    function showLoading(x, y) {
        popup.innerHTML = `
            <div class="fp-header">
                <div class="fp-title">Fish-Pish analyzing...</div>
            </div>
            <div class="fp-loading">
                <div class="fp-spinner"></div>
            </div>
        `;
        positionPopup(x, y);
        popup.classList.add('visible');
    }

    function positionPopup(x, y) {
        const padding = 15;
        let left = x + padding;
        let top = y + padding;

        // Keep inside viewport
        const width = 280;
        const height = 200;
        if (left + width > window.innerWidth) left = x - width - padding;
        if (top + height > window.innerHeight) top = y - height - padding;

        popup.style.left = `${left + window.scrollX}px`;
        popup.style.top = `${top + window.scrollY}px`;
    }

    async function analyzeLink(url, text, x, y) {
        showLoading(x, y);

        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, anchor_text: text })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();

            updatePopup(data, x, y);
        } catch (error) {
            console.error('Fish-Pish Error:', error);
            popup.innerHTML = `<div class="fp-title" style="color: #991b1b">Analysis Failed</div>`;
        }
    }

    function updatePopup(data, x, y) {
        const score = data.overall_score;
        const status = data.status;
        const details = data.details;
        const ai = details.ai_results || {};
        const blacklist = details.blacklist || {};

        let badgeClass = 'fp-badge-safe';
        let gaugeColor = '#4ade80';

        if (status === 'DANGER' || status === 'VERIFIED_PHISH') {
            badgeClass = 'fp-badge-danger';
            gaugeColor = '#f87171';
        } else if (status === 'SUSPICIOUS') {
            badgeClass = 'fp-badge-suspicious';
            gaugeColor = '#fbbf24';
        }

        const blacklistServices = blacklist.services || {};
        const activeBlacklists = Object.entries(blacklistServices)
            .filter(([_, v]) => v === true)
            .map(([k, _]) => k.replace(/_/g, ' '))
            .join(', ') || (blacklist.status === 'WHITELISTED' ? 'Trusted Domain' : 'Clean');

        popup.innerHTML = `
            <div class="fp-header">
                <div class="fp-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Fish-Pish
                </div>
                <div class="fp-badge ${badgeClass}">${status}</div>
            </div>
            
            <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
                <strong>Source:</strong> ${activeBlacklists}
            </div>

            <div class="fp-gauge-container">
                <div class="fp-gauge-fill" style="width: ${score}%; background-color: ${gaugeColor}"></div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
                <span style="font-weight: 600">Risk Score: ${score}/100</span>
            </div>

            <div class="fp-intent-box" style="background: rgba(0,0,0,0.05); padding: 8px; border-radius: 8px; margin-bottom: 12px; font-size: 11px;">
                <div style="font-weight: 700; color: #444; margin-bottom: 2px;">AI Intent Analysis:</div>
                <div style="color: #666; font-style: italic;">"${details.intent || 'Unknown'}"</div>
                <div style="margin-top: 4px; color: #333;">${details.explanation || 'No explanation provided.'}</div>
            </div>

            <details class="fp-details">
                <summary>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    Technical Breakdown
                </summary>
                <div class="fp-score-grid">
                    <div class="fp-score-item">
                        <div class="fp-label">Semantic</div>
                        <div class="fp-value">${ai.semantic_score || 0}%</div>
                    </div>
                    <div class="fp-score-item">
                        <div class="fp-label">LLM Score</div>
                        <div class="fp-value">${ai.llm_score || 0}%</div>
                    </div>
                    <div class="fp-score-item">
                        <div class="fp-label">NLP Rules</div>
                        <div class="fp-value">${ai.nlp_score || 0}%</div>
                    </div>
                    <div class="fp-score-item">
                        <div class="fp-label">Favicon Hash</div>
                        <div class="fp-value">${ai.favicon_score || 0}%</div>
                    </div>
                </div>
                
                <div style="margin-top: 8px; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 4px;">
                    Checked against: Google GSV, PhishTank, URLhaus, OpenPhish
                </div>
            </details>
        `;
        positionPopup(x, y);
    }

    function handleMouseOver(e) {
        const link = e.target.closest('a');
        if (!link) return;

        if (currentHoveredLink === link) return;
        currentHoveredLink = link;

        const url = link.href;
        const text = link.innerText.trim() || link.title || "No text";
        const x = e.clientX;
        const y = e.clientY;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (currentHoveredLink === link) {
                analyzeLink(url, text, x, y);
            }
        }, 600);
    }

    function handleMouseOut(e) {
        const link = e.target.closest('a');
        if (!link) return;

        if (currentHoveredLink === link) {
            currentHoveredLink = null;
            clearTimeout(debounceTimer);
            popup.classList.remove('visible');
        }
    }

    createPopup();
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
})();
