// GSAP Animation for header entrance
gsap.from('.header', { y: -50, opacity: 0, duration: 1, ease: 'expo.out' });

// Entrance animations for main content sections
gsap.from(".left-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.2 });
gsap.from(".right-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.4 });
gsap.from(".terminal-container", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.6 });

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
let originalTitle = "";

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
    
    if (document.title) {
        originalTitle = document.title;
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme, true);

    const currentAppliedTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    const particleColor = getComputedStyle(body).getPropertyValue(
        currentAppliedTheme === 'light' ? '--particle-color-light' : '--particle-color-dark'
    ).trim().replace(/'/g, '');
    
    initializeParticles(particleColor);

    if (initialParticleCanvasArea === undefined && window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const pJS = window.pJSDom[0].pJS;
        initialParticleCanvasArea = pJS.canvas.w * pJS.canvas.h;
    }

    const savedLang = localStorage.getItem('language') || 'en';
    applyLanguage(savedLang);
    if (document.hidden) {
        document.title = savedLang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    } else {
        document.title = originalTitle;
    }

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
