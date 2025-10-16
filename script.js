// Detect device type FIRST
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// Add class to body to show correct version
document.body.classList.add(isMobileDevice ? 'is-mobile' : 'is-desktop');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Device type:', isMobileDevice ? 'Mobile' : 'Desktop');

    if (isMobileDevice) {
        initMobile();
    } else {
        initDesktop();
    }
});

// ========== DESKTOP INITIALIZATION ==========
function initDesktop() {
    console.log('Initializing desktop version');

    const logoContainer = document.querySelector('#desktop-version .logo-container');
    const navContainer = document.querySelector('#desktop-version .nav-container');
    const slideshowContainer = document.querySelector('#desktop-version .slideshow-container');
    const slides = document.querySelectorAll('.desktop-slide');

    let currentSlide = 0;
    const slideInterval = 6000;

    const logoSettings = [
        false, true, false, true, true, true, false, false, true, true, false
    ];

    // Load images
    slides.forEach(slide => {
        const img = slide.getAttribute('data-desktop');
        slide.style.backgroundImage = `url('${img}')`;
    });

    function updateLogo() {
        logoContainer.classList.remove('bright-background', 'dark-background');
        navContainer.classList.remove('bright-background', 'dark-background');

        if (logoSettings[currentSlide]) {
            logoContainer.classList.add('bright-background');
            navContainer.classList.add('bright-background');
        } else {
            logoContainer.classList.add('dark-background');
            navContainer.classList.add('dark-background');
        }
    }

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        updateLogo();
    }

    function showNextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function showPrevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    // Start slideshow
    slides[0].classList.add('active');
    updateLogo();
    let intervalId = setInterval(showNextSlide, slideInterval);

    // Left/Right click navigation
    slideshowContainer.addEventListener('mousemove', function(e) {
        const containerWidth = slideshowContainer.offsetWidth;
        const clickX = e.clientX;

        if (clickX < containerWidth / 2) {
            slideshowContainer.classList.remove('right-cursor');
            slideshowContainer.classList.add('left-cursor');
        } else {
            slideshowContainer.classList.remove('left-cursor');
            slideshowContainer.classList.add('right-cursor');
        }
    });

    slideshowContainer.addEventListener('click', function(e) {
        const containerWidth = slideshowContainer.offsetWidth;
        const clickX = e.clientX;

        // Reset interval
        clearInterval(intervalId);
        intervalId = setInterval(showNextSlide, slideInterval);

        if (clickX < containerWidth / 2) {
            showPrevSlide();
        } else {
            showNextSlide();
        }
    });

    // Section handling
    const aboutSection = document.getElementById('about-desktop');
    const contactSection = document.getElementById('contact-desktop');
    const aboutLink = document.querySelector('.desktop-link[href="#about"]');
    const contactLink = document.querySelector('.desktop-link[href="#contact"]');

    aboutSection.setAttribute('data-state', 'closed');
    contactSection.setAttribute('data-state', 'closed');

    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();

        const aboutState = aboutSection.getAttribute('data-state');
        const contactState = contactSection.getAttribute('data-state');

        if (aboutState === 'closed') {
            if (contactState === 'open') {
                // Crossfade
                contactSection.setAttribute('data-state', 'closed');
                contactSection.classList.remove('show');
                contactSection.classList.add('hide');

                aboutSection.setAttribute('data-state', 'open');
                aboutSection.className = 'content-section crossfade';
                aboutSection.style.display = 'block';
                setTimeout(() => aboutSection.classList.add('show'), 10);

                setTimeout(() => {
                    contactSection.style.display = 'none';
                    contactSection.className = 'content-section';
                }, 800);
            } else {
                // Open
                aboutSection.setAttribute('data-state', 'open');
                aboutSection.className = 'content-section';
                aboutSection.style.display = 'block';
                setTimeout(() => aboutSection.classList.add('show'), 10);
            }
        } else {
            // Close
            aboutSection.setAttribute('data-state', 'closed');
            aboutSection.classList.remove('show');
            aboutSection.classList.add('hide');
            setTimeout(() => {
                aboutSection.style.display = 'none';
                aboutSection.className = 'content-section';
            }, 800);
        }
    });

    contactLink.addEventListener('click', function(e) {
        e.preventDefault();

        const aboutState = aboutSection.getAttribute('data-state');
        const contactState = contactSection.getAttribute('data-state');

        if (contactState === 'closed') {
            if (aboutState === 'open') {
                // Crossfade
                aboutSection.setAttribute('data-state', 'closed');
                aboutSection.classList.remove('show');
                aboutSection.classList.add('hide');

                contactSection.setAttribute('data-state', 'open');
                contactSection.className = 'content-section crossfade';
                contactSection.style.display = 'block';
                setTimeout(() => contactSection.classList.add('show'), 10);

                setTimeout(() => {
                    aboutSection.style.display = 'none';
                    aboutSection.className = 'content-section';
                }, 800);
            } else {
                // Open
                contactSection.setAttribute('data-state', 'open');
                contactSection.className = 'content-section';
                contactSection.style.display = 'block';
                setTimeout(() => contactSection.classList.add('show'), 10);
            }
        } else {
            // Close
            contactSection.setAttribute('data-state', 'closed');
            contactSection.classList.remove('show');
            contactSection.classList.add('hide');
            setTimeout(() => {
                contactSection.style.display = 'none';
                contactSection.className = 'content-section';
            }, 800);
        }
    });

    // Close on click anywhere in section (including text)
    aboutSection.addEventListener('click', function(e) {
        // Don't close if clicking email link or copy button
        if (e.target.id === 'emailLink-desktop' ||
            e.target.id === 'copyBtn-desktop' ||
            e.target.closest('#copyBtn-desktop') ||
            e.target.closest('#emailLink-desktop')) {
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

    contactSection.addEventListener('click', function(e) {
        // Don't close if clicking email link or copy button
        if (e.target.id === 'emailLink-desktop' ||
            e.target.id === 'copyBtn-desktop' ||
            e.target.closest('#copyBtn-desktop') ||
            e.target.closest('#emailLink-desktop')) {
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

    // Copy email
    const copyBtn = document.getElementById('copyBtn-desktop');
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const email = 'info@suitman.org';
            navigator.clipboard.writeText(email).then(() => {
                copyBtn.textContent = '✓';
                setTimeout(() => copyBtn.textContent = '⧉', 2000);
            });
        });
    }
}

// ========== MOBILE INITIALIZATION ==========
function initMobile() {
    console.log('Initializing mobile version');

    const logoContainer = document.querySelector('#mobile-version .logo-container');
    const navContainer = document.querySelector('#mobile-version .nav-container');
    const slides = document.querySelectorAll('.mobile-slide');

    let currentSlide = 0;
    const slideInterval = 6000;

    const logoSettings = [
        true, true, true, false, true, false
    ];

    // Load images
    slides.forEach(slide => {
        const img = slide.getAttribute('data-mobile');
        slide.style.backgroundImage = `url('${img}')`;
    });

    function updateLogo() {
        logoContainer.classList.remove('bright-background', 'dark-background');
        navContainer.classList.remove('bright-background', 'dark-background');

        if (logoSettings[currentSlide]) {
            logoContainer.classList.add('bright-background');
            navContainer.classList.add('bright-background');
        } else {
            logoContainer.classList.add('dark-background');
            navContainer.classList.add('dark-background');
        }
    }

    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        updateLogo();
    }

    // Start slideshow - AUTO ONLY
    slides[0].classList.add('active');
    updateLogo();
    setInterval(showNextSlide, slideInterval);

    // Section handling
    const aboutSection = document.getElementById('about-mobile');
    const contactSection = document.getElementById('contact-mobile');
    const aboutLink = document.querySelector('.mobile-link[href="#about"]');
    const contactLink = document.querySelector('.mobile-link[href="#contact"]');

    let aboutOpen = false;
    let contactOpen = false;
    let lastInteractionTime = 0; // Prevent rapid-fire clicks
    let aboutCloseTimeout = null;
    let contactCloseTimeout = null;

    function openAbout() {
        console.log('Opening about');
        if (aboutCloseTimeout) {
            clearTimeout(aboutCloseTimeout);
            aboutCloseTimeout = null;
        }

        if (contactOpen) {
            if (contactCloseTimeout) clearTimeout(contactCloseTimeout);
            contactSection.style.display = 'none';
            contactSection.className = 'content-section';
            contactOpen = false;
        }

        aboutSection.style.display = 'block';
        aboutSection.className = 'content-section';
        void aboutSection.offsetHeight;
        aboutSection.classList.add('show');
        aboutOpen = true;
    }

    function closeAbout() {
        console.log('Closing about');
        if (aboutCloseTimeout) {
            clearTimeout(aboutCloseTimeout);
        }

        aboutSection.classList.remove('show');
        aboutSection.classList.add('hide');
        aboutOpen = false;

        aboutCloseTimeout = setTimeout(() => {
            aboutSection.style.display = 'none';
            aboutSection.className = 'content-section';
            aboutCloseTimeout = null;
        }, 850);
    }

    function openContact() {
        console.log('Opening contact');
        if (contactCloseTimeout) {
            clearTimeout(contactCloseTimeout);
            contactCloseTimeout = null;
        }

        if (aboutOpen) {
            if (aboutCloseTimeout) clearTimeout(aboutCloseTimeout);
            aboutSection.style.display = 'none';
            aboutSection.className = 'content-section';
            aboutOpen = false;
        }

        contactSection.style.display = 'block';
        contactSection.className = 'content-section';
        void contactSection.offsetHeight;
        contactSection.classList.add('show');
        contactOpen = true;
    }

    function closeContact() {
        console.log('Closing contact');
        if (contactCloseTimeout) {
            clearTimeout(contactCloseTimeout);
        }

        contactSection.classList.remove('show');
        contactSection.classList.add('hide');
        contactOpen = false;

        contactCloseTimeout = setTimeout(() => {
            contactSection.style.display = 'none';
            contactSection.className = 'content-section';
            contactCloseTimeout = null;
        }, 850);
    }

    // USE CLICK EVENTS - more reliable on iOS
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('About link clicked, aboutOpen:', aboutOpen);

        // Debounce rapid clicks
        const now = Date.now();
        if (now - lastInteractionTime < 400) {
            console.log('Too soon, ignoring');
            return;
        }
        lastInteractionTime = now;

        if (aboutOpen) {
            closeAbout();
        } else {
            openAbout();
        }
    });

    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Contact link clicked, contactOpen:', contactOpen);

        // Debounce rapid clicks
        const now = Date.now();
        if (now - lastInteractionTime < 400) {
            console.log('Too soon, ignoring');
            return;
        }
        lastInteractionTime = now;

        if (contactOpen) {
            closeContact();
        } else {
            openContact();
        }
    });

    // Section click to close
    aboutSection.addEventListener('click', function(e) {
        // Don't close if clicking on interactive elements
        if (e.target.id === 'emailLink-mobile' ||
            e.target.id === 'copyBtn-mobile' ||
            e.target.closest('#copyBtn-mobile') ||
            e.target.closest('#emailLink-mobile') ||
            e.target.closest('.mobile-link')) {
            return;
        }

        // Debounce
        const now = Date.now();
        if (now - lastInteractionTime < 400) {
            return;
        }
        lastInteractionTime = now;

        if (aboutOpen) {
            closeAbout();
        }
    });

    contactSection.addEventListener('click', function(e) {
        // Don't close if clicking on interactive elements
        if (e.target.id === 'emailLink-mobile' ||
            e.target.id === 'copyBtn-mobile' ||
            e.target.closest('#copyBtn-mobile') ||
            e.target.closest('#emailLink-mobile') ||
            e.target.closest('.mobile-link')) {
            return;
        }

        // Debounce
        const now = Date.now();
        if (now - lastInteractionTime < 400) {
            return;
        }
        lastInteractionTime = now;

        if (contactOpen) {
            closeContact();
        }
    });

    // Copy email
    const copyBtn = document.getElementById('copyBtn-mobile');
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const email = 'info@suitman.org';
            navigator.clipboard.writeText(email).then(() => {
                copyBtn.textContent = '✓';
                setTimeout(() => copyBtn.textContent = '⧉', 2000);
            });
        });
    }
}
