// Enhanced Professional JavaScript for Nawan's Portfolio - OPTIMIZED

document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loadingScreen);

    // Remove loading screen faster
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
                document.body.classList.add('loaded');
            }, 300);
        }, 800); // Reduced from 1000ms to 800ms
    });

    // Initialize Particles.js with optimized configuration
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80, // Reduced from 100 for better performance
                    density: {
                        enable: true,
                        value_area: 600 // Reduced area
                    }
                },
                color: {
                    value: '#6C63FF'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.4, // Reduced opacity for performance
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 2, // Smaller particles
                    random: true,
                    anim: {
                        enable: false, // Disabled animation for performance
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 120, // Reduced distance
                    color: '#6C63FF',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 0.8, // Slower movement
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 120, // Reduced
                        line_linked: {
                            opacity: 0.3
                        }
                    },
                    push: {
                        particles_nb: 3 // Reduced
                    }
                }
            },
            retina_detect: true
        });
    }

    // Optimized Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Optimized navigation link interactions
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Optimized Navbar scroll effect
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            navbar.classList.add('scrolled');
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = window.scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
        updateActiveSection();
    });
    
    // Optimized active section detection
    function updateActiveSection() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Optimized skill bars animation
    const skillItems = document.querySelectorAll('.skill-item');
    let skillsAnimated = false;
    
    function animateSkillBars() {
        if (skillsAnimated) return;
        
        let allInView = true;
        
        skillItems.forEach(item => {
            if (isElementInViewport(item)) {
                const progressBar = item.querySelector('.skill-progress');
                const width = item.getAttribute('data-level');
                if (progressBar && !progressBar.classList.contains('animated')) {
                    progressBar.style.width = width + '%';
                    progressBar.classList.add('animated');
                }
            } else {
                allInView = false;
            }
        });
        
        if (allInView) {
            skillsAnimated = true;
        }
    }
    
    // Optimized counter animation
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        
        let allInView = true;
        
        counters.forEach(counter => {
            if (isElementInViewport(counter) && !counter.classList.contains('animated')) {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 1500; // Reduced from 2000ms
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                        counter.classList.add('animated');
                    }
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                }, 16);
            } else if (!counter.classList.contains('animated')) {
                allInView = false;
            }
        });
        
        if (allInView) {
            countersAnimated = true;
        }
    }
    
    // Optimized scroll animations
    let revealElements = document.querySelectorAll('.skill-item, .project-card, .about-content > *, .contact-item');
    let revealedElements = new Set();
    
    function revealOnScroll() {
        revealElements.forEach((element) => {
            if (!revealedElements.has(element) && isElementInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                revealedElements.add(element);
            }
        });
    }
    
    // Optimized element visibility detection
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Throttled scroll handler for better performance
    let scrollTimeout;
    function throttledScrollHandler() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                animateSkillBars();
                animateCounters();
                revealOnScroll();
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    }
    
    window.addEventListener('scroll', throttledScrollHandler);
    
    // Set initial styles for reveal elements
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)'; // Reduced from 30px
        el.style.transition = 'all 0.4s ease'; // Faster transition
    });
    
    // Optimized form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields to send your proposal request.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address for us to contact you.', 'error');
                return;
            }
            
            if (message.length < 20) {
                showNotification('Please provide more details about your project (minimum 20 characters).', 'error');
                return;
            }
            
            // Form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
            submitBtn.disabled = true;
            
            // Simulate API call - faster
            setTimeout(() => {
                showNotification('Proposal request sent successfully! I\'ll review your project and get back to you within 24 hours.', 'success');
                contactForm.reset();
                
                // Reset form labels
                document.querySelectorAll('.form-label').forEach(label => {
                    label.style.top = '50%';
                    label.style.fontSize = '0.95rem';
                    label.style.color = 'rgba(255, 255, 255, 0.6)';
                    label.style.transform = 'translateY(-50%)';
                });
                
                // Button reset with success animation
                submitBtn.innerHTML = '<i class="fas fa-check"></i><span>Request Sent!</span>';
                submitBtn.style.background = '#00ff88';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 1500); // Faster reset
            }, 1500); // Reduced from 2000ms
        });
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Optimized notification system
    function showNotification(message, type) {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification faster
        setTimeout(() => {
            notification.classList.add('show');
        }, 50);
        
        // Auto-remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 200);
        }, 4000); // Slightly shorter display time
    }
    
    // Optimized floating cards interactions
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.04) translateZ(0)';
            this.style.boxShadow = 'var(--shadow-hover)';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = 'var(--shadow)';
            this.style.zIndex = '2';
        });
    });
    
    // Optimized form input interactions
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        input.addEventListener('input', function() {
            const label = this.nextElementSibling;
            if (this.value) {
                label.style.top = '0';
                label.style.fontSize = '0.75rem';
                label.style.color = 'var(--primary)';
                label.style.transform = 'translateY(-50%)';
            } else {
                label.style.top = '50%';
                label.style.fontSize = '0.95rem';
                label.style.color = 'rgba(255, 255, 255, 0.6)';
                label.style.transform = 'translateY(-50%)';
            }
        });
    });
    
    // Optimized hero animations
    window.addEventListener('load', function() {
        // Animate hero elements sequentially but faster
        const heroElements = document.querySelectorAll('.hero-text > *');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(15px)';
            setTimeout(() => {
                el.style.transition = 'all 0.4s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200 * (index + 1)); // Faster sequencing
        });
        
        // Optimized floating cards animation
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9) rotate(3deg)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = '';
            }, 400 + (index * 150)); // Faster appearance
        });
    });
    
    // Optimized intersection observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe only key elements
        document.querySelectorAll('section, .skill-category, .project-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Optimized smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Trigger initial animations faster
    setTimeout(() => {
        animateSkillBars();
        animateCounters();
        revealOnScroll();
    }, 300); // Reduced from 500ms
});

// Performance optimizations
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Prevent layout thrashing
let scheduled = false;
const tasks = [];

function scheduleTask(task) {
    tasks.push(task);
    if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
            let task;
            while (task = tasks.shift()) {
                task();
            }
            scheduled = false;
        });
    }
}
