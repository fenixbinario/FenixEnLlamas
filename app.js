// ===== FENIX.NINJA JAVASCRIPT ===== //

(function() {
    'use strict';

    // ===== CONSTANTS & VARIABLES ===== //
    const ANIMATION_DURATION = 300;
    const SCROLL_THRESHOLD = 100;
    const PARTICLE_COUNT = 15;
    
    let isLoading = true;
    let scrollPosition = 0;
    let isScrolling = false;

    // ===== DOM ELEMENTS ===== //
    const elements = {
        loadingScreen: document.getElementById('loading-screen'),
        navbar: document.querySelector('.navbar'),
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        backToTop: document.getElementById('back-to-top'),
        particlesContainer: document.getElementById('particles'),
        contactForm: document.getElementById('contact-form'),
        submitButton: document.querySelector('.submit-button'),
        featureCards: document.querySelectorAll('.feature-card'),
        hero: document.querySelector('.hero')
    };

    // ===== UTILITY FUNCTIONS ===== //
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const smoothScrollTo = (target, duration = 1000) => {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 70;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };

    // ===== LOADING SCREEN ===== //
    const initLoadingScreen = () => {
        const hideLoading = () => {
            if (elements.loadingScreen) {
                elements.loadingScreen.classList.add('hide');
                setTimeout(() => {
                    elements.loadingScreen.style.display = 'none';
                    isLoading = false;
                }, 500);
            }
        };

        // Simulate loading time
        setTimeout(hideLoading, 2000);

        // Hide loading when page is fully loaded
        if (document.readyState === 'complete') {
            setTimeout(hideLoading, 500);
        } else {
            window.addEventListener('load', () => {
                setTimeout(hideLoading, 500);
            });
        }
    };

    // ===== NAVIGATION ===== //
    const initNavigation = () => {
        // Mobile menu toggle
        if (elements.navToggle && elements.navMenu) {
            elements.navToggle.addEventListener('click', () => {
                elements.navToggle.classList.toggle('active');
                elements.navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        smoothScrollTo(target);
                        // Close mobile menu
                        if (elements.navMenu.classList.contains('active')) {
                            elements.navToggle.classList.remove('active');
                            elements.navMenu.classList.remove('active');
                        }
                    }
                }
            });
        });

        // Update active nav link on scroll
        const updateActiveNavLink = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.pageYOffset + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                const navLink = document.querySelector(`.nav-link[href="#${section.id}"]`);

                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    elements.navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    };

    // ===== SCROLL EFFECTS ===== //
    const initScrollEffects = () => {
        const handleScroll = () => {
            scrollPosition = window.pageYOffset;

            // Navbar scroll effect
            if (elements.navbar) {
                if (scrollPosition > SCROLL_THRESHOLD) {
                    elements.navbar.classList.add('scrolled');
                } else {
                    elements.navbar.classList.remove('scrolled');
                }
            }

            // Back to top button
            if (elements.backToTop) {
                if (scrollPosition > SCROLL_THRESHOLD * 3) {
                    elements.backToTop.classList.add('show');
                } else {
                    elements.backToTop.classList.remove('show');
                }
            }

            // Parallax effect for hero
            if (elements.hero && !isLoading) {
                const rate = scrollPosition * -0.3;
                elements.hero.style.transform = `translateY(${rate}px)`;
            }
        };

        window.addEventListener('scroll', throttle(handleScroll, 16));

        // Back to top functionality
        if (elements.backToTop) {
            elements.backToTop.addEventListener('click', () => {
                smoothScrollTo(document.body);
            });
        }
    };

    // ===== PARTICLES ANIMATION ===== //
    const initParticles = () => {
        if (!elements.particlesContainer) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = getRandomInt(2, 6);
            const left = getRandomInt(0, 100);
            const animationDuration = getRandomInt(4, 8);
            const delay = getRandomInt(0, 6);
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${animationDuration}s;
                animation-delay: ${delay}s;
            `;
            
            return particle;
        };

        // Create initial particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            elements.particlesContainer.appendChild(createParticle());
        }

        // Recreate particles periodically
        setInterval(() => {
            if (elements.particlesContainer.children.length < PARTICLE_COUNT) {
                elements.particlesContainer.appendChild(createParticle());
            }
        }, 2000);
    };

    // ===== INTERSECTION OBSERVER ===== //
    const initIntersectionObserver = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe feature cards
        elements.featureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe other elements
        const elementsToObserve = document.querySelectorAll('.about-item, .contact-item');
        elementsToObserve.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(element);
        });
    };

    // ===== CONTACT FORM ===== //
    const initContactForm = () => {
        if (!elements.contactForm) return;

        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };

        const showFormMessage = (message, isError = false) => {
            const existingMessage = elements.contactForm.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
            messageDiv.textContent = message;
            messageDiv.style.cssText = `
                padding: 1rem;
                margin-bottom: 1rem;
                border-radius: 8px;
                text-align: center;
                font-weight: 500;
                background: ${isError ? 'rgba(192, 57, 43, 0.1)' : 'rgba(46, 204, 113, 0.1)'};
                color: ${isError ? '#C0392B' : '#2ECC71'};
                border: 1px solid ${isError ? 'rgba(192, 57, 43, 0.3)' : 'rgba(46, 204, 113, 0.3)'};
            `;

            elements.contactForm.insertBefore(messageDiv, elements.submitButton);

            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        };

        const setButtonLoading = (loading) => {
            if (loading) {
                elements.submitButton.classList.add('loading');
                elements.submitButton.disabled = true;
            } else {
                elements.submitButton.classList.remove('loading');
                elements.submitButton.disabled = false;
            }
        };

        elements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(elements.contactForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name.trim()) {
                showFormMessage('Por favor, ingresa tu nombre.', true);
                return;
            }

            if (!validateEmail(data.email)) {
                showFormMessage('Por favor, ingresa un email válido.', true);
                return;
            }

            if (!data.message.trim()) {
                showFormMessage('Por favor, describe tu proyecto.', true);
                return;
            }

            setButtonLoading(true);

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Here you would typically send the data to your server
                console.log('Form data:', data);
                
                showFormMessage('¡Mensaje enviado exitosamente! Te contactaremos pronto.');
                elements.contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.', true);
            } finally {
                setButtonLoading(false);
            }
        });

        // Floating labels effect
        const inputs = elements.contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    input.parentElement.classList