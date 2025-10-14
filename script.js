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

    // Content section handling - SIMPLIFIED APPROACH
    const contentSections = document.querySelectorAll('.content-section');
    let currentOpenSection = null;

    // Show content sections with smooth animation
    document.addEventListener('click', function(e) {
        const href = e.target.getAttribute('href');

        if (href === '#about') {
            e.preventDefault();
            e.stopPropagation();
            toggleContentSection('about');
        }

        if (href === '#contact') {
            e.preventDefault();
            e.stopPropagation();
            toggleContentSection('contact');
        }
    });

    // Single toggle function that handles both open and close
    function toggleContentSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // If this section is currently open, close it
        if (currentOpenSection === section) {
            closeContentSection(section);
            return;
        }

        // If another section is open, close it first
        if (currentOpenSection && currentOpenSection !== section) {
            closeContentSection(currentOpenSection);
        }

        // Open the new section
        openContentSection(section);
    }

    function openContentSection(section) {
        // Force complete reset of all animation states
        section.style.display = 'none';
        section.classList.remove('show', 'hide', 'crossfade');
        section.offsetHeight; // Force reflow

        // Now show it
        section.style.display = 'block';
        section.offsetHeight; // Force reflow
        section.classList.add('show');
        currentOpenSection = section;
        console.log(section.id + ' section opened');
    }

    function closeContentSection(section) {
        section.classList.remove('show');
        section.classList.add('hide');

        setTimeout(() => {
            section.style.display = 'none';
            section.classList.remove('hide', 'crossfade');
            if (currentOpenSection === section) {
                currentOpenSection = null;
            }
            console.log(section.id + ' section closed');
        }, 800);
    }

    // Close on click anywhere in the section EXCEPT email link and copy button
    contentSections.forEach(section => {
        section.addEventListener('click', function(e) {
            // Don't close if clicking email link or copy button
            if (e.target.id === 'emailLink' ||
                e.target.id === 'copyBtn' ||
                e.target.closest('#copyBtn') ||
                e.target.closest('#emailLink')) {
                return;
            }

            // Only close if this section is actually the current open one
            if (currentOpenSection === section) {
                closeContentSection(section);
            }
        });
    });

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
