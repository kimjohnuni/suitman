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

    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        updateLogo();
    }

    // Start slideshow
    slides[0].classList.add('active');
    updateLogo();
    setInterval(showNextSlide, slideInterval);

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

    // Close on background click
    aboutSection.addEventListener('click', function(e) {
        if (e.target.classList.contains('scrollable-area') ||
            e.target.classList.contains('content-section')) {
            if (aboutSection.getAttribute('data-state') === 'open') {
                aboutSection.setAttribute('data-state', 'closed');
                aboutSection.classList.remove('show');
                aboutSection.classList.add('hide');
                setTimeout(() => {
                    aboutSection.style.display = 'none';
                    aboutSection.className = 'content-section';
                }, 800);
            }
        }
    });

    contactSection.addEventListener('click', function(e) {
        if (e.target.classList.contains('scrollable-area') ||
            e.target.classList.contains('content-section')) {
            if (contactSection.getAttribute('data-state') === 'open') {
                contactSection.setAttribute('data-state', 'closed');
                contactSection.classList.remove('show');
                contactSection.classList.add('hide');
                setTimeout(() => {
                    contactSection.style.display = 'none';
                    contactSection.className = 'content-section';
                }, 800);
            }
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

    // Start slideshow
    slides[0].classList.add('active');
    updateLogo();
    setInterval(showNextSlide, slideInterval);

    // Section handling - MOBILE TOUCH
    const aboutSection = document.getElementById('about-mobile');
    const contactSection = document.getElementById('contact-mobile');
    const aboutLink = document.querySelector('.mobile-link[href="#about"]');
    const contactLink = document.querySelector('.mobile-link[href="#contact"]');

    let aboutOpen = false;
    let contactOpen = false;

    function openAbout() {
        if (contactOpen) {
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
        aboutSection.classList.remove('show');
        aboutSection.classList.add('hide');
        aboutOpen = false;
        setTimeout(() => {
            aboutSection.style.display = 'none';
            aboutSection.className = 'content-section';
        }, 850);
    }

    function openContact() {
        if (aboutOpen) {
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
        contactSection.classList.remove('show');
        contactSection.classList.add('hide');
        contactOpen = false;
        setTimeout(() => {
            contactSection.style.display = 'none';
            contactSection.className = 'content-section';
        }, 850);
    }

    aboutLink.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (aboutOpen) {
            closeAbout();
        } else {
            openAbout();
        }
    });

    contactLink.addEventListener('touchend', function(e) {
        e.preventDefault();
        if (contactOpen) {
            closeContact();
        } else {
            openContact();
        }
    });

    // Close on background tap
    aboutSection.addEventListener('touchend', function(e) {
        if (e.target.classList.contains('scrollable-area') ||
            e.target.classList.contains('content-section')) {
            if (aboutOpen) {
                closeAbout();
            }
        }
    });

    contactSection.addEventListener('touchend', function(e) {
        if (e.target.classList.contains('scrollable-area') ||
            e.target.classList.contains('content-section')) {
            if (contactOpen) {
                closeContact();
            }
        }
    });

    // Copy email
    const copyBtn = document.getElementById('copyBtn-mobile');
    if (copyBtn) {
        copyBtn.addEventListener('touchend', function(e) {
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
