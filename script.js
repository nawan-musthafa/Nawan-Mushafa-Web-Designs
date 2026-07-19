// ============================================================
// script.js – Nawan Musthafa · Dark Premium Portfolio
// Custom cursor dot + background distortion (glass magnifier)
// Quadrant hover on schematic
// Native smooth scroll · particles · parallax
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // Respect the user's motion preference throughout the file
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== PRELOADER (progress ring + logo reveal) =====
    const preloader = document.getElementById('preloader');
    const loaderRing = document.querySelector('.loader-ring');
    let loadProgress = 0;
    const progressTimer = setInterval(() => {
        // Ease toward 92% while real resources load; the load event finishes it
        loadProgress += (92 - loadProgress) * 0.1 + 1;
        if (loadProgress > 92) loadProgress = 92;
        if (loaderRing) loaderRing.style.setProperty('--p', loadProgress.toFixed(1));
    }, 100);

    window.addEventListener('load', function () {
        clearInterval(progressTimer);
        if (loaderRing) loaderRing.style.setProperty('--p', 100);
        setTimeout(() => preloader.classList.add('hidden'), 600);
    });

    // ============================================================
    // 0. SMOOTH SCROLL (Lenis) + SCROLL ANIMATIONS (GSAP/ScrollTrigger)
    // ============================================================
    let lenis = null;
    if (!reduceMotion && window.Lenis) {
        lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
        });
    }

    const hasGSAP = !!window.gsap;
    const hasScrollTrigger = hasGSAP && !!window.ScrollTrigger;

    if (hasGSAP) {
        if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);
        // Drive Lenis off GSAP's own ticker so there's a single rAF loop
        // powering both the smooth scroll and the scroll-triggered animations.
        gsap.ticker.add((time) => {
            if (lenis) lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        if (lenis && hasScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
        }
    } else if (lenis) {
        // No GSAP available – drive Lenis with a plain rAF loop instead
        function rafFallback(time) {
            lenis.raf(time);
            requestAnimationFrame(rafFallback);
        }
        requestAnimationFrame(rafFallback);
    }

    // Helper used by every internal-anchor click handler below
    function smoothScrollTo(target, offset = -80) {
        if (lenis) {
            lenis.scrollTo(target, { offset });
        } else {
            const top = (typeof target === 'number' ? target : target.offsetTop) + offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    // ============================================================
    // 1. CUSTOM CURSOR DOT + BACKGROUND DISTORTION
    // ============================================================
    // Always create cursor on desktop, hide on touch via CSS
    // Remove touch detection – it was blocking the cursor on many devices

    // --- Cursor dot ---
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    // --- Distortion glass ---
    const distortion = document.createElement('div');
    distortion.className = 'distortion-glass';
    document.body.appendChild(distortion);

    document.body.classList.add('custom-cursor-enabled');

    let mouseX = 0,
        mouseY = 0;
    let dotX = 0,
        dotY = 0;
    let glassX = 0,
        glassY = 0;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Magnetic pull: while hovering a small, precise interactive element,
    // the glass eases toward its center instead of the raw cursor position.
    let activeMagnet = null;

    function glassTarget() {
        if (activeMagnet) {
            const rect = activeMagnet.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            return {
                x: mouseX + (cx - mouseX) * 0.35,
                y: mouseY + (cy - mouseY) * 0.35,
            };
        }
        return { x: mouseX, y: mouseY };
    }

    // Smooth follow for dot and glass (different speeds for layered effect)
    function animateCursor() {
        // Dot follows fast and precisely
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        // Glass follows with a touch of elastic delay, pulled toward magnets
        const target = glassTarget();
        glassX += (target.x - glassX) * 0.18;
        glassY += (target.y - glassY) * 0.18;
        distortion.style.left = glassX + 'px';
        distortion.style.top = glassY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects (glow + expand)
    const hoverElements = document.querySelectorAll(
        'a, button, .btn, .nav-link, .project-link, .social-link, .project-card, .ach-card'
    );

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function () {
            cursorDot.classList.add('hover');
            distortion.classList.add('hover');
        });
        el.addEventListener('mouseleave', function () {
            cursorDot.classList.remove('hover');
            distortion.classList.remove('hover');
        });
        el.addEventListener('mousedown', function () {
            distortion.classList.add('click');
        });
        el.addEventListener('mouseup', function () {
            distortion.classList.remove('click');
        });
    });

    // Magnetic pull only on small, precise targets – pulling a big card's
    // hover toward its center would feel wrong across its whole area.
    const magneticElements = document.querySelectorAll(
        '.btn, .nav-link, .social-link, .project-link, .nav-toggle'
    );
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', function () {
            activeMagnet = this;
        });
        el.addEventListener('mouseleave', function () {
            if (activeMagnet === this) activeMagnet = null;
        });
    });

    // Reset on window blur
    window.addEventListener('blur', function () {
        cursorDot.classList.remove('hover');
        distortion.classList.remove('hover', 'click');
    });

    // Also hide cursor on touch devices via media query – CSS handles this

    // ============================================================
    // 2. PARTICLES BACKGROUND
    // ============================================================
    function initParticles() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = 60;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = (1 - dist / 180) * 0.15;
                        ctx.strokeStyle = `rgba(201, 168, 76, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update();
                p.draw(); });
            drawLines();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
        window.addEventListener('resize', () => {
            resize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        });
    }
    initParticles();

    // ============================================================
    // 3. NAVBAR
    // ============================================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', function () {
        const isOpen = this.classList.toggle('active');
        navMenu.classList.toggle('active');
        this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScrollTo(target);
            }
        });
    });

    let lastScrollY = 0;

    function updateNavbar() {
        const currentScroll = window.pageYOffset || window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (currentScroll > lastScrollY && currentScroll > 120) {
            navbar.classList.add('hidden-nav');
        } else {
            navbar.classList.remove('hidden-nav');
        }
        lastScrollY = currentScroll;
        updateActiveSection();
    }

    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        const scrollPos = window.pageYOffset + 120;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    // ============================================================
    // 4. PARALLAX EFFECTS
    // ============================================================
    const heroBg = document.querySelector('.hero-bg');
    const heroVisual = document.querySelector('.hero-visual');

    function updateParallax() {
        const scrollY = window.pageYOffset || window.scrollY;
        if (heroBg) {
            heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.05}px)`;
        }
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrollY * -0.02}px)`;
        }
    }

    // Batch navbar + parallax updates into a single rAF tick per scroll burst
    // instead of running full-weight work on every raw scroll event.
    let scrollTicking = false;
    function onScroll() {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                updateNavbar();
                updateParallax();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ============================================================
    // 5. MOUSE PARALLAX ON HERO SCHEMATIC (lerp-smoothed, subtle)
    // ============================================================
    const schematic = document.querySelector('.schematic');
    let schematicTargetX = 0,
        schematicTargetY = 0;
    let schematicCurX = 0,
        schematicCurY = 0;

    if (schematic && !reduceMotion) {
        document.addEventListener('mousemove', function (e) {
            const rect = schematic.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) / rect.width;
            const moveY = (e.clientY - centerY) / rect.height;
            schematicTargetX = moveX * 2.2;
            schematicTargetY = -moveY * 2.2;
        });

        document.addEventListener('mouseleave', function () {
            schematicTargetX = 0;
            schematicTargetY = 0;
        });

        (function animateSchematic() {
            schematicCurX += (schematicTargetX - schematicCurX) * 0.08;
            schematicCurY += (schematicTargetY - schematicCurY) * 0.08;
            schematic.style.transform = `perspective(900px) rotateY(${schematicCurX}deg) rotateX(${schematicCurY}deg)`;
            requestAnimationFrame(animateSchematic);
        })();
    }

    // ============================================================
    // 6. QUADRANT HOVER ON SCHEMATIC – whole wedge area, not just the rim
    // ============================================================
    const quadrantHits = document.querySelectorAll('.quadrant-hit');
    quadrantHits.forEach(hit => {
        const idx = hit.getAttribute('data-quadrant');
        const arc = document.querySelector('.quadrant[data-quadrant="' + idx + '"]');
        if (!arc) return;
        hit.addEventListener('mouseenter', function () {
            arc.classList.add('active');
        });
        hit.addEventListener('mouseleave', function () {
            arc.classList.remove('active');
        });
    });

    // ============================================================
    // 7. BUTTON RIPPLE EFFECT
    // ============================================================
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ============================================================
    // 7b. 3D TILT ON PROJECT / ACHIEVEMENT CARDS
    // ============================================================
    if (!reduceMotion) {
        document.querySelectorAll('.project-card, .ach-card').forEach(card => {
            card.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                this.style.setProperty('--ry', (px * 8).toFixed(2) + 'deg');
                this.style.setProperty('--rx', (-py * 8).toFixed(2) + 'deg');
            });
            card.addEventListener('mouseleave', function () {
                this.style.setProperty('--ry', '0deg');
                this.style.setProperty('--rx', '0deg');
            });
        });
    }

    // ============================================================
    // 8. UTILITY: isInViewport
    // ============================================================
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0;
    }

    // ============================================================
    // 9. SKILL BARS
    // ============================================================
    const skillItems = document.querySelectorAll('.skill-item');
    let skillsAnimated = false;

    function animateSkills() {
        if (skillsAnimated) return;
        let allVisible = true;
        skillItems.forEach(item => {
            const fill = item.querySelector('.skill-fill');
            if (fill && !fill.style.width) {
                if (isInViewport(item)) {
                    fill.style.width = item.getAttribute('data-level') + '%';
                } else {
                    allVisible = false;
                }
            }
        });
        if (allVisible) skillsAnimated = true;
    }

    // ============================================================
    // 10. COUNTERS
    // ============================================================
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        let allVisible = true;
        counters.forEach(counter => {
            if (counter.dataset.done) return;
            if (!isInViewport(counter)) { allVisible = false; return; }
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 1200;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    counter.dataset.done = 'true';
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
        if (allVisible) countersAnimated = true;
    }

    // ============================================================
    // 11. STAGGERED REVEALS
    // ============================================================
    const staggerEls = document.querySelectorAll('.project-card, .ach-card, .skill-group');

    function revealStaggered() {
        staggerEls.forEach((el, index) => {
            if (isInViewport(el) && !el.classList.contains('in-view')) {
                el.style.transitionDelay = (index % 4) * 0.1 + 's';
                el.classList.add('in-view');
            }
        });
    }

    // ============================================================
    // 12. REVEAL ON SCROLL
    // ============================================================
    // Cards/groups above are also handled by revealStaggered() for their
    // per-item delay, so exclude them here to avoid the two systems racing
    // to mark the same element in-view before the stagger delay applies.
    const staggerSet = new Set(staggerEls);
    const revealEls = Array.from(document.querySelectorAll('.reveal')).filter(el => !staggerSet.has(el));

    // Prefer GSAP ScrollTrigger for reveals – it's more reliable than manual
    // polling and gives precise per-element stagger. If the CDN didn't load
    // for any reason, the original scroll-polling version below still runs.
    let gsapRevealActive = false;
    if (hasScrollTrigger) {
        gsapRevealActive = true;

        revealEls.forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => el.classList.add('in-view'),
            });
        });

        ['.projects-grid .project-card', '.achievements-grid .ach-card', '.skills-grid .skill-group'].forEach(
            selector => {
                const groupEls = gsap.utils.toArray(selector);
                if (!groupEls.length) return;
                ScrollTrigger.batch(groupEls, {
                    start: 'top 88%',
                    once: true,
                    onEnter: batch =>
                        batch.forEach((el, i) => {
                            el.style.transitionDelay = (i % 4) * 0.1 + 's';
                            el.classList.add('in-view');
                        }),
                });
            }
        );
    }

    function revealOnScroll() {
        if (gsapRevealActive) return; // ScrollTrigger already owns this
        revealEls.forEach(el => {
            if (isInViewport(el) && !el.classList.contains('in-view')) {
                el.classList.add('in-view');
            }
        });
        revealStaggered();
    }

    let scrollTimer;

    function handleScroll() {
        if (!scrollTimer) {
            scrollTimer = setTimeout(() => {
                animateSkills();
                animateCounters();
                revealOnScroll();
                scrollTimer = null;
            }, 20);
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ============================================================
    // 13. CONTACT FORM
    // ============================================================
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            if (message.length < 20) {
                showNotification('Please provide more details (min 20 characters).', 'error');
                return;
            }

            const btn = form.querySelector('.submit-btn');
            const orig = btn.innerHTML;
            btn.innerHTML = '<span>Sending…</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            setTimeout(() => {
                showNotification("Proposal sent! I'll get back to you within 24 hours.", 'success');
                form.reset();
                btn.innerHTML = '<span>Sent</span><i class="fas fa-check"></i>';
                btn.style.background = 'var(--accent)';
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 1500);
            }, 1200);
        });
    }

    // ============================================================
    // 14. NOTIFICATION SYSTEM
    // ============================================================
    function showNotification(msg, type) {
        document.querySelectorAll('.notification').forEach(n => n.remove());
        const div = document.createElement('div');
        div.className = 'notification ' + type;
        div.setAttribute('role', 'status');
        div.innerHTML = `<div class="notification-content">
                            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                            <span>${msg}</span>
                        </div>`;
        document.body.appendChild(div);
        requestAnimationFrame(() => div.classList.add('show'));
        setTimeout(() => {
            div.classList.remove('show');
            setTimeout(() => div.remove(), 300);
        }, 4000);
    }

    // ============================================================
    // 15. SMOOTH SCROLL FOR ALL ANCHORS (native)
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.classList.contains('nav-link')) return;
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                smoothScrollTo(target);
            }
        });
    });

    // ============================================================
    // 16. SEO: Add Meta Tags Dynamically
    // ============================================================
    function addSEOMetaTags() {
        const metaTags = [
            { property: 'og:title', content: 'Nawan Musthafa · Digital Architect' },
            { property: 'og:description', content: '16‑year‑old digital architect building world‑class digital experiences.' },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: window.location.href },
            { property: 'og:image', content: 'https://via.placeholder.com/1200x630/0a0a0a/C9A84C?text=Nawan+Musthafa' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: 'Nawan Musthafa · Digital Architect' },
            { name: 'twitter:description', content: '16‑year‑old digital architect building world‑class digital experiences.' },
            { name: 'twitter:image', content: 'https://via.placeholder.com/1200x630/0a0a0a/C9A84C?text=Nawan+Musthafa' },
            { rel: 'canonical', href: window.location.href },
        ];

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Nawan Musthafa',
            jobTitle: 'Digital Architect & UI/UX Designer',
            url: window.location.href,
            age: '16',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Payyoli',
                addressRegion: 'Kerala',
                addressCountry: 'IN',
            },
            email: 'musthafanawan@gmail.com',
            telephone: '+91 7012517454',
            sameAs: [
                'https://github.com/nawan-musthafa',
                'https://www.instagram.com/_n.a.w.a.n_/',
            ],
            knowsAbout: ['Web Design', 'UI/UX Design', 'Frontend Development', 'HTML', 'CSS', 'JavaScript'],
            award: [
                'YIP State Winner',
                'State IT Fair Finalist',
            ],
            project: [
                {
                    '@type': 'Project',
                    name: 'OxySafe',
                    description: 'Smart vehicle safety system',
                    url: 'https://nawan-musthafa.github.io/OxySafe/',
                },
                {
                    '@type': 'Project',
                    name: 'XSLC+',
                    description: 'Exam prep platform for Kerala SSLC students',
                    url: 'https://xslc.netlify.app/',
                },
            ],
        });
        document.head.appendChild(script);

        metaTags.forEach(tag => {
            let el;
            if (tag.property) {
                el = document.createElement('meta');
                el.setAttribute('property', tag.property);
                el.content = tag.content;
            } else if (tag.name) {
                el = document.createElement('meta');
                el.setAttribute('name', tag.name);
                el.content = tag.content;
            } else if (tag.rel) {
                el = document.createElement('link');
                el.setAttribute('rel', tag.rel);
                el.href = tag.href;
            }
            if (el) document.head.appendChild(el);
        });
    }
    addSEOMetaTags();

    // ============================================================
    // 17. BACK TO TOP
    // ============================================================
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('mouseenter', function () {
        cursorDot.classList.add('hover');
        distortion.classList.add('hover');
        activeMagnet = this;
    });
    backToTop.addEventListener('mouseleave', function () {
        cursorDot.classList.remove('hover');
        distortion.classList.remove('hover');
        if (activeMagnet === this) activeMagnet = null;
    });
    backToTop.addEventListener('mousedown', () => distortion.classList.add('click'));
    backToTop.addEventListener('mouseup', () => distortion.classList.remove('click'));

    backToTop.addEventListener('click', function () {
        smoothScrollTo(0, 0);
    });

    function toggleBackToTop() {
        const scrollY = window.pageYOffset || window.scrollY;
        backToTop.classList.toggle('visible', scrollY > 500);
    }
    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    // ============================================================
    // 18. INITIAL TRIGGER
    // ============================================================
    setTimeout(() => {
        animateSkills();
        animateCounters();
        revealOnScroll();
        toggleBackToTop();
        if (hasScrollTrigger) ScrollTrigger.refresh();
    }, 500);

});