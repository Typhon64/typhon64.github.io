// GSAP Animation for header entrance
gsap.from('.header', { y: -50, opacity: 0, duration: 1, ease: 'expo.out' });

// Entrance animations for main content sections
gsap.from(".left-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.2 });
gsap.from(".right-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.4 });
gsap.from(".terminal-container", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.6 });

// Particle.js configuration - This will be our base
const particleConfigBase = {
    particles: {
        number: { value: 260, density: { enable: true, value_area: 800 } }, // value_area will be dynamically set
        shape: { type: 'circle' },
        opacity: { 
            value: 0.5, // Base opacity
            random: true, 
            anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false } // Opacity animation
        },
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
            grab: { distance: 100, line_linked: { opacity: 0.75 } },
            push: { particles_nb: 1 }
        }
    },
    retina_detect: true,
    fps_limit: 60
};

let initialWindowArea; // Will be set on DOMContentLoaded
let initialParticleCanvasArea; // To store the initial area of the particle canvas

function initializeParticles(particleColor) {
    let pJSInstance;

    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        pJSInstance = window.pJSDom[0].pJS;
        pJSInstance.particles.color.value = particleColor;
        if (pJSInstance.particles.line_linked) {
             pJSInstance.particles.line_linked.color = particleColor; 
        }
        updateParticlesDensity(); 
        return;
    }

    // First time initialization
    let currentParticleConfig = JSON.parse(JSON.stringify(particleConfigBase));
    currentParticleConfig.particles.color = { value: particleColor };
    currentParticleConfig.particles.line_linked.color = particleColor; 
    currentParticleConfig.particles.number.value = 260; 
    currentParticleConfig.particles.number.density.enable = true;
    
    particlesJS('particles-js', currentParticleConfig); 

    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        pJSInstance = window.pJSDom[0].pJS;
        pJSInstance.particles.color.value = particleColor;
        if (pJSInstance.particles.line_linked) {
            pJSInstance.particles.line_linked.color = particleColor;
        }
       
        // Capture initial canvas area here, only once after pJS is created
        if (pJSInstance && initialParticleCanvasArea === undefined) { 
            initialParticleCanvasArea = pJSInstance.canvas.w * pJSInstance.canvas.h;
            // console.log('Initial particle canvas area captured:', initialParticleCanvasArea); 
        }

        updateParticlesDensity(); 

        const particlesJSElement = document.getElementById('particles-js');
        if (particlesJSElement && particlesJSElement.style) {
            particlesJSElement.style.pointerEvents = 'none'; 
        }
    } else {
        console.error("particles.js failed to initialize during first load.");
    }
}

function updateParticlesDensity() {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const pJS = window.pJSDom[0].pJS;
        const currentParticleCanvasArea = pJS.canvas.w * pJS.canvas.h;

        // This is the base for density.value_area that would make particles.js render 
        // pJS.particles.number.value (260) particles across the current canvas.
        // The division by 1000 is part of particles.js internal formula.
        let baseDensityAreaForCurrentCanvas = currentParticleCanvasArea / 1000.0;
        
        // Prevent division by zero or extremely small values if canvas somehow has zero area
        if (baseDensityAreaForCurrentCanvas <= 0.001) baseDensityAreaForCurrentCanvas = 0.001; 

        pJS.particles.number.value = 260; // Ensure base number of particles to aim for is 260

        let densityAdjustmentFactor = 1.0; // Default: aims for 260 particles

        if (typeof initialParticleCanvasArea === 'number' && initialParticleCanvasArea > 0 && currentParticleCanvasArea > 0) {
            const canvasAreaZoomRatio = currentParticleCanvasArea / initialParticleCanvasArea;

            // Define thresholds for zoom-out (canvas getting smaller than initial)
            const NORMAL_CANVAS_RATIO_LOWER_BOUND = 0.8; // Below this, canvas is considered "zoomed out"
            
            const MODERATE_ZOOM_OUT_SPARSITY_FACTOR = 1.75; // Results in ~148 particles
            const EXTREME_ZOOM_OUT_SPARSITY_FACTOR = 3.5;   // Results in ~74 particles

            // Thresholds for applying zoom-out sparsity
            const EXTREME_ZOOM_OUT_RATIO_THRESHOLD = 0.25; // Canvas area < 25% of initial

            if (canvasAreaZoomRatio < EXTREME_ZOOM_OUT_RATIO_THRESHOLD) { // Extreme Zoom OUT
                densityAdjustmentFactor = EXTREME_ZOOM_OUT_SPARSITY_FACTOR;
            } else if (canvasAreaZoomRatio < NORMAL_CANVAS_RATIO_LOWER_BOUND) { // Moderate Zoom OUT
                densityAdjustmentFactor = MODERATE_ZOOM_OUT_SPARSITY_FACTOR;
            }
            // If canvasAreaZoomRatio >= NORMAL_CANVAS_RATIO_LOWER_BOUND (i.e., normal size or zoomed-in/larger):
            // densityAdjustmentFactor remains 1.0. This means we aim for 260 particles.
            // When zoomed-in, the canvas is larger, so 260 particles spread over this larger area
            // will naturally appear sparse and spread out from the viewport's perspective.
        }
        
        pJS.particles.number.density.value_area = baseDensityAreaForCurrentCanvas * densityAdjustmentFactor;
        
        pJS.fn.particlesRefresh(); // This will recalculate and redraw particles
    }
}

// Theme toggle
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body; // Define body here as it's used in applyTheme

function applyTheme(theme, isInitialLoad = false) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        themeToggleButton.setAttribute('aria-pressed', 'true');
    } else {
        body.classList.remove('light-theme');
        themeToggleButton.setAttribute('aria-pressed', 'false');
    }
    localStorage.setItem('theme', theme);

    if (!isInitialLoad) {
        if (initialWindowArea !== undefined) {
            const particleColor = getComputedStyle(body).getPropertyValue(
                theme === 'light' ? '--particle-color-light' : '--particle-color-dark'
            ).trim().replace(/\'/g, '');
            initializeParticles(particleColor);
        }
    }
}

themeToggleButton.addEventListener('click', () => {
    const newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
    applyTheme(newTheme, false); // isInitialLoad = false
});

// Language toggle
const languageToggleButton = document.getElementById('language-toggle-btn');
const elementsToTranslate = document.querySelectorAll('[data-tr], [data-en]');
const tooltipElements = document.querySelectorAll('[data-tr-tooltip], [data-en-tooltip]');
let originalTitle = ""; // Will be set on DOMContentLoaded

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

    if (languageToggleButton) {
        languageToggleButton.textContent = lang.toUpperCase();
    }
    
    localStorage.setItem('language', lang);

    if (originalTitle) { 
        if (document.hidden) {
            document.title = lang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
        } else {
            document.title = originalTitle; 
        }
    }
}

if (languageToggleButton) {
    languageToggleButton.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'tr';
        const newLang = currentLang === 'tr' ? 'en' : 'tr';
        applyLanguage(newLang);
    });
}

document.addEventListener('visibilitychange', () => {
    const currentLang = localStorage.getItem('language') || 'tr';
    if (!originalTitle && document.title) {
         originalTitle = document.title.replace(/System Offline!|Sistem Çevrimdışı!/, '').trim();
    }
    if (originalTitle) {
        if (document.hidden) {
            document.title = currentLang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
        } else {
            document.title = originalTitle; 
        }
    }
});

// Debounce function
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
};

const handleResize = debounce(function() {
    if (initialWindowArea !== undefined) { 
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const particleColor = getComputedStyle(body).getPropertyValue(
            currentTheme === 'light' ? '--particle-color-light' : '--particle-color-dark'
        ).trim().replace(/\'/g, '');
        initializeParticles(particleColor);
    }
}, 250);

window.addEventListener('resize', handleResize);

// Initial load settings moved to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initialWindowArea = window.innerWidth * window.innerHeight;
    
    if (document.title) { // Set original title here
        originalTitle = document.title;
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme, true); 

    const currentAppliedTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    const particleColor = getComputedStyle(body).getPropertyValue(
        currentAppliedTheme === 'light' ? '--particle-color-light' : '--particle-color-dark'
    ).trim().replace(/'/g, '');
    
    // Initialize particles. This will also attempt to set initialParticleCanvasArea.
    initializeParticles(particleColor); 

    // Fallback: Ensure initialParticleCanvasArea is set if initializeParticles didn't (e.g., pJS not ready immediately)
    // This is a bit redundant if initializeParticles always succeeds in setting it.
    if (initialParticleCanvasArea === undefined && window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const pJS = window.pJSDom[0].pJS;
        initialParticleCanvasArea = pJS.canvas.w * pJS.canvas.h;
        // console.log('Initial particle canvas area captured (DOMContentLoaded fallback):', initialParticleCanvasArea);
    }

    const savedLang = localStorage.getItem('language') || 'en';
    applyLanguage(savedLang);
    // Ensure title is correct after language is applied
    if (document.hidden) {
        document.title = savedLang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    } else {
        document.title = originalTitle;
    }


    // Terminal button functionality
    const terminalRedBtn = document.getElementById('terminal-btn-red');
    const terminalYellowBtn = document.getElementById('terminal-btn-yellow');
    const terminalGreenBtn = document.getElementById('terminal-btn-green');

    if (terminalRedBtn) {
        terminalRedBtn.addEventListener('click', () => {
            console.log('Kırmızı terminal butonuna tıklandı! (Kapatma simüle ediliyor)');
        });
    }
    if (terminalYellowBtn) {
        terminalYellowBtn.addEventListener('click', () => {
            console.log('Sarı terminal butonuna tıklandı! (Küçültme simüle ediliyor)');
        });
    }
    if (terminalGreenBtn) {
        terminalGreenBtn.addEventListener('click', () => {
            console.log('Yeşil terminal butonuna tıklandı! (Tam ekran simüle ediliyor)');
        });
    }
});
