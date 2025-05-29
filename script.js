// GSAP Animation for header entrance
gsap.from('.header', { y: -50, opacity: 0, duration: 0.8, ease: 'power2.out' });

// Particle.js configuration - This will be our base
const particleConfigBase = {
    particles: {
        number: { value: 260, density: { enable: true, value_area: 800 } },
        shape: { type: 'circle' },
        opacity: { value: 0.35, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, opacity: 0.25, width: 1 },
        move: { enable: true, speed: 1.8, direction: 'none', random: true }
    },
    interactivity: {
        detect_on: 'window',
        events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            grab: { distance: 140, line_linked: { opacity: 0.75 } },
            push: { particles_nb: 2 }
        }
    },
    retina_detect: true,
    fps_limit: 60
};

function initializeParticles(particleColor) {
    let currentParticleConfig = JSON.parse(JSON.stringify(particleConfigBase)); // Deep copy
    currentParticleConfig.particles.color = { value: particleColor };
    currentParticleConfig.particles.line_linked.color = particleColor;
    particlesJS('particles-js', currentParticleConfig);
    // Ensure particles canvas doesn't block interactions
    const particlesJSElement = document.getElementById('particles-js');
    if (particlesJSElement && particlesJSElement.style) {
        particlesJSElement.style.pointerEvents = 'none'; 
    }
}

// Theme toggle
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        initializeParticles(getComputedStyle(body).getPropertyValue('--particle-color-light').trim().replace(/'/g, ''));
        themeToggleButton.setAttribute('aria-pressed', 'true');
    } else {
        body.classList.remove('light-theme');
        initializeParticles(getComputedStyle(body).getPropertyValue('--particle-color-dark').trim().replace(/'/g, ''));
        themeToggleButton.setAttribute('aria-pressed', 'false');
    }
    localStorage.setItem('theme', theme);
}

themeToggleButton.addEventListener('click', () => {
    const newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
    applyTheme(newTheme);
});

// Language toggle
const languageToggleButton = document.getElementById('language-toggle-btn');
const elementsToTranslate = document.querySelectorAll('[data-tr], [data-en]');
const tooltipElements = document.querySelectorAll('[data-tr-tooltip], [data-en-tooltip]');

function applyLanguage(lang) {
    document.documentElement.lang = lang;

    elementsToTranslate.forEach(el => {
        const newText = el.getAttribute(`data-${lang}`);
        if (newText !== null) {
            if (newText.includes('<') && newText.includes('>')) {
                el.innerHTML = newText;
            } else {
                let textNode = null;
                for(let child of el.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                        textNode = child;
                        break;
                    }
                }
                if(textNode) {
                    textNode.textContent = newText;
                } else if (el.children.length === 0) {
                    el.innerHTML = newText; 
                } else if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
                    el.firstChild.textContent = newText;
                } else if (!el.querySelector('i') && !el.querySelector('svg')){
                    el.innerHTML = newText;
                }
            }
        }
    });

    tooltipElements.forEach(el => {
        const tooltipText = el.getAttribute(`data-${lang}-tooltip`);
        if (tooltipText !== null) {
            el.setAttribute('data-tooltip', tooltipText);
        }
    });

    // Update the toggle button text
    if (languageToggleButton) {
        languageToggleButton.textContent = lang.toUpperCase();
    }
    
    localStorage.setItem('language', lang);

    if (document.hidden) {
        document.title = lang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    } else {
        document.title = originalTitle; 
    }
}

if (languageToggleButton) {
    languageToggleButton.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'tr';
        const newLang = currentLang === 'tr' ? 'en' : 'tr';
        applyLanguage(newLang);
    });
}

// Tab title: Change based on tab visibility
let originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
    const currentLang = localStorage.getItem('language') || 'tr';
    if (document.hidden) {
        document.title = currentLang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    } else {
        document.title = originalTitle; 
    }
});

// Initial load settings
const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
const savedLang = localStorage.getItem('language') || 'tr'; // Default to Turkish

// Apply theme first (as it might affect particles that language function might interact with if not careful)
if (typeof applyTheme === 'function') { // Ensure applyTheme is defined
    applyTheme(savedTheme);
}

// Apply language and update toggle button text on initial load
if (typeof applyLanguage === 'function') { // Ensure applyLanguage is defined
    applyLanguage(savedLang);
}