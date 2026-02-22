interface AnalysisResult {
    overall_score: number;
    status: string;
    details: {
        intent?: string;
        explanation?: string;
        ai_results?: {
            semantic_score?: number;
            llm_score?: number;
            nlp_score?: number;
            favicon_score?: number;
        };
        blacklist?: {
            status: string;
            services: Record<string, boolean>;
        };
    };
}

interface UserState {
    xp: number;
    level: number;
    totalScans: number;
    maliciousDetected: number;
}

(function () {
    let popup: HTMLDivElement | null = null;
    let debounceTimer: number | null = null;
    let hideTimer: number | null = null;
    let currentHoveredLink: HTMLAnchorElement | null = null;

    const LEVELS_XP = 500; // XP per level

    async function getUserState(): Promise<UserState> {
        return new Promise((resolve) => {
            chrome.storage.local.get(['userState'], (result) => {
                resolve(result.userState || { xp: 0, level: 1, totalScans: 0, maliciousDetected: 0 });
            });
        });
    }

    async function saveUserState(state: UserState) {
        return new Promise<void>((resolve) => {
            chrome.storage.local.set({ userState: state }, () => resolve());
        });
    }

    async function addXP(amount: number) {
        const state = await getUserState();
        state.xp += amount;
        state.totalScans += 1;

        if (state.xp >= state.level * LEVELS_XP) {
            state.level += 1;
            showLevelUp(state.level);
        }

        await saveUserState(state);
        return state;
    }

    function createPopup() {
        if (document.getElementById('fish-pish-popup')) return;
        popup = document.createElement('div');
        popup.id = 'fish-pish-popup';
        document.body.appendChild(popup);
    }

    function showLoading(x: number, y: number) {
        if (!popup) return;
        popup.innerHTML = `
            <div class="fp-loading">
                <div class="fp-spinner"></div>
                <div style="margin-top: 12px; font-weight: 600; font-size: 12px; color: #94a3b8;">Analyzing ripples...</div>
            </div>
        `;
        positionPopup(x, y);
        popup.classList.add('visible');
    }

    function positionPopup(x: number, y: number) {
        if (!popup) return;
        const padding = 20;
        let left = x + padding;
        let top = y + padding;

        const width = 300;
        const height = 400; // Estimated max height

        if (left + width > window.innerWidth) left = x - width - padding;
        if (top + height > window.innerHeight) top = y - height - padding;

        popup.style.left = `${left + window.scrollX}px`;
        popup.style.top = `${top + window.scrollY}px`;
    }

    async function analyzeLink(link: HTMLAnchorElement, x: number, y: number) {
        showLoading(x, y);
        const url = link.href;
        const text = link.innerText.trim() || link.title || "Unknown Link";

        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, anchor_text: text })
            });

            if (!response.ok) throw new Error('API Error');
            const data: AnalysisResult = await response.json();

            const state = await addXP(data.overall_score > 50 ? 25 : 5);
            updatePopup(data, state, x, y);
        } catch (error) {
            console.error('Fish-Pish Error:', error);
            if (popup) {
                popup.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <div style="color: #ef4444; font-weight: 700; margin-bottom: 8px;">Analysis Failed</div>
                        <div style="font-size: 11px; color: #94a3b8;">Is the Fish-Pish backend running?</div>
                    </div>
                `;
            }
        }
    }

    function updatePopup(data: AnalysisResult, state: UserState, x: number, y: number) {
        if (!popup) return;
        const { overall_score: score, status, details } = data;
        const ai = details.ai_results || {};

        let badgeClass = 'fp-badge-safe';
        if (status === 'DANGER' || status === 'VERIFIED_PHISH') badgeClass = 'fp-badge-danger';
        else if (status === 'SUSPICIOUS') badgeClass = 'fp-badge-suspicious';

        const xpProgress = Math.floor((state.xp % LEVELS_XP) / LEVELS_XP * 100);

        popup.innerHTML = `
            <div class="fp-header">
                <div class="fp-brand">
                    <div class="fp-logo">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div class="fp-title">FISH-PISH</div>
                </div>
                <div class="fp-badge ${badgeClass}">${status}</div>
            </div>

            <div class="fp-trust-container">
                <div class="fp-stats">
                    <span class="fp-label">Risk Intensity</span>
                    <span class="fp-value">${score}%</span>
                </div>
                <div class="fp-trust-bar">
                    <div class="fp-trust-fill" style="width: ${score}%; background: ${score > 70 ? 'var(--fp-danger)' : score > 30 ? 'var(--fp-warning)' : 'var(--fp-safe)'}"></div>
                </div>
            </div>

            <div class="fp-awareness-card">
                <div class="fp-tip-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-4.7 8.38 8.38 0 0 1 3.8.9L21 3.5"></path></svg>
                    AI Security Insight
                </div>
                <div style="color: #fff; margin-bottom: 4px; font-weight: 600;">"${details.intent || 'Unknown Intent'}"</div>
                <div style="color: var(--fp-text-muted); font-size: 11px;">${details.explanation || 'The patterns in this URL are being cross-referenced with tactical threat data.'}</div>
            </div>

            <div class="fp-user-level">
                <div style="font-weight: 800; color: var(--fp-accent);">LVL ${state.level}</div>
                <div class="fp-xp-bar">
                    <div class="fp-xp-fill" style="width: ${xpProgress}%"></div>
                </div>
                <div style="color: var(--fp-text-muted); min-width: 45px; text-align: right;">${state.xp % LEVELS_XP}/${LEVELS_XP}</div>
            </div>
            
            <div style="margin-top: 10px; font-size: 9px; text-align: center; color: var(--fp-text-muted); opacity: 0.7;">
                +${score > 50 ? 25 : 5} XP earned for this scan
            </div>
        `;
        positionPopup(x, y);
    }

    function showLevelUp(level: number) {
        const overlay = document.createElement('div');
        overlay.className = 'fp-rank-up';
        overlay.innerHTML = `
            <div style="font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 10px;">LEVEL UP!</div>
            <div style="font-size: 48px; font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.5);">LVL ${level}</div>
            <div style="margin-top: 20px; color: rgba(255,255,255,0.8); font-weight: 600;">NEW RANK: CYBER SENTINEL</div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 2500);
    }

    function handleMouseOver(e: MouseEvent) {
        const link = (e.target as HTMLElement).closest('a');
        if (!link) return;

        if (currentHoveredLink === link) {
            // If already hovering and we have a hide timer, clear it
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
            return;
        }

        currentHoveredLink = link;
        const x = e.clientX;
        const y = e.clientY;

        if (debounceTimer) clearTimeout(debounceTimer);
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = null;

        debounceTimer = window.setTimeout(() => {
            if (currentHoveredLink === link) {
                analyzeLink(link, x, y);
            }
        }, 600);
    }

    function handleMouseOut(e: MouseEvent) {
        const link = (e.target as HTMLElement).closest('a');
        if (!link) return;

        if (currentHoveredLink === link) {
            currentHoveredLink = null;
            if (debounceTimer) clearTimeout(debounceTimer);

            // STAY VISIBLE FOR 3 SECONDS AFTER HOVER ENDS
            hideTimer = window.setTimeout(() => {
                if (!currentHoveredLink && popup) {
                    popup.classList.remove('visible');
                }
            }, 3000);
        }
    }

    createPopup();
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
})();
