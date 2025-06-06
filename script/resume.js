// Particle.js configuration and related functions
const particleConfigBase = {
    particles: {
        number: { value: 150, density: { enable: true, value_area: 800 } },
        shape: { type: 'circle' },
        opacity: {
            value: 0.4,
            random: true,
            anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
        },
        size: { value: 2.5, random: true },
        line_linked: { enable: true, distance: 120, opacity: 0.2, width: 1 },
        move: { enable: true, speed: 1.5, direction: 'none', random: true }
    },
    interactivity: {
        detect_on: 'window',
        events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: false, mode: 'push' },
            resize: true
        },
        modes: {
            grab: { distance: 90, line_linked: { opacity: 0.6 } }
        }
    },
    retina_detect: true,
    fps_limit: 60
};

let initialWindowArea;
let initialParticleCanvasArea;

function initializeParticles(particleColor) {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const pJSInstance = window.pJSDom[0].pJS;
        pJSInstance.particles.color.value = particleColor;
        if (pJSInstance.particles.line_linked) {
            pJSInstance.particles.line_linked.color = particleColor;
        }
        pJSInstance.fn.particlesRefresh();
        return;
    }
    let currentParticleConfig = JSON.parse(JSON.stringify(particleConfigBase));
    currentParticleConfig.particles.color = { value: particleColor };
    currentParticleConfig.particles.line_linked.color = particleColor;
    particlesJS('particles-js', currentParticleConfig);
}

function updateParticlesDensity() {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const pJS = window.pJSDom[0].pJS;
        const currentParticleCanvasArea = pJS.canvas.w * pJS.canvas.h;
        let baseDensityAreaForCurrentCanvas = currentParticleCanvasArea / 1000.0;
        if (baseDensityAreaForCurrentCanvas <= 0.001) baseDensityAreaForCurrentCanvas = 0.001;
        pJS.particles.number.value = 260;
        let densityAdjustmentFactor = 1.0;
        if (typeof initialParticleCanvasArea === 'number' && initialParticleCanvasArea > 0 && currentParticleCanvasArea > 0) {
            const canvasAreaZoomRatio = currentParticleCanvasArea / initialParticleCanvasArea;
            const NORMAL_CANVAS_RATIO_LOWER_BOUND = 0.8;
            const MODERATE_ZOOM_OUT_SPARSITY_FACTOR = 1.75;
            const EXTREME_ZOOM_OUT_SPARSITY_FACTOR = 3.5;
            const EXTREME_ZOOM_OUT_RATIO_THRESHOLD = 0.25;
            if (canvasAreaZoomRatio < EXTREME_ZOOM_OUT_RATIO_THRESHOLD) {
                densityAdjustmentFactor = EXTREME_ZOOM_OUT_SPARSITY_FACTOR;
            } else if (canvasAreaZoomRatio < NORMAL_CANVAS_RATIO_LOWER_BOUND) {
                densityAdjustmentFactor = MODERATE_ZOOM_OUT_SPARSITY_FACTOR;
            }
        }
        pJS.particles.number.density.value_area = baseDensityAreaForCurrentCanvas * densityAdjustmentFactor;
        pJS.fn.particlesEmpty();
        pJS.fn.particlesCreate();
        pJS.fn.particlesRefresh();
    }
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

const handleResize = debounce(function() {
    if (initialWindowArea !== undefined) {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const particleColor = getComputedStyle(document.body).getPropertyValue(
            currentTheme === 'light' ? '--particle-color-light' : '--particle-color-dark'
        ).trim().replace(/'/g, '');
        initializeParticles(particleColor);
    }
}, 150);

// DOM Elements and Global Variables
const body = document.body;
const elementsToTranslate = document.querySelectorAll('[data-tr], [data-en]');
const titleElementsToTranslate = document.querySelectorAll('[data-tr-title], [data-en-title]');
const pageTitle = document.querySelector('title');

const langToggleBtn = document.getElementById('lang-toggle-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const langBtnText = langToggleBtn ? langToggleBtn.querySelector('.lang-btn-text') : null;
const moonIcon = themeToggleBtn ? themeToggleBtn.querySelector('.fa-moon') : null;
const sunIcon = themeToggleBtn ? themeToggleBtn.querySelector('.fa-sun') : null;

let originalPageTitle = document.title;

// Theme Application
function applyTheme(theme, isInitialLoad = false) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        if (sunIcon) sunIcon.style.display = 'inline-block';
        if (moonIcon) moonIcon.style.display = 'none';
    } else {
        body.classList.remove('light-theme');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'inline-block';
    }
    localStorage.setItem('theme', theme);

    // Initialize or update particles with the correct color for the new theme
    // Use a timeout to ensure CSS variables are applied before getting particle color
    setTimeout(() => {
        const particleColor = getComputedStyle(body).getPropertyValue(
            theme === 'light' ? '--particle-color-light' : '--particle-color-dark'
        ).trim().replace(/\'/g, '');
         if (particleColor) {
            initializeParticles(particleColor);
        } else {
            // Fallback if CSS variables are not immediately available (should be rare with resume.css)
            initializeParticles(theme === 'light' ? '#A0522D' : '#c4b5fd'); 
        }
    }, 0);
}

// Language Application
function applyLanguage(lang) {
    document.documentElement.lang = lang;
    if (langBtnText) {
        langBtnText.textContent = lang.toUpperCase();
    }

    elementsToTranslate.forEach(el => {
        const newText = el.getAttribute(`data-${lang}`);
        if (newText !== null) {
            // Simple text replacement, prefer textContent for security unless HTML is intended.
            // Given current attributes, textContent should be fine.
            if (el.tagName === 'A' || el.tagName === 'SPAN' || el.tagName === 'LI' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'P' || el.tagName === 'TITLE') {
                el.textContent = newText;
            } else {
                el.innerHTML = newText; // Fallback for elements where textContent might not be appropriate (e.g. if they contain other inline elements not meant for translation)
            }
        }
    });
    
    titleElementsToTranslate.forEach(el => {
        const newTitle = el.getAttribute(`data-${lang}-title`);
        if (newTitle !== null) {
            el.setAttribute('title', newTitle);
        }
    });

    // Update page title specifically
    if (pageTitle) {
        const newPageTitle = pageTitle.getAttribute(`data-${lang}`);
        if (newPageTitle) {
            document.title = newPageTitle;
        }
    }

    localStorage.setItem('language', lang);
}

// Event Listeners
window.addEventListener('resize', handleResize);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
}

if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'tr';
        const newLang = currentLang === 'tr' ? 'en' : 'tr';
        applyLanguage(newLang);
    });
}

document.addEventListener('visibilitychange', () => {
    const lang = localStorage.getItem('language') || 'tr';
    const offlineTitle = lang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    document.title = document.hidden ? offlineTitle : originalPageTitle;
});

// DOMContentLoaded - Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    initialWindowArea = window.innerWidth * window.innerHeight;

    if (document.title) {
        originalPageTitle = document.title;
    }

    // First apply theme to ensure particles get the right color
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme, true); // true for initial load

    // Then apply language
    const savedLang = localStorage.getItem('language') || 'tr';
    applyLanguage(savedLang);

    if (document.hidden) {
        document.title = savedLang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    } else {
        document.title = originalPageTitle;
    }

    // GSAP Animations (ensure GSAP is loaded)
    if (typeof gsap !== 'undefined') {
        gsap.from('.header', { y: -30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 });
        gsap.from('.resume-sidebar', { x: -50, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 });
        gsap.from('.resume-main-content > *', { 
            opacity: 0, 
            y: 30, 
            duration: 0.7, 
            ease: 'power2.out', 
            stagger: 0.1, 
            delay: 0.5 
        });
    } else {
        console.error("GSAP could not be loaded.");
    }

    // Section Navigation Logic
    const sidebarLinks = document.querySelectorAll('.resume-sidebar nav a');
    const contentSections = document.querySelectorAll('.resume-main-content .resume-section');
    let currentVisibleSection = null;

    function animateSectionIn(sectionElement) {
        if (sectionElement && typeof gsap !== 'undefined') {
            gsap.set(sectionElement, { y: 30, opacity: 0 });
            gsap.to(sectionElement, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }

    function showSection(sectionIdToShow, animate = true) {
        let sectionToShow = null;
        
        // First hide all sections and remove active class from all links
        contentSections.forEach(section => {
            section.classList.remove('active-section');
        });
        
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Then show the target section and activate its link
        contentSections.forEach(section => {
            if (section.id === sectionIdToShow) {
                section.classList.add('active-section');
                sectionToShow = section;
            }
        });
        
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.substring(1) === sectionIdToShow) {
                link.classList.add('active');
            }
        });

        if (animate && sectionToShow) {
            animateSectionIn(sectionToShow);
        } else if (sectionToShow) {
            gsap.set(sectionToShow, { y: 0, opacity: 1 });
        }
        
        currentVisibleSection = sectionToShow;
        return sectionToShow !== null;
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            if (currentVisibleSection && currentVisibleSection.id === targetId && currentVisibleSection.classList.contains('active-section')) {
                // If clicking the same section that's already active, do nothing or toggle
                // showSection(targetId, false);
            } else {
                showSection(targetId, true);
            }

            if(history.pushState) {
                history.pushState(null, null, `#${targetId}`);
            } else {
                location.hash = `#${targetId}`;
            }
        });
    });

    // Determine initial section to show
    let initialSectionId = 'experience'; // Default
    const availableSections = Array.from(contentSections).map(section => section.id);
    
    // Check if URL has a hash
    const hash = window.location.hash.substring(1);
    if (hash && availableSections.includes(hash)) {
        initialSectionId = hash;
    } else if (availableSections.length > 0) {
        // If no valid hash, use first available section
        initialSectionId = availableSections[0];
    }

    // Show initial section
    if (!showSection(initialSectionId, true) && availableSections.length > 0) {
        // Fallback if initialSectionId is somehow invalid
        showSection(availableSections[0], true);
    }

    // Update current date in Experience section
    function updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const options = { timeZone: 'Europe/Istanbul', year: 'numeric', month: 'long', day: 'numeric' };
            const currentDate = new Date().toLocaleDateString('tr-TR', options);
            dateElement.textContent = currentDate;
            dateElement.setAttribute('data-lang-tr', currentDate);
            dateElement.setAttribute('data-lang-en', new Date().toLocaleDateString('en-US', options));
        }
    }
    updateCurrentDate();
}); 