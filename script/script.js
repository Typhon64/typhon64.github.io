// GSAP Animation for header entrance
// Header'ın yukarıdan yumuşakça içeri girmesini sağlar.
gsap.from('.header', { y: -50, opacity: 0, duration: 1, ease: 'expo.out' });

// Entrance animations for main content sections
// Ana içerik bölümleri için kademeli bir giriş animasyonu oluşturur.
gsap.from(".left-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.2 });
gsap.from(".right-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.4 });
gsap.from(".terminal-container", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.6 });

// Particle.js configuration - Base config (Mobil görünürlük ve opaklık iyileştirildi)
// Particles.js arka plan animasyonu için varsayılan yapılandırmayı tanımlar.
const particleConfigBase = {
    particles: {
        number: { value: 200, density: { enable: true, value_area: 1000 } }, // Parçacık sayısı ve yoğunluk alanı dengelendi
        shape: { type: 'circle' }, // Parçacıkların şekli
        opacity: {
            value: 0.75, // Opaklık artırıldı
            random: true,
            anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false }
        },
        size: { value: 2.5, random: true }, // Boyut biraz büyütüldü
        line_linked: { enable: true, distance: 120, opacity: 0.5, width: 1 }, // Çizgi opaklığı artırıldı
        move: { enable: true, speed: 1.5, direction: 'none', random: true } // Hareket tipi korundu
    },
    interactivity: {
        detect_on: 'window', // Tüm pencerede etkileşimi algıla
        events: {
            onhover: { enable: true, mode: 'grab' }, // Fare üzerine gelme etkileşim modu
            onclick: { enable: true, mode: 'push' }, // Fare tıklaması parçacık oluşturur
            resize: true // Particles.js pencere yeniden boyutlandırmaya tepki vermeli
        },
        modes: {
            grab: { distance: 70, line_linked: { opacity: 0.7 } }, // Grab modu çizgi opaklığı
            push: { particles_nb: 1 } // Tıklamayla oluşturulacak parçacık sayısı
        }
    },
    retina_detect: true, // Yüksek çözünürlüklü ekranlarda kalite için etkinleştirildi
    fps_limit: 30 // Eski cihazlarda daha iyi performans için düşük FPS sınırı
};

let initialWindowArea; // Yeniden boyutlandırma hesaplamaları için başlangıç pencere alanını depolar
let initialParticleCanvasArea; // Yoğunluk ölçeklemesi için başlangıç particles.js canvas alanını depolar

/**
 * Verilen renk ile particles.js örneğini başlatır veya günceller ve ekran boyutuna ve cihaz donanımına
 * göre parçacık sayısını, boyutunu ve çizgi mesafesini dinamik olarak ayarlar. Bu fonksiyon ayrıca canvas'ın
 * fare olaylarını engellememesini ve etkileşim ayarlarını doğru şekilde uygulamasını sağlar.
 * @param {string} particleColor - Parçacıklara uygulanacak renk.
 */
function initializeParticles(particleColor) {
    let pJSInstance;

    // particles.js zaten başlatıldı mı kontrol et
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        pJSInstance = window.pJSDom[0].pJS;
        // Parçacık ve çizgi rengini güncelle
        pJSInstance.particles.color.value = particleColor;
        if (pJSInstance.particles.line_linked) {
            pJSInstance.particles.line_linked.color = particleColor;
        }

        // --- Mevcut örnek için Etkileşim Ayarlarını Güncelle ---
        pJSInstance.interactivity.events.onclick.enable = particleConfigBase.interactivity.events.onclick.enable;
        pJSInstance.interactivity.modes.push.particles_nb = particleConfigBase.interactivity.modes.push.particles_nb;
        pJSInstance.interactivity.events.onhover.enable = particleConfigBase.interactivity.events.onhover.enable;
        pJSInstance.interactivity.modes.grab.distance = particleConfigBase.interactivity.modes.grab.distance;
        pJSInstance.interactivity.modes.grab.line_linked.opacity = particleConfigBase.interactivity.modes.grab.line_linked.opacity;

        // Kullanıcının istediği opaklık artışını burada uygula
        pJSInstance.particles.opacity.value = particleConfigBase.particles.opacity.value;
        if (pJSInstance.particles.line_linked) {
            pJSInstance.particles.line_linked.opacity = particleConfigBase.particles.line_linked.opacity;
        }

        let targetParticleCount = 0;
        let targetParticleSize = particleConfigBase.particles.size.value; // Base config'den alınsın
        let targetLineDistance = particleConfigBase.particles.line_linked.distance; // Base config'den alınsın

        // Ekran boyutuna ve donanıma göre parçacık sayısı, boyutu ve çizgi mesafesini dinamik olarak ayarla
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1920) {
            targetParticleCount = 260; // Üst limit olarak ayarlandı
            targetParticleSize = 2.2;
            targetLineDistance = 120;
        } else if (screenWidth >= 1440) {
            targetParticleCount = 220;
            targetParticleSize = 2.2;
            targetLineDistance = 110;
        } else if (screenWidth >= 1024) {
            targetParticleCount = 180;
            targetParticleSize = 2.0;
            targetLineDistance = 100;
        } else if (screenWidth >= 768) {
            targetParticleCount = 160; // Tabletler için artırıldı
            targetParticleSize = 1.8;
            targetLineDistance = 90;
        } else if (screenWidth >= 480) {
            targetParticleCount = 200; // Büyük mobil cihazlar için artırıldı
            targetParticleSize = 1.8; // Mobil için boyut artırıldı
            targetLineDistance = 80;
        } else if (screenWidth >= 320) {
            targetParticleCount = 180; // Standart mobil cihazlar için artırıldı
            targetParticleSize = 1.5; // Mobil için boyut artırıldı
            targetLineDistance = 70;
        } else { // Çok küçük mobil cihazlar
            targetParticleCount = 150; // En küçük ekranlar için ayarlandı
            targetParticleSize = 1.3; // Mobil için boyut artırıldı
            targetLineDistance = 60;
        }

        // Donanım performansına göre parçacık sayısını ayarla (daha az agresif)
        const cores = navigator.hardwareConcurrency;
        const memory = navigator.deviceMemory;
        if (cores && memory) { // Sadece her iki bilgi de mevcutsa ayarla
            if (cores < 2 && memory < 2) {
                // Çok düşük seviye cihazlar için %40 azaltma
                targetParticleCount = Math.floor(targetParticleCount * 0.6);
            } else if (cores < 4 || memory < 4) {
                // Düşük-orta seviye cihazlar için %20 azaltma
                targetParticleCount = Math.floor(targetParticleCount * 0.8);
            }
        }

        // Parçacık sayısını istenen min (80) ve maks (260) aralığında sınırla
        if (targetParticleCount > 0) {
            targetParticleCount = Math.max(80, Math.min(targetParticleCount, 260));
        }

        // Parçacık sayısı, boyutu veya çizgi mesafesi değiştiyse güncelle
        const numChanged = pJSInstance.particles.number.value !== targetParticleCount;
        const sizeChanged = pJSInstance.particles.size.value !== targetParticleSize;
        const lineDistChanged = pJSInstance.particles.line_linked.distance !== targetLineDistance;

        if (numChanged || sizeChanged || lineDistChanged) {
            pJSInstance.particles.number.value = targetParticleCount;
            pJSInstance.particles.size.value = targetParticleSize;
            pJSInstance.particles.line_linked.distance = targetLineDistance;
            pJSInstance.fn.particlesRefresh(); // Sadece yenileme veya yeniden oluşturma
        } else {
            pJSInstance.fn.particlesRefresh(); // Diğer durumlar için yenileme
        }

        // --- Yakınlaştırma/Yeniden Boyutlandırma için Dinamik Yoğunluk Ayarı ---
        const currentParticleCanvasArea = pJSInstance.canvas.w * pJSInstance.canvas.h;
        if (initialParticleCanvasArea === undefined || initialParticleCanvasArea === 0) {
            initialParticleCanvasArea = currentParticleCanvasArea;
            if (initialParticleCanvasArea === 0) initialParticleCanvasArea = 1; // Sıfıra bölünmeyi önle
        }

        if (currentParticleCanvasArea > 0) {
            const baseDensityArea = particleConfigBase.particles.number.density.value_area;
            let calculatedDensityArea = baseDensityArea * (currentParticleCanvasArea / initialParticleCanvasArea);

            calculatedDensityArea = Math.max(calculatedDensityArea, 200); // Minimum yoğunluk alanı
            calculatedDensityArea = Math.min(calculatedDensityArea, 5000); // Maksimum yoğunluk alanı

            if (pJSInstance.particles.number.density.value_area !== calculatedDensityArea) {
                pJSInstance.particles.number.density.value_area = calculatedDensityArea;
                pJSInstance.fn.particlesRefresh();
            }
        } else {
            pJSInstance.fn.particlesRefresh();
        }
        return;
    }

    // particles.js'in ilk kez başlatılması
    let currentParticleConfig = JSON.parse(JSON.stringify(particleConfigBase));
    currentParticleConfig.particles.color = { value: particleColor };
    currentParticleConfig.particles.line_linked.color = particleColor;

    // Kullanıcının istediği opaklık artışını burada uygula
    currentParticleConfig.particles.opacity.value = particleConfigBase.particles.opacity.value;
    currentParticleConfig.particles.line_linked.opacity = particleConfigBase.particles.line_linked.opacity;

    // İlk yüklemede ekran boyutuna ve donanıma göre başlangıç parçacık sayısı, boyutu ve çizgi mesafesi
    let initialParticleCount = 0;
    let initialParticleSize = particleConfigBase.particles.size.value;
    let initialLineDistance = particleConfigBase.particles.line_linked.distance;

    const screenWidth = window.innerWidth;
    if (screenWidth >= 1920) {
        initialParticleCount = 260; // Üst limit olarak ayarlandı
        initialParticleSize = 2.2;
        initialLineDistance = 120;
    } else if (screenWidth >= 1440) {
        initialParticleCount = 220;
        initialParticleSize = 2.2;
        initialLineDistance = 110;
    } else if (screenWidth >= 1024) {
        initialParticleCount = 180;
        initialParticleSize = 2.0;
        initialLineDistance = 100;
    } else if (screenWidth >= 768) {
        initialParticleCount = 160; // Tabletler için artırıldı
        initialParticleSize = 1.8;
        initialLineDistance = 90;
    } else if (screenWidth >= 480) {
        initialParticleCount = 200; // Büyük mobil cihazlar için artırıldı
        initialParticleSize = 1.8; // Mobil için boyut artırıldı
        initialLineDistance = 80;
    } else if (screenWidth >= 320) {
        initialParticleCount = 180; // Standart mobil cihazlar için artırıldı
        initialParticleSize = 1.5; // Mobil için boyut artırıldı
        initialLineDistance = 70;
    } else { // Çok küçük mobil cihazlar
        initialParticleCount = 150; // En küçük ekranlar için ayarlandı
        initialParticleSize = 1.3; // Mobil için boyut artırıldı
        initialLineDistance = 60;
    }

    // Donanım performansına göre parçacık sayısını ayarla (daha az agresif)
    const cores = navigator.hardwareConcurrency;
    const memory = navigator.deviceMemory;
    if (cores && memory) { // Sadece her iki bilgi de mevcutsa ayarla
        if (cores < 2 && memory < 2) {
            // Çok düşük seviye cihazlar için %40 azaltma
            initialParticleCount = Math.floor(initialParticleCount * 0.6);
        } else if (cores < 4 || memory < 4) {
            // Düşük-orta seviye cihazlar için %20 azaltma
            initialParticleCount = Math.floor(initialParticleCount * 0.8);
        }
    }
    
    // Parçacık sayısını istenen min (80) ve maks (260) aralığında sınırla
    if (initialParticleCount > 0) {
        initialParticleCount = Math.max(80, Math.min(initialParticleCount, 260));
    }

    currentParticleConfig.particles.number.value = initialParticleCount;
    currentParticleConfig.particles.size.value = initialParticleSize;
    currentParticleConfig.particles.line_linked.distance = initialLineDistance;
    currentParticleConfig.particles.number.density.enable = true;

    // particlesJS'i başlat
    particlesJS('particles-js', currentParticleConfig);

    // Başlatmadan sonra, fare etkileşimlerini engellememek için canvas'a pointer-events ve z-index uygula
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        pJSInstance = window.pJSDom[0].pJS;

        // Dinamik yoğunluk hesaplamaları için başlangıç canvas alanını yakala
        if (pJSInstance && initialParticleCanvasArea === undefined) {
            initialParticleCanvasArea = pJSInstance.canvas.w * pJSInstance.canvas.h;
        }

        const particlesJSElement = document.getElementById('particles-js');
        if (particlesJSElement && particlesJSElement.style) {
            particlesJSElement.style.pointerEvents = 'none';
            particlesJSElement.style.zIndex = '-1';
            particlesJSElement.style.position = 'fixed';
            particlesJSElement.style.top = '0';
            particlesJSElement.style.left = '0';
            particlesJSElement.style.width = '100%';
            particlesJSElement.style.height = '100%';
        }
    } else {
        console.error("particles.js başlatılamadı!");
    }
}

// Tema değiştirme mantığı
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

/**
 * Seçilen temayı (açık/koyu) gövdeye uygular ve parçacık renklerini günceller.
 * @param {string} theme - Uygulanacak tema ('light' veya 'dark').
 * @param {boolean} isInitialLoad - Bu ilk sayfa yüklemesi ise true.
 */
function applyTheme(theme, isInitialLoad = false) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        if (themeToggleButton) themeToggleButton.setAttribute('aria-pressed', 'true');
    } else {
        body.classList.remove('light-theme');
        if (themeToggleButton) themeToggleButton.setAttribute('aria-pressed', 'false');
    }
    localStorage.setItem('theme', theme);

    // Particles.js'i temaya uygun renkle yeniden başlat
    setTimeout(() => {
        const particleColor = getComputedStyle(body).getPropertyValue(
            theme === 'light' ? '--particle-color-light' : '--particle-color-dark'
        ).trim().replace(/\'/g, '');
         if (particleColor) {
            initializeParticles(particleColor);
        } else {
            // Varsayılan renkler (resume.js'deki gibi)
            initializeParticles(theme === 'light' ? '#A0522D' : '#c4b5fd');
        }
    }, 50);
}

// Tema değiştirme düğmesi için olay dinleyicisi
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light', false);
    });
}

// Dil değiştirme mantığı
const languageToggleButton = document.getElementById('language-toggle-btn');
const elementsToTranslate = document.querySelectorAll('[data-tr], [data-en]');
const tooltipElements = document.querySelectorAll('[data-tr-tooltip], [data-en-tooltip]');
const pageTitleElement = document.querySelector('title');
let currentDisplayTitle = "";

/**
 * Seçilen dili sayfa içeriğine uygular ve öğeleri günceller.
 * Ayrıca "Typhon64" metnini "Typhon" olarak değiştirir ve tema uyumlu renklendirir.
 * @param {string} lang - Uygulanacak dil ('en' veya 'tr').
 */
function applyLanguage(lang) {
    document.documentElement.lang = lang;

    if (languageToggleButton) {
        languageToggleButton.setAttribute('data-current-lang', lang);
        let textNode = Array.from(languageToggleButton.childNodes)
            .find(node => node.nodeType === Node.TEXT_NODE);

        if (!textNode) {
            const iconElement = languageToggleButton.querySelector('i');
            if (iconElement) {
                textNode = document.createTextNode('');
                iconElement.after(textNode);
            } else {
                textNode = document.createTextNode('');
                languageToggleButton.appendChild(textNode);
            }
        }
        textNode.textContent = lang.toUpperCase();
    }

    elementsToTranslate.forEach(el => {
        const newText = el.getAttribute(`data-${lang}`);
        if (newText !== null) {
            if (el.matches('div.hero-subtext p') || el.matches('.about p') || (el.closest('.card-body') && el.tagName === 'P' && !el.classList.contains('profile-lang'))) {
                 // "Typhon64" metnini "Typhon" olarak değiştir ve tema uyumlu span ekle
                 let processedText = newText;
                 if (processedText.includes('Typhon64')) {
                     processedText = processedText.replace('Typhon64', '<span class="themed-brand-name">Typhon</span>');
                 }
                 el.innerHTML = processedText;
            }
            else if (el.tagName === 'SPAN' || el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'LI' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'P') {
                 if (el.children.length === 0 || !Array.from(el.children).some(child => child.tagName === 'I' || child.tagName === 'SVG' || child.tagName === 'SPAN' || child.tagName === 'BUTTON')) {
                      // "Typhon64" metnini "Typhon" olarak değiştir ve tema uyumlu span ekle (eğer zaten iç HTML yoksa)
                      let processedText = newText;
                      if (processedText.includes('Typhon64')) {
                          processedText = processedText.replace('Typhon64', '<span class="themed-brand-name">Typhon</span>');
                      }
                      el.innerHTML = processedText; // textContent yerine innerHTML kullanıldı, span'in işlenmesi için
                 } else {
                       el.innerHTML = newText;
                 }
            } else {
                el.textContent = newText;
            }
        }
    });

    tooltipElements.forEach(el => {
        const tooltipText = el.getAttribute(`data-${lang}-tooltip`);
        if (tooltipText !== null) {
            el.setAttribute('data-tooltip', tooltipText);
        }
    });

    localStorage.setItem('language', lang);

    if (pageTitleElement) {
        const titleText = pageTitleElement.getAttribute(`data-${lang}`);
        if (titleText) {
            document.title = titleText;
            currentDisplayTitle = titleText;
        } else if (pageTitleElement.getAttribute('data-en')) {
            const fallbackTitle = pageTitleElement.getAttribute('data-en');
            document.title = fallbackTitle;
            currentDisplayTitle = fallbackTitle;
        } else {
            document.title = "Typhon64";
            currentDisplayTitle = "Typhon64";
        }
    }
}

// Dil değiştirme düğmesi için olay dinleyicisi
document.addEventListener('DOMContentLoaded', function() {
    const currentLang = localStorage.getItem('language') || 'en'; // Default olarak 'en' ayarlandı
    applyLanguage(currentLang);

    if (languageToggleButton) {
        languageToggleButton.addEventListener('click', function() {
            const currentLang = localStorage.getItem('language') || 'en';
            const newLang = currentLang === 'en' ? 'tr' : 'en';
            applyLanguage(newLang);
        });
    }
});

// localStorage aracılığıyla diğer sekmelerden/pencelerden dil değişikliklerini dinle
window.addEventListener('storage', function(e) {
    if (e.key === 'language') {
        const newLang = e.newValue || 'en'; // Default olarak 'en' ayarlandı
        applyLanguage(newLang);
    }
});

// Sayfa görünürlüğü değişikliklerini yönet (örn. sekme değiştirme)
document.addEventListener('visibilitychange', () => {
    const currentLang = localStorage.getItem('language') || 'tr';
    if (document.hidden) {
        document.title = currentLang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    } else {
        if (pageTitleElement) {
            const titleText = pageTitleElement.getAttribute(`data-${currentLang}`);
            if (titleText) {
                document.title = titleText;
            } else if (pageTitleElement.getAttribute('data-tr')) {
                 document.title = pageTitleElement.getAttribute('data-tr');
            } else {
                document.title = "Typhon64";
            }
        } else {
             document.title = currentLang === 'tr' ? "Typhon64" : "Typhon64";
        }
    }
});

/**
 * Bir fonksiyonun ne sıklıkta çağrıldığını sınırlamak için debounce fonksiyonu.
 * @param {function} func - Debounce edilecek fonksiyon.
 * @param {number} wait - Beklenecek milisaniye sayısı.
 * @param {boolean} immediate - True ise, fonksiyonu ön kenarda tetikle.
 * @returns {function} - Debounce edilmiş fonksiyon.
 */
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

// Parçacık güncellemelerini optimize etmek için debounce edilmiş yeniden boyutlandırma olay işleyici
const handleResize = debounce(function() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const particleColor = getComputedStyle(body).getPropertyValue(
        currentTheme === 'light' ? '--particle-color-light' : '--particle-color-dark'
    ).trim().replace(/'/g, '');
    initializeParticles(particleColor);
}, 150);

// Yeniden boyutlandırma olay dinleyicisi ekle
window.addEventListener('resize', handleResize);

// DOM hazır olduğunda ana başlatma
document.addEventListener('DOMContentLoaded', () => {
    initialWindowArea = window.innerWidth * window.innerHeight;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme, true);

    // Dilin varsayılan değerini 'en' olarak ayarlıyoruz.
    const savedLang = localStorage.getItem('language') || 'en';
    applyLanguage(savedLang);

    if (document.hidden) {
        const langForOfflineTitle = localStorage.getItem('language') || 'en';
        document.title = langForOfflineTitle === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    }

    // Terminal düğmesi işlevselliği
    const terminalRedBtn = document.getElementById('terminal-btn-red');
    const terminalYellowBtn = document.getElementById('terminal-btn-yellow');
    const terminalGreenBtn = document.getElementById('terminal-btn-green');

    if (terminalRedBtn) {
        terminalRedBtn.addEventListener('click', () => {
            console.log('Kırmızı terminal düğmesine tıklandı! (Kapatma simülasyonu)');
        });
    }
    if (terminalYellowBtn) {
        terminalYellowBtn.addEventListener('click', () => {
            console.log('Sarı terminal düğmesine tıklandı! (Küçültme simülasyonu)');
        });
    }
    if (terminalGreenBtn) {
        terminalGreenBtn.addEventListener('click', () => {
            console.log('Yeşil terminal düğmesine tıklandı! (Tam ekran simülasyonu)');
        });
    }

    // Altbilgideki geçerli yıl bilgisini güncelle
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Oturum Kimliği kopyalama düğmesi işlevselliği
    const sessionCopyBtn = document.querySelector('.session-btn');
    if (sessionCopyBtn) {
        sessionCopyBtn.addEventListener('click', copySessionID);
    }

    /**
     * Önceden tanımlanmış bir oturum kimliğini panoya kopyalar ve bir onay mesajı gösterir.
     */
    function copySessionID() {
        const sessionID = '05e7b2c1d2a3f4e5c6b7a8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9';
        navigator.clipboard.writeText(sessionID).then(function() {
            const el = document.getElementById('session-copied');
            if (el) {
                el.style.display = 'inline';
                setTimeout(() => { el.style.display = 'none'; }, 2000);
            }
        }).catch(function(err) {
            console.error('Oturum Kimliği kopyalanamadı: ', err);
        });
    }

    // Tech items tooltip yönetimi
    const techItems = document.querySelectorAll('.tech-item');
    let activeTooltip = null;
    let touchStartY = 0;

    // Mobil cihaz kontrolü
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };

    techItems.forEach(item => {
        if (isTouchDevice()) {
            // Touch cihazlar için
            item.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            item.addEventListener('touchend', (e) => {
                e.preventDefault();
                const touchEndY = e.changedTouches[0].clientY;
                const touchDiff = Math.abs(touchEndY - touchStartY);
                
                // Eğer scroll hareketi değilse (10px tolerans)
                if (touchDiff < 10) {
                    handleTooltipClick(item);
                }
            });
        } else {
            // Masaüstü cihazlar için
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                handleTooltipClick(item);
            });
        }
    });

    function handleTooltipClick(item) {
        // Eğer başka bir tooltip açıksa onu kapat
        if (activeTooltip && activeTooltip !== item) {
            activeTooltip.classList.remove('tooltip-visible');
        }
        
        // Tıklanan öğenin tooltip'ini aç/kapat
        item.classList.toggle('tooltip-visible');
        activeTooltip = item.classList.contains('tooltip-visible') ? item : null;
    }

    // Sayfa herhangi bir yerine tıklandığında veya dokunulduğunda açık tooltip'i kapat
    const closeTooltip = () => {
        if (activeTooltip) {
            activeTooltip.classList.remove('tooltip-visible');
            activeTooltip = null;
        }
    };

    document.addEventListener('click', closeTooltip);
    document.addEventListener('touchstart', closeTooltip, { passive: true });
});
