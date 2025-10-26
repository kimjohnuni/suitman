document.addEventListener('DOMContentLoaded', function() {
    const desktopSlides = document.querySelectorAll('.desktop-slider .slide');
    const mobileSlides = document.querySelectorAll('.mobile-slider .slide');
    const whiteLogo = document.querySelector('.white-logo');
    const blackLogo = document.querySelector('.black-logo');
    const navLeft = document.querySelector('.nav-left');
    const navRight = document.querySelector('.nav-right');
    const mobileSlider = document.querySelector('.mobile-slider');

    let currentSlide = 0;
    let isAnimating = false;
    let autoSlideInterval;
    const slideInterval = 6000;
    const isMobile = window.innerWidth <= 768;

    // Desktop logo colors (for horizontal images)
    const desktopLogoColors = [
        'white',  // 01. ICELAND.jpg
        'white',  // 01. MYANMAR.jpg
        'black',  // 02. BRAZIL.jpg
        'black',  // 02. INDIA.jpg
        'white',  // 03. ATHENS.jpg
        'white',  // 03. TIBET.jpg
        'white',  // 04. MONGOLIA.jpg
        'white',  // 04. USA.jpg
        'black',  // 05. NEW ZEALAND.jpg
        'white',  // 05. USA.jpg (2)
        'black',  // 06. EGYPT.jpg
        'black',  // 06. USA_.jpg
        'white',  // 07. BEIJING.jpg
        'black',  // 07. JAPAN.jpg
        'white',  // 08. BUSAN.jpg
        'white',  // 08. EGYPT.jpg (2)
        'black',  // 09. FIGURES.jpg
        'black',  // 10. GREECE.jpg
        'white'   // 11. HK.jpg
    ];

    // Mobile logo colors (for vertical images)
    const mobileLogoColors = [
        'white',  // 01. ICELAND.jpg
        'black',  // 02. ABOUT_01.jpg
        'white',  // 03. MONGOLIA.jpg
        'white',  // 05. BAHARIYA.jpg
        'black',  // 06. EGYPT.jpg
        'white'   // 07. ATHENS.jpg
    ];

    // Choose the appropriate slides and logo colors based on screen size
    const slides = isMobile ? mobileSlides : desktopSlides;
    const logoColors = isMobile ? mobileLogoColors : desktopLogoColors;

    // Initialize first slide as visible
    if (slides.length > 0) {
        slides[0].classList.add('active');
        slides[0].style.opacity = '1';
        slides[0].style.visibility = 'visible';
        if (isMobile) {
            slides[0].style.transform = 'translateY(0)';
        }
    }

    function switchLogo(color) {
        if (color === 'white') {
            whiteLogo.style.opacity = '1';
            blackLogo.style.opacity = '0';
        } else {
            whiteLogo.style.opacity = '0';
            blackLogo.style.opacity = '1';
        }
    }

    function goToSlide(nextIndex, direction = 'forward') {
        if (isAnimating) return;
        isAnimating = true;

        // Reset auto-slide timer
        clearInterval(autoSlideInterval);
        startAutoSlide();

        const current = slides[currentSlide];
        const next = slides[nextIndex];

        // Make next slide visible immediately to prevent black gaps
        next.style.opacity = '1';
        next.style.visibility = 'visible';

        // Switch logo at the start of animation for mobile, middle for desktop
        if (isMobile) {
            switchLogo(logoColors[nextIndex]);
        }

        if (direction === 'forward') {
            current.classList.add('sliding-out');
            next.classList.add('sliding-in');
        } else {
            current.classList.add('sliding-out-reverse');
            next.classList.add('sliding-in-reverse');
        }

        // Switch logo in the middle for desktop
        if (!isMobile) {
            setTimeout(() => {
                switchLogo(logoColors[nextIndex]);
            }, 200);
        }

        setTimeout(() => {
            current.classList.remove('active', 'sliding-out', 'sliding-out-reverse');
            current.style.opacity = '0';
            current.style.visibility = 'hidden';

            next.classList.remove('sliding-in', 'sliding-in-reverse');
            next.classList.add('active');

            currentSlide = nextIndex;
            isAnimating = false;
        }, 1000);
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex, 'forward');
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, slideInterval);
    }

    // Desktop click navigation
    if (!isMobile && navLeft && navRight) {
        navLeft.addEventListener('click', function() {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prevIndex, 'backward');
        });

        navRight.addEventListener('click', function() {
            const nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex, 'forward');
        });
    }

    // Mobile touch swipe
    if (isMobile && mobileSlider) {
        let touchStartY = 0;
        let touchEndY = 0;

        mobileSlider.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        }, false);

        mobileSlider.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped up - go forward
                    const nextIndex = (currentSlide + 1) % slides.length;
                    goToSlide(nextIndex, 'forward');
                } else {
                    // Swiped down - go backward
                    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
                    goToSlide(prevIndex, 'backward');
                }
            }
        }
    }

    // Set initial logo color
    switchLogo(logoColors[0]);

    // Start auto-advance slides
    startAutoSlide();

    // Desktop About/Contact Panel Toggle
    const aboutTab = document.getElementById('aboutTab');
    const contactTab = document.getElementById('contactTab');
    const aboutPanel = document.getElementById('aboutPanel');
    const contactPanel = document.getElementById('contactPanel');

    if (aboutTab && aboutPanel) {
        aboutTab.addEventListener('click', function() {
            const isOpen = aboutPanel.classList.contains('open');

            // Toggle about panel
            aboutPanel.classList.toggle('open');
            aboutTab.classList.toggle('active');

            if (!isOpen) {
                // Opening ABOUT - slide CONTACT tab to the left
                contactPanel.classList.remove('open');
                contactTab.classList.remove('active');
                contactTab.style.transition = 'transform 0.3s ease';
                contactTab.style.transform = 'translateX(-100%)';
                contactTab.style.pointerEvents = 'none';
            } else {
                // Closing ABOUT - slide CONTACT tab back from left
                setTimeout(function() {
                    contactTab.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    contactTab.style.transform = 'translateX(0)';
                    contactTab.style.pointerEvents = 'auto';
                }, 400);
            }
        });
    }

    if (contactTab && contactPanel) {
        contactTab.addEventListener('click', function() {
            const isOpen = contactPanel.classList.contains('open');

            // Toggle contact panel
            contactPanel.classList.toggle('open');
            contactTab.classList.toggle('active');

            if (!isOpen) {
                // Opening CONTACT - slide ABOUT tab to the left
                aboutPanel.classList.remove('open');
                aboutTab.classList.remove('active');
                aboutTab.style.transition = 'transform 0.3s ease';
                aboutTab.style.transform = 'translateX(-100%)';
                aboutTab.style.pointerEvents = 'none';
            } else {
                // Closing CONTACT - slide ABOUT tab back from left
                setTimeout(function() {
                    aboutTab.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    aboutTab.style.transform = 'translateX(0)';
                    aboutTab.style.pointerEvents = 'auto';
                }, 400);
            }
        });
    }

    // Mobile About/Contact Panel Toggle - CORRECTED for right-positioned tabs
    // Mobile About/Contact Panel Toggle - Controlled slide distance
    const mobileAboutTab = document.getElementById('mobileAboutTab');
    const mobileContactTab = document.getElementById('mobileContactTab');
    const mobileAboutPanel = document.getElementById('mobileAboutPanel');
    const mobileContactPanel = document.getElementById('mobileContactPanel');
    const instagramTab = document.querySelector('.instagram-tab');

    if (mobileAboutTab && mobileAboutPanel) {
        mobileAboutTab.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = mobileAboutPanel.classList.contains('open');

            // Toggle about panel
            mobileAboutPanel.classList.toggle('open');
            mobileAboutTab.classList.toggle('active');

            if (!isOpen) {
                // Opening ABOUT - slide tabs to -70%
                mobileContactPanel.classList.remove('open');
                mobileContactTab.classList.remove('active');
                mobileContactTab.style.transition = 'transform 0.3s ease';
                mobileContactTab.style.transform = 'translateX(-70%) scaleX(0.6)';  // Changed here
                mobileContactTab.style.pointerEvents = 'none';

                // Slide Instagram tab
                if (instagramTab) {
                    instagramTab.style.transition = 'transform 0.3s ease';
                    instagramTab.style.transform = 'translateX(-70%) scaleX(0.6)';  // Changed here
                    instagramTab.style.pointerEvents = 'none';
                }
            } else {
                // Closing ABOUT - bring tabs back
                setTimeout(function() {
                    mobileContactTab.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    mobileContactTab.style.transform = 'translateX(0) scaleX(1)';
                    mobileContactTab.style.pointerEvents = 'auto';

                    if (instagramTab) {
                        instagramTab.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        instagramTab.style.transform = 'translateX(0) scaleX(1)';
                        instagramTab.style.pointerEvents = 'auto';
                    }
                }, 400);
            }
        });
    }

    if (mobileContactTab && mobileContactPanel) {
        mobileContactTab.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = mobileContactPanel.classList.contains('open');

            // Toggle contact panel
            mobileContactPanel.classList.toggle('open');
            mobileContactTab.classList.toggle('active');

            if (!isOpen) {
                // Opening CONTACT - slide tabs to -70%
                mobileAboutPanel.classList.remove('open');
                mobileAboutTab.classList.remove('active');
                mobileAboutTab.style.transition = 'transform 0.3s ease';
                mobileAboutTab.style.transform = 'translateX(-70%) scaleX(0.6)';  // Changed here
                mobileAboutTab.style.pointerEvents = 'none';

                // Slide Instagram tab
                if (instagramTab) {
                    instagramTab.style.transition = 'transform 0.3s ease';
                    instagramTab.style.transform = 'translateX(-70%) scaleX(0.6)';  // Changed here
                    instagramTab.style.pointerEvents = 'none';
                }
            } else {
                // Closing CONTACT - bring tabs back
                setTimeout(function() {
                    mobileAboutTab.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    mobileAboutTab.style.transform = 'translateX(0) scaleX(1)';
                    mobileAboutTab.style.pointerEvents = 'auto';

                    if (instagramTab) {
                        instagramTab.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        instagramTab.style.transform = 'translateX(0) scaleX(1)';
                        instagramTab.style.pointerEvents = 'auto';
                    }
                }, 400);
            }
        });
    }

    // Add touch event support for iOS
    if (mobileAboutTab) {
        document.body.addEventListener("touchstart", function(){});
    }

});

// Copy email function
function copyEmail(event) {
    event.preventDefault();
    const email = 'info@suitman.org';
    navigator.clipboard.writeText(email).then(function() {
        const button = event.target.closest('.copy-button');
        const copyIcon = button.querySelector('.copy-icon');
        const checkIcon = button.querySelector('.check-icon');

        // Reset animation by removing and re-adding the element
        const newCheckIcon = checkIcon.cloneNode(true);
        checkIcon.parentNode.replaceChild(newCheckIcon, checkIcon);

        // Hide copy icon, show checkmark with circle
        copyIcon.style.display = 'none';
        newCheckIcon.style.display = 'block';

        // After 1.5 seconds, switch back
        setTimeout(function() {
            copyIcon.style.display = 'block';
            newCheckIcon.style.display = 'none';
        }, 1500);
    }).catch(function(err) {
        console.error('Failed to copy email: ', err);
    });
}
