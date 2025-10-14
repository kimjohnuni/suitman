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

    // Enhanced content section handling
    const contentSections = document.querySelectorAll('.content-section');
    let currentOpenSection = null;
    let touchHandled = false;

    // Detect if device is mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Handle navigation link clicks
    function handleNavigation(e, sectionId) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        showContentSection(sectionId);
    }

    // Add event listeners to navigation links
    const aboutLink = document.querySelector('a[href="#about"]');
    const contactLink = document.querySelector('a[href="#contact"]');

    if (isMobileDevice) {
        // For mobile: use touchend to prevent ghost clicks
        if (aboutLink) {
            aboutLink.addEventListener('touchend', function(e) {
                touchHandled = true;
                handleNavigation(e, 'about');
                setTimeout(() => { touchHandled = false; }, 300);
            }, { passive: false });
        }
        if (contactLink) {
            contactLink.addEventListener('touchend', function(e) {
                touchHandled = true;
                handleNavigation(e, 'contact');
                setTimeout(() => { touchHandled = false; }, 300);
            }, { passive: false });
        }
    } else {
        // For desktop: use click
        if (aboutLink) {
            aboutLink.addEventListener('click', function(e) {
                handleNavigation(e, 'about');
            });
        }
        if (contactLink) {
            contactLink.addEventListener('click', function(e) {
                handleNavigation(e, 'contact');
            });
        }
    }

    function showContentSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        if (currentOpenSection === section) return;

        if (currentOpenSection && currentOpenSection !== section) {
            crossfadeToSection(currentOpenSection, section);
        } else {
            section.classList.remove('hide', 'crossfade');
            section.style.display = 'block';
            section.offsetHeight;
            section.classList.add('show');
            currentOpenSection = section;
            console.log(sectionId + ' section shown with animation');
        }
    }

    function crossfadeToSection(fromSection, toSection) {
        console.log('Crossfading sections');

        toSection.classList.add('crossfade');
        fromSection.classList.remove('show');
        fromSection.classList.add('hide');

        toSection.classList.remove('hide');
        toSection.style.display = 'block';
        toSection.offsetHeight;
        toSection.classList.add('show');

        setTimeout(() => {
            fromSection.style.display = 'none';
            fromSection.classList.remove('hide');
            currentOpenSection = toSection;
        }, 800);
    }

    function hideContentSection(section) {
        section.classList.remove('show');
        section.classList.add('hide');
        currentOpenSection = null;

        setTimeout(() => {
            section.style.display = 'none';
            section.classList.remove('hide', 'crossfade');
        }, 800);
    }

    // Close on touch/click anywhere in the section EXCEPT email link and copy button
    contentSections.forEach(section => {
        const closeHandler = function(e) {
            // Ignore if touch was already handled by nav link
            if (touchHandled) return;

            // Don't close if clicking email link or copy button
            if (e.target.id === 'emailLink' ||
                e.target.id === 'copyBtn' ||
                e.target.closest('#copyBtn') ||
                e.target.closest('#emailLink')) {
                return;
            }
            hideContentSection(section);
            console.log('Content section closed with animation');
        };

        if (isMobileDevice) {
            section.addEventListener('touchend', closeHandler);
        } else {
            section.addEventListener('click', closeHandler);
        }
    });

    // Copy email functionality
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        const copyHandler = function(e) {
            e.stopPropagation();
            e.preventDefault();
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
        };

        if (isMobileDevice) {
            copyBtn.addEventListener('touchend', copyHandler);
        } else {
            copyBtn.addEventListener('click', copyHandler);
        }
    }
});

console.log('Script loaded');
