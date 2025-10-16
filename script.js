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
        false, true, false, true, true, true, false, false, true, true, false,
    ];
    const mobileLogoSettings = [
        true, true, true, false, true, false,
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

        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        updateLogo();
    }

    function showPrevSlide() {
        if (!slides || slides.length === 0) return;

        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
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

    const contentSections = document.querySelectorAll('.content-section');
    let currentOpenSection = null;

    // FIX: Changed to listen directly on menu links and stop propagation
    document.querySelectorAll('.menu-item a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Stop the click from bubbling to content-section

            const href = this.getAttribute('href');
            if (href === '#about') {
                showContentSection('about');
            } else if (href === '#contact') {
                showContentSection('contact');
            }
        });
    });

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
        setTimeout(() => {
            section.style.display = 'none';
            section.classList.remove('hide', 'crossfade');
            currentOpenSection = null;
        }, 800);
    }

    contentSections.forEach(section => {
        section.addEventListener('click', function(e) {
            // FIX: Also check if clicking on menu items and ignore
            if (e.target.closest('.menu-item')) {
                return;
            }

            if (
                e.target.id === 'emailLink' ||
                e.target.id === 'copyBtn' ||
                e.target.closest('#copyBtn') ||
                e.target.closest('#emailLink')
            ) {
                return;
            }
            hideContentSection(section);
            console.log('Content section closed with animation');
        });
    });

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

    const slideshowContainer = document.querySelector('.slideshow-container');

    slideshowContainer.addEventListener('click', function(e) {
        const ignoreSelectors = [
            '.logo-container',
            '.nav-container',
            '.content-section.show'
        ];
        for (const selector of ignoreSelectors) {
            const el = document.querySelector(selector);
            if (el && el.contains(e.target)) return;
        }
        const x = e.clientX;
        const width = window.innerWidth;
        if (x < width / 2) {
            showPrevSlide();
            startSlideshow();
        } else {
            showNextSlide();
            startSlideshow();
        }
    });

    slideshowContainer.addEventListener('mousemove', function(e) {
        const width = window.innerWidth;
        if (e.clientX < width / 2) {
            slideshowContainer.classList.add('left-cursor');
            slideshowContainer.classList.remove('right-cursor');
        } else {
            slideshowContainer.classList.add('right-cursor');
            slideshowContainer.classList.remove('left-cursor');
        }
    });
    slideshowContainer.addEventListener('mouseleave', function() {
        slideshowContainer.classList.remove('left-cursor', 'right-cursor');
    });
});

console.log('Script loaded');
