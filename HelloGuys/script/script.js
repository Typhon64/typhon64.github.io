// GSAP Animation for header entrance
gsap.from('.header', { y: -50, opacity: 0, duration: 1, ease: 'expo.out' });

// Entrance animations for main content sections
gsap.from(".left-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.2 });
gsap.from(".right-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.4 }); // Re-enabled animation
gsap.from(".terminal-container", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.6 }); // Re-enabled animation

// Particle.js configuration - Base config
const particleConfigBase = {
    particles: {
        number: { value: 260, density: { enable: true, value_area: 800 } }, // Sabit 260 parçacık
        shape: { type: 'circle' },
        opacity: { 
            value: 0.5,
            random: true, 
            anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
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

let initialWindowArea; // Pencere alanı için
let initialParticleCanvasArea; // Parçacık canvas alanı için

function initializeParticles(particleColor) {
    let pJSInstance;

    // Mevcut pJS örneği varsa, sadece rengi ve yoğunluğu güncelle
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        pJSInstance = window.pJSDom[0].pJS;
        pJSInstance.particles.color.value = particleColor;
        if (pJSInstance.particles.line_linked) {
            pJSInstance.particles.line_linked.color = particleColor; 
        }
        updateParticlesDensity(); 
        return;
    }

    // İlk kez başlatma
    let currentParticleConfig = JSON.parse(JSON.stringify(particleConfigBase));
    currentParticleConfig.particles.color = { value: particleColor };
    currentParticleConfig.particles.line_linked.color = particleColor; 
    currentParticleConfig.particles.number.value = 260; // Sabit 260 parçacık
    currentParticleConfig.particles.number.density.enable = true;
    
    particlesJS('particles-js', currentParticleConfig); 

    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        pJSInstance = window.pJSDom[0].pJS;
        pJSInstance.particles.color.value = particleColor;
        if (pJSInstance.particles.line_linked) {
            pJSInstance.particles.line_linked.color = particleColor;
        }
       
        // İlk canvas alanını yakala
        if (pJSInstance && initialParticleCanvasArea === undefined) { 
            initialParticleCanvasArea = pJSInstance.canvas.w * pJSInstance.canvas.h;
        }

        updateParticlesDensity(); 

        const particlesJSElement = document.getElementById('particles-js');
        if (particlesJSElement && particlesJSElement.style) {
            particlesJSElement.style.pointerEvents = 'none'; 
        }
    } else {
        console.error("particles.js başlatılamadı!");
    }
}

function updateParticlesDensity() {
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const pJS = window.pJSDom[0].pJS;
        const currentParticleCanvasArea = pJS.canvas.w * pJS.canvas.h;

        // Canvas alanı için temel yoğunluk hesaplaması
        let baseDensityAreaForCurrentCanvas = currentParticleCanvasArea / 1000.0;
        if (baseDensityAreaForCurrentCanvas <= 0.001) baseDensityAreaForCurrentCanvas = 0.001; 

        pJS.particles.number.value = 260; // Parçacık sayısını sabit tut

        let densityAdjustmentFactor = 1.0; // Varsayılan: 260 parçacık hedefi

        if (typeof initialParticleCanvasArea === 'number' && initialParticleCanvasArea > 0 && currentParticleCanvasArea > 0) {
            const canvasAreaZoomRatio = currentParticleCanvasArea / initialParticleCanvasArea;

            // Zoom-out için eşikler
            const NORMAL_CANVAS_RATIO_LOWER_BOUND = 0.8; // Zoom-out başlangıcı
            const MODERATE_ZOOM_OUT_SPARSITY_FACTOR = 1.75; // ~148 parçacık
            const EXTREME_ZOOM_OUT_SPARSITY_FACTOR = 3.5;   // ~74 parçacık
            const EXTREME_ZOOM_OUT_RATIO_THRESHOLD = 0.25; // Ekstrem zoom-out

            if (canvasAreaZoomRatio < EXTREME_ZOOM_OUT_RATIO_THRESHOLD) {
                densityAdjustmentFactor = EXTREME_ZOOM_OUT_SPARSITY_FACTOR;
            } else if (canvasAreaZoomRatio < NORMAL_CANVAS_RATIO_LOWER_BOUND) {
                densityAdjustmentFactor = MODERATE_ZOOM_OUT_SPARSITY_FACTOR;
            }
            // Yakınlaştırma durumunda (canvasAreaZoomRatio >= 0.8), 260 parçacık korunur
        }
        
        // Yoğunluk ayarını güncelle
        pJS.particles.number.density.value_area = baseDensityAreaForCurrentCanvas * densityAdjustmentFactor;
        
        // Parçacıkların birikimini önlemek için mevcut parçacıkları temizle ve yeniden oluştur
        pJS.fn.particlesEmpty(); // Mevcut parçacıkları sil
        pJS.fn.particlesCreate(); // Yeni parçacıkları oluştur
        pJS.fn.particlesRefresh(); // Parçacıkları yenile
    }
}

// Tema değiştirme
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

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
    applyTheme(newTheme, false);
});

// Dil değiştirme
const languageToggleButton = document.getElementById('language-toggle-btn');
const elementsToTranslate = document.querySelectorAll('[data-tr], [data-en]');
const tooltipElements = document.querySelectorAll('[data-tr-tooltip], [data-en-tooltip]');
const pageTitleElement = document.querySelector('title'); // Added for specific title handling
let currentDisplayTitle = ""; // Stores the current translated page title

function applyLanguage(lang) {
    document.documentElement.lang = lang;

    elementsToTranslate.forEach(el => {
        const newText = el.getAttribute(`data-${lang}`);
        if (newText !== null) {
            if (el.matches('div.hero-subtext p') || el.matches('.about p') || (el.closest('.card-body') && el.tagName === 'P' && !el.classList.contains('profile-lang'))) {
                 // Preserve <br> and <span> within specific paragraph elements
                el.innerHTML = newText;
            } else if (newText.includes('<') && newText.includes('>') && (el.tagName === 'SPAN' || el.tagName === 'A' || el.tagName === 'BUTTON')) {
                 // Allow simple HTML in specific inline elements if necessary (e.g. for icons within buttons/links if any)
                el.innerHTML = newText;
            } else {
                // For most elements, textContent is safer and preferred.
                // This handles cases like h1, h2, h3, simple p, li, button text, etc.
                let textNode = null;
                // Prioritize direct text node if it's the main content
                for(let child of el.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                        textNode = child;
                        break;
                    }
                }
                if(textNode) {
                    textNode.textContent = newText;
                } else if (el.children.length === 0 || el.tagName === 'TITLE') { // If no children or it's the title tag
                    el.textContent = newText;
                } else if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
                    // If the first child is a text node, update it (common for buttons/links with text only)
                    el.firstChild.textContent = newText;
                } else {
                    // Fallback for elements that might have icons or other structure
                    // but the main translatable text is not easily identifiable as a direct text node.
                    // This ensures text is set, but might overwrite structure if not careful with data attributes.
                    // For complex structures, ensure the data-tr/data-en has the full innerHTML if needed.
                    // However, for this project, most elements are simple or handled by specific selectors above.
                    let targetTextNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
                    if (targetTextNode) {
                        targetTextNode.textContent = newText;
                    } else {
                        // If truly no identifiable text node, as a last resort set innerHTML for simple cases,
                        // but be cautious as this can break complex elements if not intended.
                        // Most cases should be covered by textContent on element itself or its specific child.
                        // For simple spans, etc., this is okay.
                         if(el.children.length === 0 || !Array.from(el.children).some(child => child.tagName === 'I' || child.tagName === 'SVG')) {
                            el.innerHTML = newText;
                         }
                    }
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

    // Update page title specifically
    if (pageTitleElement) {
        const titleText = pageTitleElement.getAttribute(`data-${lang}`);
        if (titleText) {
            document.title = titleText;
            currentDisplayTitle = titleText; // Store the successfully set title
        } else if (pageTitleElement.getAttribute('data-en')) { // Fallback to English title if current lang title missing
            const fallbackTitle = pageTitleElement.getAttribute('data-en');
            document.title = fallbackTitle;
            currentDisplayTitle = fallbackTitle;
        } else { // Absolute fallback
            document.title = "Typhon64";
            currentDisplayTitle = "Typhon64";
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
    const currentLang = localStorage.getItem('language') || 'en'; // Default to 'en' as in original script
    if (document.hidden) {
        document.title = currentLang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    } else {
        // Restore to the correctly translated title for the current language
        if (pageTitleElement) {
            const titleText = pageTitleElement.getAttribute(`data-${currentLang}`);
            if (titleText) {
                document.title = titleText;
            } else if (pageTitleElement.getAttribute('data-en')) { // Fallback to English title
                 document.title = pageTitleElement.getAttribute('data-en');
            } else { // Absolute fallback
                document.title = "Typhon64";
            }
        } else { // Fallback if pageTitleElement is somehow null
             document.title = currentLang === 'tr' ? "Typhon64" : "Typhon64";
        }
    }
});

// Debounce fonksiyonu
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

// Resize olayını optimize et
const handleResize = debounce(function() {
    if (initialWindowArea !== undefined) {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const particleColor = getComputedStyle(body).getPropertyValue(
            currentTheme === 'light' ? '--particle-color-light' : '--particle-color-dark'
        ).trim().replace(/\'/g, '');
        initializeParticles(particleColor);
    }
}, 150); // Optimize edilmiş debounce süresi

window.addEventListener('resize', handleResize);

// İlk yükleme ayarları
document.addEventListener('DOMContentLoaded', () => {
    initialWindowArea = window.innerWidth * window.innerHeight;
    
    // Set body class for theme BEFORE getting particle color
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme, true); // Apply theme and update body class

    // Apply language. This will also set the document.title correctly.
    const savedLang = localStorage.getItem('language') || 'en'; // Default to 'en'
    applyLanguage(savedLang); // This now sets currentDisplayTitle

    // Initialize particles AFTER theme and language (mainly for particle color from CSS vars)
    const currentAppliedTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    const particleColorString = getComputedStyle(body).getPropertyValue(
        currentAppliedTheme === 'light' ? '--particle-color-light' : '--particle-color-dark'
    ).trim();
    const finalParticleColor = particleColorString.replace(/'/g, ''); // Remove single quotes if any
    
    initializeParticles(finalParticleColor);

    if (initialParticleCanvasArea === undefined && window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const pJS = window.pJSDom[0].pJS;
        initialParticleCanvasArea = pJS.canvas.w * pJS.canvas.h;
        // Call updateParticlesDensity if it's intended to run on initial load after area is known
        // updateParticlesDensity(); 
    }
    
    // Visibility change already sets title based on currentDisplayTitle (implicitly via applyLanguage)
    // or specific offline messages. Initial title is set by applyLanguage.
    // The original logic here was a bit redundant if applyLanguage handles title.
    if (document.hidden) { // Re-check immediately after load for initial state
        const langForOfflineTitle = localStorage.getItem('language') || 'en';
        document.title = langForOfflineTitle === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    } // Else, applyLanguage has already set the correct title.

    // Terminal buton işlevselliği
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
