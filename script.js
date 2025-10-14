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

    // ========== CONTENT SECTIONS WITH CROSSFADE ==========
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');
    const aboutLink = document.querySelector('a[href="#about"]');
    const contactLink = document.querySelector('a[href="#contact"]');

    // Initialize data attributes
    aboutSection.setAttribute('data-state', 'closed');
    contactSection.setAttribute('data-state', 'closed');

    // Prevent rapid clicking
    let isTransitioning = false;

    // ABOUT LINK
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (isTransitioning) return;

        const aboutState = aboutSection.getAttribute('data-state');
        const contactState = contactSection.getAttribute('data-state');

        if (aboutState === 'closed') {
            isTransitioning = true;

            // Check if contact is open for crossfade
            if (contactState === 'open') {
                // CROSSFADE: Contact to About
                contactSection.setAttribute('data-state', 'closed');
                contactSection.classList.remove('show');
                contactSection.classList.add('hide');

                // Open about immediately (crossfade effect)
                aboutSection.setAttribute('data-state', 'open');
                aboutSection.className = 'content-section crossfade';
                aboutSection.style.display = 'block';
                setTimeout(() => {
                    aboutSection.classList.add('show');
                }, 10);

                // Clean up contact after transition
                setTimeout(() => {
                    contactSection.style.display = 'none';
                    contactSection.className = 'content-section';
                    isTransitioning = false;
                }, 800);
            } else {
                // Normal open
                aboutSection.setAttribute('data-state', 'open');
                aboutSection.className = 'content-section';
                aboutSection.style.display = 'block';
                setTimeout(() => {
                    aboutSection.classList.add('show');
                    isTransitioning = false;
                }, 10);
            }
        } else {
            // Close about
            isTransitioning = true;
            aboutSection.setAttribute('data-state', 'closed');
            aboutSection.classList.remove('show');
            aboutSection.classList.add('hide');
            setTimeout(() => {
                aboutSection.style.display = 'none';
                aboutSection.className = 'content-section';
                isTransitioning = false;
            }, 800);
        }
    });

    // CONTACT LINK
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (isTransitioning) return;

        const aboutState = aboutSection.getAttribute('data-state');
        const contactState = contactSection.getAttribute('data-state');

        if (contactState === 'closed') {
            isTransitioning = true;

            // Check if about is open for crossfade
            if (aboutState === 'open') {
                // CROSSFADE: About to Contact
                aboutSection.setAttribute('data-state', 'closed');
                aboutSection.classList.remove('show');
                aboutSection.classList.add('hide');

                // Open contact immediately (crossfade effect)
                contactSection.setAttribute('data-state', 'open');
                contactSection.className = 'content-section crossfade';
                contactSection.style.display = 'block';
                setTimeout(() => {
                    contactSection.classList.add('show');
                }, 10);

                // Clean up about after transition
                setTimeout(() => {
                    aboutSection.style.display = 'none';
                    aboutSection.className = 'content-section';
                    isTransitioning = false;
                }, 800);
            } else {
                // Normal open
                contactSection.setAttribute('data-state', 'open');
                contactSection.className = 'content-section';
                contactSection.style.display = 'block';
                setTimeout(() => {
                    contactSection.classList.add('show');
                    isTransitioning = false;
                }, 10);
            }
        } else {
            // Close contact
            isTransitioning = true;
            contactSection.setAttribute('data-state', 'closed');
            contactSection.classList.remove('show');
            contactSection.classList.add('hide');
            setTimeout(() => {
                contactSection.style.display = 'none';
                contactSection.className = 'content-section';
                isTransitioning = false;
            }, 800);
        }
    });

    // CLOSE ON CLICK - ABOUT
    aboutSection.addEventListener('click', function(e) {
        // Don't close if clicking on email link or copy button
        if (e.target.id === 'emailLink' || e.target.id === 'copyBtn' ||
            e.target.closest('#copyBtn') || e.target.closest('#emailLink')) {
            return;
        }

        if (isTransitioning) return;

        if (aboutSection.getAttribute('data-state') === 'open') {
            isTransitioning = true;
            aboutSection.setAttribute('data-state', 'closed');
            aboutSection.classList.remove('show');
            aboutSection.classList.add('hide');

            // Block link clicks during fade out
            aboutLink.style.pointerEvents = 'none';

            setTimeout(() => {
                aboutSection.style.display = 'none';
                aboutSection.className = 'content-section';
                isTransitioning = false;
                aboutLink.style.pointerEvents = 'auto';
            }, 900); // Slightly longer than animation to be safe
        }
    });

    // CLOSE ON CLICK - CONTACT
    contactSection.addEventListener('click', function(e) {
        // Don't close if clicking on email link or copy button
        if (e.target.id === 'emailLink' || e.target.id === 'copyBtn' ||
            e.target.closest('#copyBtn') || e.target.closest('#emailLink')) {
            return;
        }

        if (isTransitioning) return;

        if (contactSection.getAttribute('data-state') === 'open') {
            isTransitioning = true;
            contactSection.setAttribute('data-state', 'closed');
            contactSection.classList.remove('show');
            contactSection.classList.add('hide');

            // Block link clicks during fade out
            contactLink.style.pointerEvents = 'none';

            setTimeout(() => {
                contactSection.style.display = 'none';
                contactSection.className = 'content-section';
                isTransitioning = false;
                contactLink.style.pointerEvents = 'auto';
            }, 900); // Slightly longer than animation to be safe
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
