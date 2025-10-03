document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    const slides = document.querySelectorAll('.slide');
    const logoContainer = document.querySelector('.logo-container');
    const navContainer = document.querySelector('.nav-container');

    console.log('Found slides:', slides.length);
    console.log('Logo container:', !!logoContainer);
    console.log('Nav container:', !!navContainer);

    if (slides.length === 0) {
        console.error('No slides found!');
        return;
    }

    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds

    // Specify which images should use black (true) or white (false) logo
    const useBlackLogo = [
        false, // 01. MYANMAR.jpg - WHITE logo
        true,  // 02. ICELAND.jpg - BLACK logo
        true,  // 03. INDIA.jpg - BLACK logo
        true,  // 04. MONGOLIA.jpg - BLACK logo
        true,  // 05. NEW ZEALAND.jpg - BLACK logo
        true,  // 06. BRAZIL.jpg - BLACK logo
        true,  // 07. JAPAN.jpg - BLACK logo
        false, // 08. TIBET.jpg - WHITE logo
        true,  // 09. USA.jpg - BLACK logo
        true,  // 10. USA.jpg - BLACK logo
        false, // 11. ATHENS.jpg - WHITE logo
        true,  // 12. USA_.jpg - BLACK logo
        false, // ABOUT.jpg - WHITE logo
        true,  // CONTACT.jpg - BLACK logo
    ];

    function updateLogo() {
        if (!logoContainer || !navContainer) {
            console.warn('Logo or nav container missing');
            return;
        }

        logoContainer.classList.remove('bright-background', 'dark-background');
        navContainer.classList.remove('bright-background', 'dark-background');

        if (useBlackLogo[currentSlide]) {
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

    // Make sure first slide is active
    slides[0].classList.add('active');
    console.log('First slide activated');

    // Initialize logo for first slide
    updateLogo();

    // Start the slideshow
    const intervalId = setInterval(showNextSlide, slideInterval);
    console.log('Slideshow started with interval:', intervalId);

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
        // Fade-out duration: must match CSS animation (800ms to match fade-in)
        setTimeout(() => {
            section.style.display = 'none';
            section.classList.remove('hide', 'crossfade');
            currentOpenSection = null;
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
