let currentSeason = 'fall';
let clickCount = 0;
let troutJumping = false;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    detectSeason();
    renderLakeScene();

    // Lake scene click handler
    document.getElementById('lakeScene').addEventListener('click', handleLakeClick);

    // Auto trout jumps for summer/spring
    setInterval(() => {
        if ((currentSeason === 'summer' || currentSeason === 'spring') && Math.random() > 0.7) {
            jumpTrout();
        }
    }, 4000);
});

function detectSeason() {
    const month = new Date().getMonth() + 1;
    if ([11, 12, 1, 2, 3].includes(month)) currentSeason = 'winter';
    else if ([4, 5].includes(month)) currentSeason = 'spring';
    else if ([6, 7, 8].includes(month)) currentSeason = 'summer';
    else currentSeason = 'fall';

    updateSeasonUI();
}

function changeSeason(season) {
    currentSeason = season;
    clickCount = 0;
    updateSeasonUI();
    renderLakeScene();
}

function updateSeasonUI() {
    document.body.className = `text-white season-${currentSeason}`;

    // Update season buttons
    document.querySelectorAll('.season-btn').forEach(btn => {
        const btnSeason = btn.getAttribute('data-season');
        if (btnSeason === currentSeason) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update lake hint text
    const hints = {
        winter: 'Frozen lake with cozy houseboat',
        spring: 'Ice breakup - click for trout!',
        summer: 'Click the lake to see a trout jump!',
        fall: 'Preparing for winter freeze'
    };
    document.getElementById('lakeText').textContent = hints[currentSeason];
}

function renderLakeScene() {
    const scene = document.getElementById('lakeScene');

    const colors = {
        winter: {
            sky: 'linear-gradient(to bottom, #0f172a, #1e3a8a, #312e81)',
            lake: 'linear-gradient(to bottom, rgba(165, 243, 252, 0.4), rgba(191, 219, 254, 0.5))',
            border: '#38bdf8',
            aurora1: 'rgba(56, 189, 248, 0.3)',
            aurora2: 'rgba(129, 140, 248, 0.3)',
            aurora3: 'rgba(192, 132, 252, 0.2)'
        },
        spring: {
            sky: 'linear-gradient(to bottom, #1e293b, #0c4a6e, #1e40af)',
            lake: 'linear-gradient(to bottom, rgba(37, 99, 235, 0.5), rgba(29, 78, 216, 0.6))',
            border: '#60a5fa',
            aurora1: 'rgba(96, 165, 250, 0.3)',
            aurora2: 'rgba(52, 211, 153, 0.2)',
            aurora3: 'rgba(251, 191, 36, 0.2)'
        },
        summer: {
            sky: 'linear-gradient(to bottom, #78350f, #92400e, #a16207)',
            lake: 'linear-gradient(to bottom, rgba(5, 150, 105, 0.6), rgba(15, 118, 110, 0.7))',
            border: '#fbbf24',
            sun: 'rgba(251, 191, 36, 0.4)',
            aurora1: 'rgba(251, 191, 36, 0.3)',
            aurora2: 'rgba(34, 197, 94, 0.2)'
        },
        fall: {
            sky: 'linear-gradient(to bottom, #7c2d12, #991b1b, #6b21a8)',
            lake: 'linear-gradient(to bottom, rgba(30, 64, 175, 0.5), rgba(49, 46, 129, 0.6))',
            border: '#f59e0b',
            aurora1: 'rgba(245, 158, 11, 0.3)',
            aurora2: 'rgba(239, 68, 68, 0.2)',
            aurora3: 'rgba(139, 92, 246, 0.2)'
        }
    };

    const c = colors[currentSeason];
    scene.style.borderColor = c.border;

    scene.innerHTML = `
        <!-- Sky -->
        <div style="position: absolute; inset: 0; background: ${c.sky};">
            ${currentSeason === 'summer' ? `
                <div style="position: absolute; top: 2rem; right: 25%; width: 6rem; height: 6rem; background: ${c.sun}; border-radius: 9999px; filter: blur(60px); animation: pulse 3s ease-in-out infinite;"></div>
            ` : `
                <div style="position: absolute; top: 1rem; left: 25%; width: 8rem; height: 4rem; background: ${c.aurora1}; filter: blur(40px); animation: float 6s ease-in-out infinite;"></div>
                <div style="position: absolute; top: 2rem; right: 25%; width: 10rem; height: 5rem; background: ${c.aurora2}; filter: blur(40px); animation: float 6s ease-in-out infinite; animation-delay: 0.4s;"></div>
                ${c.aurora3 ? `<div style="position: absolute; top: 0.5rem; left: 50%; width: 9rem; height: 3rem; background: ${c.aurora3}; filter: blur(40px); animation: float 6s ease-in-out infinite; animation-delay: 0.2s;"></div>` : ''}
            `}
        </div>

        ${currentSeason !== 'summer' ? `
            <div style="position: absolute; top: 1rem; left: 2rem; width: 4px; height: 4px; background: white; border-radius: 9999px; animation: pulse 2s ease-in-out infinite;"></div>
            <div style="position: absolute; top: 2rem; left: 5rem; width: 4px; height: 4px; background: white; border-radius: 9999px; animation: pulse 2s ease-in-out infinite; animation-delay: 0.2s;"></div>
            <div style="position: absolute; top: 1.5rem; right: 4rem; width: 4px; height: 4px; background: white; border-radius: 9999px; animation: pulse 2s ease-in-out infinite; animation-delay: 0.4s;"></div>
        ` : ''}

        ${currentSeason === 'winter' ? '<div id="snowContainer" style="position: absolute; inset: 0; pointer-events: none;"></div>' : ''}

        ${currentSeason === 'fall' ? `
            <div style="position: absolute; top: 0; left: 25%; width: 8px; height: 8px; background: linear-gradient(to bottom right, #f97316, #dc2626); border-radius: 2px; animation: fall 8s linear infinite;"></div>
            <div style="position: absolute; top: 0; right: 33%; width: 8px; height: 8px; background: linear-gradient(to bottom right, #ea580c, #b91c1c); border-radius: 2px; animation: fall 8s linear infinite; animation-delay: 0.5s;"></div>
        ` : ''}

        <!-- Lake -->
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 66%; background: ${c.lake};">
            ${currentSeason === 'winter' ? `
                <div style="position: absolute; top: 25%; left: 25%; width: 8rem; height: 2px; background: rgba(191, 219, 254, 0.3); transform: rotate(12deg);"></div>
                <div style="position: absolute; top: 33%; right: 33%; width: 6rem; height: 2px; background: rgba(191, 219, 254, 0.3); transform: rotate(-6deg);"></div>
            ` : ''}
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding-bottom: 0.5rem;">
                <div style="height: 2px; background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent); animation: pulse 2s ease-in-out infinite;"></div>
            </div>
        </div>

        <!-- Houseboat -->
        <div style="position: absolute; bottom: 4rem; left: 25%; transform: translateX(-50%); animation: float 6s ease-in-out infinite;">
            ${currentSeason === 'winter' ? '<div style="position: absolute; top: -4px; left: 0; right: 0; height: 8px; background: white; border-radius: 4px 4px 0 0; opacity: 0.8;"></div>' : ''}
            <div style="width: 4rem; height: 12px; background: linear-gradient(to bottom, #dc2626, #b91c1c); border: 2px solid #7f1d1d; transform: skewX(-12deg); margin-bottom: -2px;"></div>
            <div style="width: 4rem; height: 2.5rem; background: linear-gradient(to bottom, #d97706, #b45309); border: 2px solid #1f2937; position: relative;">
                <div style="position: absolute; top: 0.5rem; left: 0.5rem; width: 1rem; height: 1rem; background: ${currentSeason === 'winter' ? 'rgba(251, 191, 36, 0.9)' : 'rgba(251, 191, 36, 0.7)'}; border: 1px solid #78350f;"></div>
                <div style="position: absolute; top: 0.5rem; right: 0.5rem; width: 1rem; height: 1rem; background: ${currentSeason === 'winter' ? 'rgba(251, 191, 36, 0.9)' : 'rgba(251, 191, 36, 0.7)'}; border: 1px solid #78350f;"></div>
                ${currentSeason === 'winter' ? `
                    <div style="position: absolute; top: 0.5rem; left: 0.5rem; width: 1rem; height: 1rem; background: #fde047; filter: blur(4px); opacity: 0.6;"></div>
                    <div style="position: absolute; top: 0.5rem; right: 0.5rem; width: 1rem; height: 1rem; background: #fde047; filter: blur(4px); opacity: 0.6;"></div>
                ` : ''}
            </div>
            <div style="width: 5rem; height: 1rem; background: linear-gradient(to bottom, #4b5563, #374151); border: 2px solid #1f2937; border-radius: 0 0 0.5rem 0.5rem; margin-left: -0.5rem;"></div>
        </div>

        ${(currentSeason === 'summer' || currentSeason === 'spring') ? `
            <div id="trout" style="position: absolute; bottom: 3rem; right: 33%; transition: all 1s; opacity: 0; transform: translateY(0) rotate(12deg);">
                <div style="width: 3rem; height: 1.5rem; background: linear-gradient(to right, #0d9488, #14b8a6, #0d9488); border-radius: 9999px; border: 2px solid #115e59; position: relative;">
                    <div style="position: absolute; top: 4px; left: 8px; width: 6px; height: 6px; background: #fbbf24; border-radius: 9999px;"></div>
                    <div style="position: absolute; top: 12px; left: 16px; width: 6px; height: 6px; background: #fbbf24; border-radius: 9999px;"></div>
                </div>
                <div style="position: absolute; right: -8px; top: 50%; transform: translateY(-50%) rotate(45deg); width: 1rem; height: 1rem; background: #0d9488; border: 2px solid #115e59;"></div>
            </div>
        ` : ''}

        <div style="position: absolute; bottom: 0.5rem; right: 0.5rem; font-family: 'Press Start 2P', cursive; font-size: 0.625rem; color: rgba(255, 255, 255, 0.5);">
            ${(currentSeason === 'summer' || currentSeason === 'spring') ? '<span id="clickCounter">Click!</span>' : currentSeason === 'winter' ? '❄️ Frozen' : '🍂 Chilly'}
        </div>

        <div style="position: absolute; top: 0.5rem; left: 0.5rem; backdrop-filter: blur(8px); padding: 0.25rem 0.75rem; border-radius: 9999px; border: 1px solid ${c.border}; background: rgba(0, 0, 0, 0.6);">
            <p style="font-size: 0.75rem; font-weight: 600; color: ${c.border};">Great Slave Lake</p>
        </div>
    `;

    if (currentSeason === 'winter') {
        addSnowfall();
    }
}

function addSnowfall() {
    const container = document.getElementById('snowContainer');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
        const snowflake = document.createElement('div');
        snowflake.textContent = '❄';
        snowflake.style.cssText = `
            position: absolute;
            color: white;
            opacity: 0.6;
            left: ${Math.random() * 100}%;
            animation: fall ${5 + Math.random() * 5}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            font-size: ${8 + Math.random() * 4}px;
        `;
        container.appendChild(snowflake);
    }
}

function handleLakeClick() {
    if (currentSeason === 'summer' || currentSeason === 'spring') {
        jumpTrout();
        clickCount++;
        const counter = document.getElementById('clickCounter');
        if (counter) counter.textContent = `Click! ×${clickCount}`;
    }
}

function jumpTrout() {
    if (troutJumping) return;
    troutJumping = true;

    const trout = document.getElementById('trout');
    if (trout) {
        trout.style.transform = 'translateY(-5rem) rotate(-30deg)';
        trout.style.opacity = '1';

        setTimeout(() => {
            trout.style.transform = 'translateY(0) rotate(12deg)';
            trout.style.opacity = '0';
            troutJumping = false;
        }, 1500);
    }
}
