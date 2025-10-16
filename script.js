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

    // SIMPLE STATE TRACKING
    let aboutState = 'closed'; // 'closed', 'open', 'closing'
    let contactState = 'closed';
    let aboutCloseTimeout = null;
    let contactCloseTimeout = null;

    function openAbout() {
        console.log('Opening about, current state:', aboutState);

        // Clear any pending timeouts
        if (aboutCloseTimeout) {
            clearTimeout(aboutCloseTimeout);
            aboutCloseTimeout = null;
        }
        if (contactCloseTimeout) {
            clearTimeout(contactCloseTimeout);
            contactCloseTimeout = null;
        }

        // Close contact
        contactSection.style.display = 'none';
        contactSection.className = 'content-section';
        contactSection.style.pointerEvents = '';
        contactState = 'closed';

        // Open about
        aboutSection.style.display = 'block';
        aboutSection.style.pointerEvents = 'auto';
        aboutSection.className = 'content-section';
        void aboutSection.offsetHeight;
        aboutSection.classList.add('show');
        aboutState = 'open';
    }

    function closeAbout() {
        console.log('Closing about, current state:', aboutState);

        if (aboutCloseTimeout) {
            clearTimeout(aboutCloseTimeout);
        }

        aboutSection.classList.remove('show');
        aboutSection.classList.add('hide');
        aboutSection.style.pointerEvents = 'none';
        aboutState = 'closing';

        aboutCloseTimeout = setTimeout(() => {
            aboutSection.style.display = 'none';
            aboutSection.className = 'content-section';
            aboutSection.style.pointerEvents = '';
            aboutCloseTimeout = null;
            aboutState = 'closed';
            console.log('About close animation complete');
        }, 900);
    }

    function openContact() {
        console.log('Opening contact, current state:', contactState);

        if (aboutCloseTimeout) {
            clearTimeout(aboutCloseTimeout);
            aboutCloseTimeout = null;
        }
        if (contactCloseTimeout) {
            clearTimeout(contactCloseTimeout);
            contactCloseTimeout = null;
        }

        // Close about
        aboutSection.style.display = 'none';
        aboutSection.className = 'content-section';
        aboutSection.style.pointerEvents = '';
        aboutState = 'closed';

        // Open contact
        contactSection.style.display = 'block';
        contactSection.style.pointerEvents = 'auto';
        contactSection.className = 'content-section';
        void contactSection.offsetHeight;
        contactSection.classList.add('show');
        contactState = 'open';
    }

    function closeContact() {
        console.log('Closing contact, current state:', contactState);

        if (contactCloseTimeout) {
            clearTimeout(contactCloseTimeout);
        }

        contactSection.classList.remove('show');
        contactSection.classList.add('hide');
        contactSection.style.pointerEvents = 'none';
        contactState = 'closing';

        contactCloseTimeout = setTimeout(() => {
            contactSection.style.display = 'none';
            contactSection.className = 'content-section';
            contactSection.style.pointerEvents = '';
            contactCloseTimeout = null;
            contactState = 'closed';
            console.log('Contact close animation complete');
        }, 900);
    }

    // Link handlers - use state variable
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('About clicked, state:', aboutState);

        // Don't do anything if currently closing
        if (aboutState === 'closing' || contactState === 'closing') {
            console.log('Animation in progress, ignoring');
            return;
        }

        if (aboutState === 'open') {
            closeAbout();
        } else {
            openAbout();
        }
    });

    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Contact clicked, state:', contactState);

        // Don't do anything if currently closing
        if (aboutState === 'closing' || contactState === 'closing') {
            console.log('Animation in progress, ignoring');
            return;
        }

        if (contactState === 'open') {
            closeContact();
        } else {
            openContact();
        }
    });

    // Section click to close
    aboutSection.addEventListener('click', function(e) {
        e.stopPropagation();

        if (e.target.id === 'emailLink-mobile' ||
            e.target.id === 'copyBtn-mobile' ||
            e.target.closest('#copyBtn-mobile') ||
            e.target.closest('#emailLink-mobile')) {
            return;
        }

        console.log('About section clicked, state:', aboutState);
        if (aboutState === 'open') {
            closeAbout();
        }
    });

    contactSection.addEventListener('click', function(e) {
        e.stopPropagation();

        if (e.target.id === 'emailLink-mobile' ||
            e.target.id === 'copyBtn-mobile' ||
            e.target.closest('#copyBtn-mobile') ||
            e.target.closest('#emailLink-mobile')) {
            return;
        }

        console.log('Contact section clicked, state:', contactState);
        if (contactState === 'open') {
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
