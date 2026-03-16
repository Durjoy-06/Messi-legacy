/* =============================================
   LIONEL MESSI PORTFOLIO — ADVANCED INTERACTIVITY
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // === Custom Cursor ===
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover Scaling
    document.querySelectorAll('a, button, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // === Mobile Menu Toggle ===
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // === Interactive UI Sounds ===
    const clickSound = new Audio('click-on-mouse.wav');
    clickSound.preload = 'auto';
    clickSound.volume = 0.8; 
    let isAudioUnlocked = false;

    const playClick = () => {
        if (!clickSound) return;
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    };

    // Unlock audio context on first user interaction
    const unlockAudio = () => {
        if (isAudioUnlocked) return;
        clickSound.play()
            .then(() => {
                clickSound.pause();
                clickSound.currentTime = 0;
                isAudioUnlocked = true;
                document.removeEventListener('mousedown', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
            })
            .catch(() => {});
    };

    document.addEventListener('mousedown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    // Global delegation for interactive elements
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, .gallery-item, .timeline-item, .mobile-toggle, .stat-card, .p-dot, .cta-btn, .bio-image, .nav-link');
        if (target) {
            playClick();
        }
    });

    // === Navbar Scroll Effect ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // === Scroll Reveal Animation ===
    const indicator = document.querySelector('.nav-indicator');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class
                if (entry.target.classList.contains('reveal')) {
                    entry.target.classList.add('visible');
                }

                if (entry.target.classList.contains('stat-card')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, { 
        threshold: 0.05, 
        rootMargin: '10% 20% 10% 20%' // Large buffer for all sides
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Special Trigger for Journey Items
    const journeySection = document.getElementById('career');
    const journeyItems = document.querySelectorAll('#career .timeline-item');
    
    if (journeySection) {
        const journeyObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                journeyItems.forEach((item, i) => {
                    setTimeout(() => item.classList.add('visible'), i * 150);
                });
            }
        }, { threshold: 0.2 });
        journeyObserver.observe(journeySection);
    }

    // === Hero Entrance Animation ===
    setTimeout(() => {
        const heroItems = ['.hero-uptitle', '.hero-title', '.hero-p', '.cta-btn'];
        heroItems.forEach((sel, i) => {
            const el = document.querySelector(sel);
            if (el) {
                el.style.animation = `fadeInUp 1.2s ${0.3 + (i * 0.2)}s var(--ease-out-expo) forwards`;
            }
        });
    }, 100);

    // === Stats Counter Animation ===
    function animateCounter(card) {
        if (card.dataset.animated) return;
        card.dataset.animated = "true";

        const target = parseInt(card.dataset.count);
        const numberEl = card.querySelector('.stat-number');
        const duration = 2500;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            const current = Math.round(eased * target);

            numberEl.textContent = current;

            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // Old JS Particle System removed - Replaced by CSS 3D Sphere

    // === Gallery Modal Handling ===
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalStory = document.getElementById('modal-story');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            modalImg.src = item.dataset.img;
            modalStory.textContent = item.dataset.story;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    window.closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Observe sections for nav sync
    document.querySelectorAll('section').forEach(section => revealObserver.observe(section));

});
