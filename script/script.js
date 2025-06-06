// GSAP Animation for header entrance
gsap.from('.header', { y: -50, opacity: 0, duration: 1, ease: 'expo.out' });

// Entrance animations for main content sections
gsap.from(".left-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.2 });
gsap.from(".right-section", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.4 }); // Re-enabled animation
gsap.from(".terminal-container", { opacity: 0, y: 50, duration: 1.2, ease: "expo.out", delay: 0.6 }); // Re-enabled animation

// Particle.js configuration - Base config
const particleConfigBase = {
    particles: {
        number: { value: 260, density: { enable: true, value_area: 800 } }, // Sabit 260 parçacık (varsayılan hedef)
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
        // updateParticlesDensity(); // Yoğunluk ayarını ekran genişliğine göre aşağıda yapıyoruz.
        
        // Ekran genişliğine göre parçacık sayısını ayarla
        let particleCount = 260; // Varsayılan
        if (window.innerWidth < 768) {
            particleCount = 150; // Orta büyüklükteki ekranlar için
        }
        if (window.innerWidth < 480) {
            particleCount = 80; // Küçük ekranlar için
        }
        // Veya çok küçük/düşük performanslı olduğu düşünülen durumlar için tamamen kapat (opsiyonel)
        // if (window.innerWidth < 320 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)) { particleCount = 0; }

        pJSInstance.particles.number.value = particleCount;
        pJSInstance.fn.particlesEmpty(); // Mevcut parçacıkları temizle
        pJSInstance.fn.particlesCreate(); // Yeni parçacıkları oluştur
        pJSInstance.fn.particlesRefresh(); // Parçacıkları yenile

        return;
    }

    // İlk kez başlatma
    let currentParticleConfig = JSON.parse(JSON.stringify(particleConfigBase));
    currentParticleConfig.particles.color = { value: particleColor };
    currentParticleConfig.particles.line_linked.color = particleColor; 
    
    // Ekran genişliğine göre başlangıç parçacık sayısını ayarla
    let initialParticleCount = 260; // Varsayılan
     if (window.innerWidth < 768) {
        initialParticleCount = 150;
    }
    if (window.innerWidth < 480) {
        initialParticleCount = 80;
    }
    // if (window.innerWidth < 320 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)) { initialParticleCount = 0; }

    currentParticleConfig.particles.number.value = initialParticleCount; // Başlangıç sayısını ayarla
    currentParticleConfig.particles.number.density.enable = true;
    
    particlesJS('particles-js', currentParticleConfig); 

    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        pJSInstance = window.pJSDom[0].pJS;
        
        // İlk canvas alanını yakala (yoğunluk hesaplaması gerekirse)
        if (pJSInstance && initialParticleCanvasArea === undefined) { 
            initialParticleCanvasArea = pJSInstance.canvas.w * pJSInstance.canvas.h;
        }

        // updateParticlesDensity(); // Şu an ekran genişliği bazlı ayarlama yapıyoruz, bu fonksiyona gerek kalmayabilir.

        const particlesJSElement = document.getElementById('particles-js');
        if (particlesJSElement && particlesJSElement.style) {
            particlesJSElement.style.pointerEvents = 'none'; // Fare olaylarını engelle
        }
    } else {
        console.error("particles.js başlatılamadı!");
    }
}

// updateParticlesDensity fonksiyonunu basitleştir veya kaldır (şu an için ekran genişliğine göre ayarlıyoruz)
// Eğer canvas yeniden boyutlandığında parçacık yoğunluğunun korunması isteniyorsa revize edilebilir.
// Mevcut haliyle initializeParticles ekran genişliğine göre parçacık sayısını belirliyor.
function updateParticlesDensity() {
     if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const pJS = window.pJSDom[0].pJS;
        
        // Ekran genişliğine göre hedef parçacık sayısını belirle
        let targetParticleCount = 260;
        if (window.innerWidth < 768) {
            targetParticleCount = 150;
        }
        if (window.innerWidth < 480) {
            targetParticleCount = 80;
        }
         // if (window.innerWidth < 320 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)) { targetParticleCount = 0; }

        // Sadece hedef parçacık sayısı değişirse güncelleme yap
        if (pJS.particles.number.value !== targetParticleCount) {
             pJS.particles.number.value = targetParticleCount;
             // Yoğunluk alanını yeniden hesaplamaya gerek yok, particles.js bunu otomatik olarak ayarlar
             // when number.value changes and density.enable is true.
             pJS.fn.particlesEmpty();
             pJS.fn.particlesCreate();
             pJS.fn.particlesRefresh();
        }
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

    // Tema değiştiğinde parçacık rengini güncelle
    // CSS değişkenlerinin uygulanması için kısa bir gecikme ekleyelim
    setTimeout(() => {
        const particleColor = getComputedStyle(body).getPropertyValue(
            theme === 'light' ? '--particle-color-light' : '--particle-color-dark'
        ).trim().replace(/\'/g, '');
         if (particleColor) {
            initializeParticles(particleColor); // Rengi günceller ve yoğunluğu ekran genişliğine göre ayarlar
        } else {
            // Fallback renk
            initializeParticles(theme === 'light' ? '#A0522D' : '#c4b5fd'); 
        }
    }, 50); // 50ms gecikme
}

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light', false);
    });
}

// Dil değiştirme
const languageToggleButton = document.getElementById('language-toggle-btn');
const elementsToTranslate = document.querySelectorAll('[data-tr], [data-en]');
const tooltipElements = document.querySelectorAll('[data-tr-tooltip], [data-en-tooltip]');
const pageTitleElement = document.querySelector('title');
let currentDisplayTitle = "";

// Dil ayarlarını uygula
function applyLanguage(lang) {
    // Dil değerini HTML elementine ayarla
    document.documentElement.lang = lang;
    
    // Dil butonunun data-current-lang özelliğini güncelle
    if (languageToggleButton) {
        languageToggleButton.setAttribute('data-current-lang', lang);
    }

    // Dil butonunun içindeki metni güncelle (ikon hariç)
     if (languageToggleButton) {
        // Create or find the text node for the language
        let textNode = Array.from(languageToggleButton.childNodes)
            .find(node => node.nodeType === Node.TEXT_NODE);
        
        // If no text node exists, create one
        if (!textNode) {
            // First, find the icon element
            const iconElement = languageToggleButton.querySelector('i');
            if (iconElement) {
                // Create text node and insert it after the icon
                textNode = document.createTextNode('');
                iconElement.after(textNode);
            } else {
                // If no icon, append to button
                textNode = document.createTextNode('');
                languageToggleButton.appendChild(textNode);
            }
        }
        
        // Update the text content
        textNode.textContent = lang.toUpperCase();
    }

    elementsToTranslate.forEach(el => {
        const newText = el.getAttribute(`data-${lang}`);
        if (newText !== null) {
            // İç HTML yapısını korumak istediğimiz belirli paragraflar
            if (el.matches('div.hero-subtext p') || el.matches('.about p') || (el.closest('.card-body') && el.tagName === 'P' && !el.classList.contains('profile-lang'))) {
                 el.innerHTML = newText;
            } 
             // İkon gibi elementler içerebilen belirli etiketler
            else if (el.tagName === 'SPAN' || el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'LI' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'P') {
                 // Text içeriğini güncellemeye çalış, HTML elementlerini koruyarak
                 let targetNode = el;
                 // Eğer içinde sadece ikon veya başka bir element varsa ve metin direct child değilse,
                 // tüm innerHTML'i değiştirmekten kaçınmak lazım. Ancak data-* niteliklerimiz düz metin içeriyor.
                 // Bu durumda textContent daha güvenli.
                 if (el.children.length === 0 || !Array.from(el.children).some(child => child.tagName === 'I' || child.tagName === 'SVG' || child.tagName === 'SPAN' || child.tagName === 'BUTTON')) {
                      // Eğer içinde ikon veya özel yapı yoksa, textContent kullan
                      el.textContent = newText;
                 } else {
                      // Eğer içinde ikon veya özel yapı varsa, translatable metin için belirli bir span kullanmak daha iyi olurdu.
                      // Şu anki yapıda, data niteliği tüm elementin metnini içeriyorsa ve içinde ikon varsa,
                      // innerHTML kullanmak ikonu korur ama dikkatli olmak gerekir.
                      // Mevcut element yapısı basit görünüyor, innerHTML burada ikonu koruyacaktır.
                       el.innerHTML = newText; // İkonları korumak için (eğer data niteliği ikonu içermiyorsa)
                 }

            } else {
                // Diğer tüm elementler için textContent kullan, en güvenli yöntem
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

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function() {
    // Her zaman İngilizce ile başla
    applyLanguage('en');
    
    // Dil değiştirme butonuna tıklama olayı ekle
    if (languageToggleButton) {
        languageToggleButton.addEventListener('click', function() {
            // Mevcut dili kontrol et
            const currentLang = this.getAttribute('data-current-lang') || 'en';
            // Dili değiştir
            const newLang = currentLang === 'en' ? 'tr' : 'en';
            applyLanguage(newLang);
        });
    }
});

document.addEventListener('visibilitychange', () => {
    const currentLang = localStorage.getItem('language') || 'tr'; // Default to tr
    if (document.hidden) {
        document.title = currentLang === 'tr' ? 'Sistem Çevrimdışı!' : 'System Offline!';
    } else {
        // Restore to the correctly translated title for the current language
        if (pageTitleElement) {
            const titleText = pageTitleElement.getAttribute(`data-${currentLang}`);
            if (titleText) {
                document.title = titleText;
            } else if (pageTitleElement.getAttribute('data-tr')) { // Fallback to Turkish title
                 document.title = pageTitleElement.getAttribute('data-tr');
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
    if (initialWindowArea !== undefined) { // Sadece ilk yüklemeden sonra çalıştır
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const particleColor = getComputedStyle(body).getPropertyValue(
            currentTheme === 'light' ? '--particle-color-light' : '--particle-color-dark'
        ).trim().replace(/\'/g, '');
        // Sadece rengi güncellemek yeterli, initializeParticles artık yoğunluğu da ayarlıyor.
        // initializeParticles(particleColor); // Bu satırın kendisi artık yoğunluğu ayarlar

        // Ya da sadece updateParticlesDensity çağırarak yoğunluğu ayarlayabiliriz
        updateParticlesDensity(); // Ekran genişliğine göre parçacık sayısını ayarlar
    }
}, 150); // Optimize edilmiş debounce süresi

window.addEventListener('resize', handleResize);

// İlk yükleme ayarları
document.addEventListener('DOMContentLoaded', () => {
    initialWindowArea = window.innerWidth * window.innerHeight;
    
    // Set body class for theme BEFORE getting particle color
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme, true); // Apply theme and update body class. This will init particles.

    // Apply language. This will also set the document.title correctly.
    const savedLang = localStorage.getItem('language') || 'tr'; // Default to tr
    applyLanguage(savedLang); // This now sets currentDisplayTitle

    // Initialize particles AFTER theme and language (mainly for particle color from CSS vars)
    // applyTheme already calls initializeParticles, so no need to call again here on DOMContentLoaded
    // The call in applyTheme includes the initialLoad flag logic.

    if (initialParticleCanvasArea === undefined && window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        const pJS = window.pJSDom[0].pJS;
        initialParticleCanvasArea = pJS.canvas.w * pJS.canvas.h;
    }
    
    // Visibility change already sets title based on currentDisplayTitle (implicitly via applyLanguage)
    // or specific offline messages. Initial title is set by applyLanguage.
    if (document.hidden) { // Re-check immediately after load for initial state
        const langForOfflineTitle = localStorage.getItem('language') || 'tr'; // Default to tr
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

    // Footer'daki yıl bilgisini güncelle (eğer elementi varsa)
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Session ID kopyalama butonu için olay dinleyicisi (varsa)
    const sessionCopyBtn = document.querySelector('.session-btn');
    if (sessionCopyBtn) {
        sessionCopyBtn.addEventListener('click', copySessionID);
    }

    // copySessionID fonksiyonu (daha önce script tag içinde tanımlanmıştı, buraya taşıdım)
    function copySessionID() {
        const sessionID = '05e7b2c1d2a3f4e5c6b7a8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9'; // Your Session ID here
        navigator.clipboard.writeText(sessionID).then(function() {
            const el = document.getElementById('session-copied');
            if (el) {
                el.style.display = 'inline';
                setTimeout(() => { el.style.display = 'none'; }, 2000);
            }
        }).catch(function(err) {
            console.error('Could not copy Session ID: ', err);
        });
    }
});
