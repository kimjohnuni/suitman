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
        } else {
            logoContainer.classList.add('dark-background');
            navContainer.classList.add('dark-background');
        }
    }

    function showNextSlide() {
        if (!slides || slides.length === 0) return;

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
                loadResponsiveImages();
                startSlideshow();
            }
        }, 250);
    });

    // ========== COMPLETELY NEW MOBILE LOGIC ==========
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');
    const aboutLink = document.querySelector('a[href="#about"]');
    const contactLink = document.querySelector('a[href="#contact"]');

    // Initialize data attributes
    aboutSection.setAttribute('data-state', 'closed');
    contactSection.setAttribute('data-state', 'closed');

    // ABOUT LINK
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();

        const currentState = aboutSection.getAttribute('data-state');

        if (currentState === 'closed') {
            // Close contact first if open
            if (contactSection.getAttribute('data-state') === 'open') {
                contactSection.setAttribute('data-state', 'closed');
                contactSection.style.display = 'none';
                contactSection.className = 'content-section';
            }

            // Open about
            aboutSection.setAttribute('data-state', 'open');
            aboutSection.className = 'content-section';
            aboutSection.style.display = 'block';
            setTimeout(() => {
                aboutSection.classList.add('show');
            }, 10);

        } else {
            // Close about
            aboutSection.setAttribute('data-state', 'closed');
            aboutSection.classList.remove('show');
            aboutSection.classList.add('hide');
            setTimeout(() => {
                aboutSection.style.display = 'none';
                aboutSection.className = 'content-section';
            }, 800);
        }
    });

    // CONTACT LINK
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();

        const currentState = contactSection.getAttribute('data-state');

        if (currentState === 'closed') {
            // Close about first if open
            if (aboutSection.getAttribute('data-state') === 'open') {
                aboutSection.setAttribute('data-state', 'closed');
                aboutSection.style.display = 'none';
                aboutSection.className = 'content-section';
            }

            // Open contact
            contactSection.setAttribute('data-state', 'open');
            contactSection.className = 'content-section';
            contactSection.style.display = 'block';
            setTimeout(() => {
                contactSection.classList.add('show');
            }, 10);

        } else {
            // Close contact
            contactSection.setAttribute('data-state', 'closed');
            contactSection.classList.remove('show');
            contactSection.classList.add('hide');
            setTimeout(() => {
                contactSection.style.display = 'none';
                contactSection.className = 'content-section';
            }, 800);
        }
    });

    // CLOSE ON BACKGROUND CLICK - ABOUT
    aboutSection.addEventListener('click', function(e) {
        if (e.target.id === 'emailLink' || e.target.id === 'copyBtn' ||
            e.target.closest('#copyBtn') || e.target.closest('#emailLink') ||
            e.target.classList.contains('scrollable-content') ||
            e.target.closest('.scrollable-content')) {
            return;
        }

        if (aboutSection.getAttribute('data-state') === 'open') {
            aboutSection.setAttribute('data-state', 'closed');
            aboutSection.classList.remove('show');
            aboutSection.classList.add('hide');
            setTimeout(() => {
                aboutSection.style.display = 'none';
                aboutSection.className = 'content-section';
            }, 800);
        }
    });

    // CLOSE ON BACKGROUND CLICK - CONTACT
    contactSection.addEventListener('click', function(e) {
        if (e.target.id === 'emailLink' || e.target.id === 'copyBtn' ||
            e.target.closest('#copyBtn') || e.target.closest('#emailLink') ||
            e.target.classList.contains('scrollable-content') ||
            e.target.closest('.scrollable-content')) {
            return;
        }

        if (contactSection.getAttribute('data-state') === 'open') {
            contactSection.setAttribute('data-state', 'closed');
            contactSection.classList.remove('show');
            contactSection.classList.add('hide');
            setTimeout(() => {
                contactSection.style.display = 'none';
                contactSection.className = 'content-section';
            }, 800);
        }
    });

    // Copy email functionality
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const email = 'info@suitman.org';
            navigator.clipboard.writeText(email).then(() => {
                copyBtn.textContent = '✓';
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
