document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    const logoContainer = document.querySelector('.logo-container');
    const navContainer = document.querySelector('.nav-container');

    let slides;
    let currentSlide = 0;
    const slideInterval = 6000;

    function loadResponsiveImages() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            slides = document.querySelectorAll('.mobile-slide');
            slides.forEach(slide => {
                const mobileImg = slide.getAttribute('data-mobile');
                slide.style.backgroundImage = `url('${mobileImg}')`;
            });
        } else {
            slides = document.querySelectorAll('.desktop-slide');
            slides.forEach(slide => {
                const desktopImg = slide.getAttribute('data-desktop');
                slide.style.backgroundImage = `url('${desktopImg}')`;
            });
        }

        console.log('Loaded', slides.length, isMobile ? 'mobile' : 'desktop', 'slides');
        resetSlideshow();
    }

    const desktopLogoSettings = [
        false, true, false, true, true, true, false, false, true, true, false
    ];

    const mobileLogoSettings = [
        true, true, true, false, true, false
    ];

    function updateLogo() {
        if (!logoContainer || !navContainer) {
            console.warn('Logo or nav container missing');
            return;
        }

        logoContainer.classList.remove('bright-background', 'dark-background');
        navContainer.classList.remove('bright-background', 'dark-background');

        const isMobile = window.innerWidth <= 768;
        const logoSettings = isMobile ? mobileLogoSettings : desktopLogoSettings;

        if (logoSettings[currentSlide]) {
            logoContainer.classList.add('bright-background');
            navContainer.classList.add('bright-background');
            console.log('Set to bright background (black logo)');
        } else {
            logoContainer.classList.add('dark-background');
            navContainer.classList.add('dark-background');
            console.log('Set to dark background (white logo)');
        }
    }

    function showNextSlide() {
        if (!slides || slides.length === 0) return;

        console.log('Changing slide from', currentSlide, 'to', (currentSlide + 1) % slides.length);

        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        updateLogo();
    }

    function resetSlideshow() {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        currentSlide = 0;
        if (slides && slides.length > 0) {
            slides[0].classList.add('active');
            updateLogo();
        }
    }

    let intervalId;

    function startSlideshow() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(showNextSlide, slideInterval);
        console.log('Slideshow started with interval:', intervalId);
    }

    loadResponsiveImages();
    startSlideshow();

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const newWidth = window.innerWidth;
            const wasMobile = slides && slides[0] && slides[0].classList.contains('mobile-slide');
            const nowMobile = newWidth <= 768;

            if (wasMobile !== nowMobile) {
                console.log('Screen size changed, reloading images');
                loadResponsiveImages();
                startSlideshow();
            }
        }, 250);
    });

    // SIMPLE OVERLAY SYSTEM - NO COMPLEX ANIMATIONS
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');
    const aboutLink = document.querySelector('a[href="#about"]');
    const contactLink = document.querySelector('a[href="#contact"]');

    let isAboutOpen = false;
    let isContactOpen = false;

    // About link click
    if (aboutLink) {
        aboutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isAboutOpen) {
                // Close about
                aboutSection.classList.remove('show');
                aboutSection.classList.add('hide');
                setTimeout(() => {
                    aboutSection.style.display = 'none';
                    aboutSection.classList.remove('hide');
                    isAboutOpen = false;
                }, 800);
            } else {
                // Close contact if open
                if (isContactOpen) {
                    contactSection.style.display = 'none';
                    contactSection.classList.remove('show', 'hide');
                    isContactOpen = false;
                }
                
                // Open about
                aboutSection.style.display = 'none';
                aboutSection.classList.remove('show', 'hide', 'crossfade');
                void aboutSection.offsetHeight;
                aboutSection.style.display = 'block';
                void aboutSection.offsetHeight;
                aboutSection.classList.add('show');
                isAboutOpen = true;
            }
        });
    }

    // Contact link click
    if (contactLink) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isContactOpen) {
                // Close contact
                contactSection.classList.remove('show');
                contactSection.classList.add('hide');
                setTimeout(() => {
                    contactSection.style.display = 'none';
                    contactSection.classList.remove('hide');
                    isContactOpen = false;
                }, 800);
            } else {
                // Close about if open
                if (isAboutOpen) {
                    aboutSection.style.display = 'none';
                    aboutSection.classList.remove('show', 'hide');
                    isAboutOpen = false;
                }
                
                // Open contact
                contactSection.style.display = 'none';
                contactSection.classList.remove('show', 'hide', 'crossfade');
                void contactSection.offsetHeight;
                contactSection.style.display = 'block';
                void contactSection.offsetHeight;
                contactSection.classList.add('show');
                isContactOpen = true;
            }
        });
    }

    // Close about when clicking on it (except links/buttons)
    if (aboutSection) {
        aboutSection.addEventListener('click', function(e) {
            if (e.target.id === 'emailLink' || e.target.id === 'copyBtn' || 
                e.target.closest('#copyBtn') || e.target.closest('#emailLink') ||
                e.target.tagName === 'A') {
                return;
            }
            
            if (isAboutOpen) {
                aboutSection.classList.remove('show');
                aboutSection.classList.add('hide');
                setTimeout(() => {
                    aboutSection.style.display = 'none';
                    aboutSection.classList.remove('hide');
                    isAboutOpen = false;
                }, 800);
            }
        });
    }

    // Close contact when clicking on it (except links/buttons)
    if (contactSection) {
        contactSection.addEventListener('click', function(e) {
            if (e.target.id === 'emailLink' || e.target.id === 'copyBtn' || 
                e.target.closest('#copyBtn') || e.target.closest('#emailLink') ||
                e.target.tagName === 'A') {
                return;
            }
            
            if (isContactOpen) {
                contactSection.classList.remove('show');
                contactSection.classList.add('hide');
                setTimeout(() => {
                    contactSection.style.display = 'none';
                    contactSection.classList.remove('hide');
                    isContactOpen = false;
                }, 800);
            }
        });
    }

    // Copy email functionality
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const email = 'info@suitman.org';
            navigator.clipboard.writeText(email).then(() => {
                copyBtn.textContent = '✓';
                console.log('Email copied to clipboard');
                setTimeout(() => {
                    copyBtn.textContent = '⧉';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }
});

console.log('Script loaded');
