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

    // ========== COMPLETELY NEW APPROACH ==========
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');
    const aboutLink = document.querySelector('a[href="#about"]');
    const contactLink = document.querySelector('a[href="#contact"]');

    let currentSection = null;
    let canClick = true;

    // ABOUT LINK - using mousedown/touchstart instead of click
    aboutLink.addEventListener('mousedown', handleAboutClick);
    aboutLink.addEventListener('touchstart', handleAboutClick);

    function handleAboutClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!canClick) return;
        canClick = false;

        if (currentSection === 'about') {
            // Close about
            closeSection(aboutSection);
            currentSection = null;
            setTimeout(() => { canClick = true; }, 1000);
        } else if (currentSection === 'contact') {
            // Crossfade from contact to about
            crossfade(contactSection, aboutSection);
            currentSection = 'about';
            setTimeout(() => { canClick = true; }, 1000);
        } else {
            // Open about
            openSection(aboutSection);
            currentSection = 'about';
            setTimeout(() => { canClick = true; }, 1000);
        }
    }

    // CONTACT LINK - using mousedown/touchstart instead of click
    contactLink.addEventListener('mousedown', handleContactClick);
    contactLink.addEventListener('touchstart', handleContactClick);

    function handleContactClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!canClick) return;
        canClick = false;

        if (currentSection === 'contact') {
            // Close contact
            closeSection(contactSection);
            currentSection = null;
            setTimeout(() => { canClick = true; }, 1000);
        } else if (currentSection === 'about') {
            // Crossfade from about to contact
            crossfade(aboutSection, contactSection);
            currentSection = 'contact';
            setTimeout(() => { canClick = true; }, 1000);
        } else {
            // Open contact
            openSection(contactSection);
            currentSection = 'contact';
            setTimeout(() => { canClick = true; }, 1000);
        }
    }

    function openSection(section) {
        section.style.display = 'none';
        section.className = 'content-section';
        section.offsetHeight;
        section.style.display = 'block';
        section.offsetHeight;
        section.classList.add('show');
    }

    function closeSection(section) {
        section.classList.remove('show');
        section.classList.add('hide');
        setTimeout(() => {
            section.style.display = 'none';
            section.className = 'content-section';
        }, 800);
    }

    function crossfade(fromSection, toSection) {
        fromSection.classList.remove('show');
        fromSection.classList.add('hide');

        toSection.className = 'content-section crossfade';
        toSection.style.display = 'block';
        toSection.offsetHeight;
        toSection.classList.add('show');

        setTimeout(() => {
            fromSection.style.display = 'none';
            fromSection.className = 'content-section';
        }, 800);
    }

    // CLOSE ON BACKGROUND CLICK - About
    aboutSection.addEventListener('click', function(e) {
        if (e.target.id === 'emailLink' || e.target.id === 'copyBtn' ||
            e.target.closest('#copyBtn') || e.target.closest('#emailLink')) {
            return;
        }

        if (!canClick) return;

        if (currentSection === 'about') {
            canClick = false;
            closeSection(aboutSection);
            currentSection = null;
            setTimeout(() => { canClick = true; }, 1000);
        }
    });

    // CLOSE ON BACKGROUND CLICK - Contact
    contactSection.addEventListener('click', function(e) {
        if (e.target.id === 'emailLink' || e.target.id === 'copyBtn' ||
            e.target.closest('#copyBtn') || e.target.closest('#emailLink')) {
            return;
        }

        if (!canClick) return;

        if (currentSection === 'contact') {
            canClick = false;
            closeSection(contactSection);
            currentSection = null;
            setTimeout(() => { canClick = true; }, 1000);
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
