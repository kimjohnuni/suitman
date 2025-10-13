document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    const logoContainer = document.querySelector('.logo-container');
    const navContainer = document.querySelector('.nav-container');

    let slides;
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds

    // Function to load appropriate images based on screen size
    function loadResponsiveImages() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Load mobile images
            slides = document.querySelectorAll('.mobile-slide');
            slides.forEach(slide => {
                const mobileImg = slide.getAttribute('data-mobile');
                slide.style.backgroundImage = `url('${mobileImg}')`;
            });
        } else {
            // Load desktop images
            slides = document.querySelectorAll('.desktop-slide');
            slides.forEach(slide => {
                const desktopImg = slide.getAttribute('data-desktop');
                slide.style.backgroundImage = `url('${desktopImg}')`;
            });
        }

        console.log('Loaded', slides.length, isMobile ? 'mobile' : 'desktop', 'slides');

        // Reset slideshow
        resetSlideshow();
    }

    // Specify which images should use black (true) or white (false) logo
    // Desktop images logo settings
    const desktopLogoSettings = [
        false, // 01. MYANMAR.jpg - WHITE logo
        true,  // 02. BRAZIL.jpg - BLACK logo
        false, // 03. TIBET.jpg - WHITE logo
        true,  // 04. USA.jpg - BLACK logo
        true,  // 05. USA.jpg - BLACK logo
        true,  // 06. USA_.jpg - BLACK logo
        false, // 07. BEIJING.jpg - WHITE logo
        false, // 08. BUSAN.jpg - WHITE logo
        true,  // 09. FIGURES.jpg - BLACK logo
        true,  // 10. GREECE.jpg - BLACK logo
        false,  //11. HK.jpg - WHITE logo
    ];

    // Mobile images logo settings
    const mobileLogoSettings = [
        true,  // 01. ICELAND.jpg - BLACK logo
        true, // 02. ABOUT_01.jpg - WHITE logo
        true,  // 03. MONGOLIA.jpg - BLACK logo
        false,  // 05. BAHARIYA.jpg - BLACK logo
        true,  // 06. EGYPT.jpg - BLACK logo
        false, // 07. ATHENS.jpg - WHITE logo
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

        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');

        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;

        // Add active class to new slide
        slides[currentSlide].classList.add('active');

        // Update logo
        updateLogo();
    }

    function resetSlideshow() {
        // Remove all active classes
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));

        // Reset to first slide
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

    // Initialize on load
    loadResponsiveImages();
    startSlideshow();

    // Reload images on window resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const newWidth = window.innerWidth;
            const wasMobile = slides && slides[0] && slides[0].classList.contains('mobile-slide');
            const nowMobile = newWidth <= 768;

            // Only reload if we crossed the mobile/desktop threshold
            if (wasMobile !== nowMobile) {
                console.log('Screen size changed, reloading images');
                loadResponsiveImages();
                startSlideshow();
            }
        }, 250);
    });

    // Enhanced content section handling with smooth animations
    const contentSections = document.querySelectorAll('.content-section');
    let currentOpenSection = null;

    // Show content sections with smooth animation
    document.addEventListener('click', function(e) {
        const href = e.target.getAttribute('href');

        if (href === '#about') {
            e.preventDefault();
            showContentSection('about');
        }

        if (href === '#contact') {
            e.preventDefault();
            showContentSection('contact');
        }
    });

    // Function to show content section with animation (or crossfade if another is open)
    function showContentSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // If clicking the same section that's already open, do nothing
        if (currentOpenSection === section) return;

        // If another section is open, crossfade to the new one
        if (currentOpenSection && currentOpenSection !== section) {
            crossfadeToSection(currentOpenSection, section);
        } else {
            // Normal fade in
            section.classList.remove('hide', 'crossfade');
            section.style.display = 'block';
            section.offsetHeight;
            section.classList.add('show');
            currentOpenSection = section;
            console.log(sectionId + ' section shown with animation');
        }
    }

    // Crossfade from one section to another
    function crossfadeToSection(fromSection, toSection) {
        console.log('Crossfading sections');

        // Add crossfade class to bypass animation delays
        toSection.classList.add('crossfade');

        // Start fading out the current section
        fromSection.classList.remove('show');
        fromSection.classList.add('hide');

        // Simultaneously start fading in the new section
        toSection.classList.remove('hide');
        toSection.style.display = 'block';
        toSection.offsetHeight;
        toSection.classList.add('show');

        // After fade completes, clean up the old section
        setTimeout(() => {
            fromSection.style.display = 'none';
            fromSection.classList.remove('hide');
            currentOpenSection = toSection;
        }, 800); // Match fade duration
    }

    // Function to hide content section with fade-out animation
    function hideContentSection(section) {
        section.classList.remove('show');
        section.classList.add('hide');
        currentOpenSection = null; // FIXED: Set to null immediately instead of after timeout
        // Fade-out duration: must match CSS animation (800ms to match fade-in)
        setTimeout(() => {
            section.style.display = 'none';
            section.classList.remove('hide', 'crossfade');
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
            hideContentSection(section);
            console.log('Content section closed with animation');
        });
    });

    // Copy email functionality
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent closing overlay
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
