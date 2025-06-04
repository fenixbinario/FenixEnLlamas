// ===== FENIX.NINJA JAVASCRIPT ===== //

(function() {
    'use strict';

    // ===== CONSTANTS & VARIABLES ===== //
    const SCROLL_THRESHOLD = 100;
    const PARTICLE_COUNT_HERO = 25; // Aumentado para más efecto en el hero
    const PARTICLE_COUNT_FEATURE_CARDS = 10; // Un número menor para las tarjetas
    const GLITCH_TEXT_TRANSITION_SPEED = 500; // ms
    const TYPING_EFFECT_SPEED = 40; // ms
    const MATRIX_TYPING_EFFECT_SPEED = 40; // ms
    const FLAME_PARTICLE_COUNT = 30;
    const FLAME_COLORS = ['#F25C1F', '#C0392B', '#f9d423', '#ff7e5f', '#feb47b'];
    const SPARK_QUANTITY_CARD_HOVER = 20;
    const SPARK_QUANTITY_BUTTON_HOVER = 15;

    let isLoading = true; // Estado global para la pantalla de carga y parallax

    // ===== DOM ELEMENTS ===== //
    const elements = {
        // Original elements from app.js
        loadingScreen: document.getElementById('loading-screen'),
        navbar: document.querySelector('.navbar'),
        navToggle: document.getElementById('nav-toggle'), // Asumiendo que existirá un #nav-toggle para menú móvil
        navMenu: document.getElementById('nav-menu'),     // Asumiendo que existirá un #nav-menu para menú móvil
        navLinks: document.querySelectorAll('.nav-link'), // Usado en initNavigation
        backToTop: document.getElementById('back-to-top'), // Asumiendo que existirá
        contactForm: document.getElementById('contact-form'),
        submitButton: document.querySelector('#contact-form .submit-button'), // Más específico

        // Elements moved from index.html script
        hero: document.querySelector('.hero'),
        logo3DContainer: document.getElementById('logo3DContainer'),
        phoenixCardModelContainer: document.getElementById('phoenixCardModelContainer'),
        unicornCardModelContainer: document.getElementById('unicornCardModelContainer'),
        fenixWingsCardModelContainer: document.getElementById('fenixWingsCardModelContainer'),
        particlesContainerHero: document.getElementById('particles'), // Específico para el hero
        revolutionText: document.getElementById('revolution-text'),
        japaneseText: document.getElementById('japanese-text'),
        fontPreviews: document.querySelectorAll('.font-preview'),
        featureCards: document.querySelectorAll('.feature-card'), // Para partículas y animación de scroll
        showcaseCards: document.querySelectorAll('.showcase-card'), // Para chispas y animación de scroll
        readMoreShowcaseButtons: document.querySelectorAll('.showcase-card .noise_btn--neon'),
        mainTitles: document.querySelectorAll('.section-main-title'), // Para partículas de llama
        cinderblockFontTestElements: document.querySelectorAll('.font-cinderblock') // Para la prueba de fuentes
    };

    // ===== UTILITY FUNCTIONS ===== //
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout); timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments; const context = this;
            if (!inThrottle) {
                func.apply(context, args); inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const isElementInViewport = (el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    };

    const smoothScrollTo = (target, duration = 1000) => {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) { console.warn('Smooth scroll target not found:', target); return; }
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (elements.navbar ? elements.navbar.offsetHeight : 70); // Ajuste para navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        const easeInOutQuad = (t, b, c, d) => { t /= d / 2; if (t < 1) return c / 2 * t * t + b; t--; return -c / 2 * (t * (t - 2) - 1) + b; };
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        requestAnimationFrame(animation);
    };

    function createSparks(element, quantity) {
        if (!element || !element.getBoundingClientRect) return;
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return; // No crear chispas en elementos no visibles

        const sparksContainerId = 'sparks-container-' + Date.now() + Math.random().toString(36).substring(2,7);
        let sparksContainer = element.querySelector('.sparks-overlay-container');
        if (!sparksContainer) {
            sparksContainer = document.createElement('div');
            sparksContainer.className = 'sparks-overlay-container'; // Para posible limpieza selectiva
            sparksContainer.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; pointer-events:none; z-index:10;';
            element.style.position = 'relative';
            element.appendChild(sparksContainer);
        }
        
        for (let i = 0; i < quantity; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark'; // CSS debe definir .spark
            const startX = Math.random() * rect.width;
            const startY = Math.random() * rect.height;
            spark.style.left = startX + 'px';
            spark.style.top = startY + 'px';
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            spark.style.setProperty('--spark-x', (Math.cos(angle) * distance) + 'px');
            spark.style.setProperty('--spark-y', (Math.sin(angle) * distance) + 'px');
            const size = 2 + Math.random() * 3;
            spark.style.width = size + 'px';
            spark.style.height = size + 'px';
            spark.style.animation = `spark-animation ${0.3 + Math.random() * 0.3}s ease-out forwards ${ (Math.random() * 0.2)}s`;
            sparksContainer.appendChild(spark);
        }
        setTimeout(() => {
            if (element.contains(sparksContainer)) {
                sparksContainer.innerHTML = ''; // Limpiar chispas en lugar de remover el contenedor, para reutilizarlo
            }
        }, 1000); // Tiempo para que terminen las animaciones
    }

    // ===== MAIN FUNCTIONALITY ===== //

    function init3DModel(config) {
        const container = document.getElementById(config.containerId);
        if (!container) { console.error(`Contenedor 3D "${config.containerId}" no encontrado.`); return; }
        let cWidth = container.offsetWidth;
        let cHeight = config.initialContainerHeight || container.offsetHeight;
        if (cWidth === 0 && config.initialContainerWidth) cWidth = config.initialContainerWidth;
        if (cHeight === 0 && config.initialContainerHeight) cHeight = config.initialContainerHeight;
        if (cWidth === 0 || cHeight === 0) {
            console.warn(`Contenedor "${config.containerId}" sin dimensiones. Reintentando.`);
            setTimeout(() => init3DModel(config), 250); return;
        }
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(config.cameraFov || 75, cWidth / cHeight, 0.1, 1000);
        if (config.cameraPosition) camera.position.set(config.cameraPosition.x || 0, config.cameraPosition.y || 0, config.cameraPosition.z || 5);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(cWidth, cHeight);
        renderer.setClearColor(config.backgroundColor || 0x000000, config.backgroundAlpha !== undefined ? config.backgroundAlpha : 0);
        container.innerHTML = ''; container.appendChild(renderer.domElement);

        if (config.ambientLight) scene.add(new THREE.AmbientLight(config.ambientLight.color || 0xffffff, config.ambientLight.intensity || 0.5));
        if (config.directionalLight) {
            const dirLight = new THREE.DirectionalLight(config.directionalLight.color || 0xffffff, config.directionalLight.intensity || 1);
            dirLight.position.set(config.directionalLight.position?.x || 5, config.directionalLight.position?.y || 5, config.directionalLight.position?.z || 5);
            scene.add(dirLight);
        }
        const loader = new THREE.GLTFLoader();
        loader.load(config.modelPath, (gltf) => {
            const model = gltf.scene;
            if (config.modelProperties) {
                if (config.modelProperties.scale) model.scale.set(config.modelProperties.scale.x || 1, config.modelProperties.scale.y || 1, config.modelProperties.scale.z || 1);
                if (config.modelProperties.position) model.position.set(config.modelProperties.position.x || 0, config.modelProperties.position.y || 0, config.modelProperties.position.z || 0);
                if (config.modelProperties.rotation) model.rotation.set(config.modelProperties.rotation.x || 0, config.modelProperties.rotation.y || 0, config.modelProperties.rotation.z || 0);
            }
            scene.add(model);
            const animate = () => { requestAnimationFrame(animate); if (config.animationClip) config.animationClip(model, scene, camera, renderer); renderer.render(scene, camera); };
            animate();
        }, (p) => console.log(`Cargando "${config.modelPath}": ${(p.loaded/p.total*100).toFixed(0)}%`), (e) => console.error(`Error GLTF "${config.modelPath}":`, e));
        
        window.addEventListener('resize', throttle(() => {
            let nWidth = container.offsetWidth; let nHeight = config.initialContainerHeight || container.offsetHeight;
            if (nWidth > 0 && nHeight > 0) {
                camera.aspect = nWidth / nHeight; camera.updateProjectionMatrix(); renderer.setSize(nWidth, nHeight);
            }
        }, 200));
    }

    function init3DLogo() {
        if (!elements.logo3DContainer) { console.warn("Elemento #logo3DContainer no encontrado."); return; }
        const logoConfig = {
            containerId: 'logo3DContainer', modelPath: 'src/Unicorn_texture.glb',
            initialContainerWidth: 120, initialContainerHeight: 120,
            backgroundColor: 0x0F0F0F, backgroundAlpha: 0.5,
            cameraPosition: { x: 0, y: 0, z: 2.5 }, cameraFov: 75,
            ambientLight: { color: 0xffffff, intensity: 0.7 },
            directionalLight: { color: 0xF25C1F, intensity: 1.2, position: { x: 5, y: 5, z: 5 } },
            modelProperties: { scale: { x: 1.5, y: 1.5, z: 1.5 }, position: { x: 0, y: -0.25, z: 0 }, rotation: { x: -0.2, y: 0, z: 0 } },
            animationClip: model => { model.rotation.y += 0.005; }
        };
        init3DModel(logoConfig);
    }

    function initPhoenixCardModel() {
        if (!elements.phoenixCardModelContainer) { console.warn("Elemento #phoenixCardModelContainer no encontrado."); return; }
        const phoenixConfig = {
            containerId: 'phoenixCardModelContainer', modelPath: 'src/Phoenix_Flame_texture.glb',
            initialContainerHeight: 250, backgroundColor: 0x000000, backgroundAlpha: 0,
            cameraPosition: { x: 0, y: 1, z: 4 }, cameraFov: 50,
            ambientLight: { color: 0xffffff, intensity: 0.8 },
            directionalLight: { color: 0xFF8C00, intensity: 1.5, position: { x: 3, y: 5, z: 5 } },
            modelProperties: { scale: { x: 1.5, y: 1.5, z: 1.5 }, position: { x: 0, y: 1, z: 0 }, rotation: { x: 0, y: Math.PI / 4, z: 0 } },
            animationClip: model => { model.rotation.y += 0.01; }
        };
        init3DModel(phoenixConfig);
    }

    function initUnicornCardModel() {
        if (!elements.unicornCardModelContainer) { console.warn("Elemento #unicornCardModelContainer no encontrado."); return; }
        const unicornCardConfig = {
            containerId: 'unicornCardModelContainer',
            modelPath: 'src/Unicorn_texture.glb',
            initialContainerHeight: 250,
            backgroundColor: 0x000000, 
            backgroundAlpha: 0,
            cameraPosition: { x: 0, y: 1, z: 3 }, 
            cameraFov: 75,
            ambientLight: { color: 0xffffff, intensity: 0.7 },
            directionalLight: { color: 0xF25C1F, intensity: 1.2, position: { x: 5, y: 5, z: 5 } },
            modelProperties: {
                scale: { x: 1.5, y: 1.5, z: 1.5 },
                position: { x: 0, y: 1, z: 0 },
                rotation: { x: -0.2, y: 0.3, z: 0 }
            },
            animationClip: model => { model.rotation.y += 0.01; }
        };
        init3DModel(unicornCardConfig);
    }

    function initFenixWingsCardModel() {
        if (!elements.fenixWingsCardModelContainer) { console.warn("Elemento #fenixWingsCardModelContainer no encontrado."); return; }
        const fenixWingsCardConfig = {
            containerId: 'fenixWingsCardModelContainer',
            modelPath: 'src/fenix_Wings_texture.glb',
            initialContainerHeight: 250,
            backgroundColor: 0x000000, 
            backgroundAlpha: 0,
            cameraPosition: { x: 0, y: 1, z: 4 }, 
            cameraFov: 50,
            ambientLight: { color: 0xffffff, intensity: 0.8 },
            directionalLight: { color: 0xFF8C00, intensity: 1.5, position: { x: 3, y: 5, z: 5 } },
            modelProperties: {
                scale: { x: 1.5, y: 1.5, z: 1.5 },
                position: { x: 0, y: 1, z: 0 },
                rotation: { x: 0, y: Math.PI / 4, z: 0 }
            },
            animationClip: model => { model.rotation.y += 0.01; }
        };
        init3DModel(fenixWingsCardConfig);
    }
    
    function createHeroParticles() {
        if (!elements.particlesContainerHero) { console.warn("Elemento #particles (hero) no encontrado."); return; }
        for (let i = 0; i < PARTICLE_COUNT_HERO; i++) {
            const p = document.createElement('div'); p.className = 'particle';
            const s = Math.random()*4+2; p.style.width=s+'px'; p.style.height=s+'px';
            p.style.left=Math.random()*100+'%'; p.style.animationDelay=Math.random()*6+'s';
            p.style.animationDuration=(Math.random()*4+4)+'s';
            elements.particlesContainerHero.appendChild(p);
        }
    }

    function createFeatureCardParticles() {
        if (!elements.featureCards || elements.featureCards.length === 0) return;
        elements.featureCards.forEach(card => {
            let pContainer = card.querySelector('.card-particles');
            if (!pContainer) {
                pContainer = document.createElement('div'); pContainer.className = 'card-particles';
                card.appendChild(pContainer);
            } else {
                pContainer.innerHTML = ''; // Limpiar si ya existe
            }
            for (let i = 0; i < PARTICLE_COUNT_FEATURE_CARDS; i++) {
                const p=document.createElement('div'); p.className='card-particle';
                const s=Math.random()*3+3; p.style.width=s+'px'; p.style.height=s+'px';
                p.style.bottom='0'; p.style.left=Math.random()*100+'%';
                p.style.setProperty('--particle-x', `${(Math.random()-0.5)*100}px`);
                p.style.animationDelay=Math.random()*0.5+'s';
                pContainer.appendChild(p);
            }
        });
    }

    function initFontTransitions() {
        if (!elements.fontPreviews || elements.fontPreviews.length === 0) return;
        let currentIndex = 0;
        if (elements.fontPreviews[currentIndex]) elements.fontPreviews[currentIndex].classList.add('active');
        else return; // No hay previews

        const transition = () => {
            if (!elements.fontPreviews[currentIndex]) return;
            const current = elements.fontPreviews[currentIndex];
            currentIndex = (currentIndex + 1) % elements.fontPreviews.length;
            const next = elements.fontPreviews[currentIndex];
            if (!current || !next) return;

            current.classList.add('glitch-out'); createSparks(current, 30);
            setTimeout(() => {
                current.classList.remove('active', 'glitch-out');
                next.classList.add('active', 'glitch-in'); createSparks(next, 30);
                setTimeout(() => next.classList.remove('glitch-in'), GLITCH_TEXT_TRANSITION_SPEED);
            }, GLITCH_TEXT_TRANSITION_SPEED);
        };
        const scheduleNextTransition = () => { setTimeout(() => { transition(); scheduleNextTransition(); }, getRandomInt(3000, 5000)); };
        scheduleNextTransition();
    }

    function createTypingEffect(element, speed) {
        if (!element || !element.textContent) { console.warn('Elemento o texto no válido para typing effect'); return; }
        const originalText = element.textContent.trim();
        element.innerHTML = ''; // Limpiar
        element.classList.add('typing-effect', 'active');
        const chars = originalText.split('').map(char => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            element.appendChild(span);
            return span;
        });
        const caret = document.createElement('span');
        caret.className = 'caret visible'; caret.textContent = '_';
        element.appendChild(caret);
        let i = 0;
        const type = () => {
            if (i < chars.length) { chars[i].classList.add('visible'); i++; setTimeout(type, speed); }
            else { element.classList.add('finished'); caret.classList.remove('visible'); }
        };
        type();
    }

    function createMatrixTypingEffect(element, speed) {
        if (!element || !element.textContent) { console.warn('Elemento o texto no válido para matrix typing'); return; }
        const japaneseChars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ';
        const originalText = element.textContent.trim();
        element.innerHTML = '';
        element.classList.add('matrix-typing-effect', 'active');
        const chars = originalText.split('').map(char => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            element.appendChild(span);
            return span;
        });
        const createMatrixChar = (charEl) => {
            if (charEl.innerHTML === '&nbsp;') return;
            const mChar = document.createElement('span'); mChar.className = 'matrix-char';
            const rect = charEl.getBoundingClientRect(); const elRect = element.getBoundingClientRect();
            mChar.style.left=(rect.left-elRect.left)+'px'; mChar.style.top=(rect.top-elRect.top)+'px';
            mChar.textContent=japaneseChars[Math.floor(Math.random()*japaneseChars.length)];
            element.appendChild(mChar);
            let count = 0; const max = 3;
            const interval = setInterval(() => {
                mChar.textContent=japaneseChars[Math.floor(Math.random()*japaneseChars.length)]; count++;
                if(count>=max){clearInterval(interval); if(element.contains(mChar))element.removeChild(mChar);}
            },100);
        };
        let i = 0;
        const type = () => {
            if(i<chars.length){chars[i].classList.add('visible'); createMatrixChar(chars[i]); i++; setTimeout(type,speed);}
            else{element.classList.add('finished');}
        };
        type();
    }

    function createTitleFlameParticles(targetElement, numParticles, particleColors) {
        if (!targetElement) return;
        for (let i = 0; i < numParticles; i++) {
            const p = document.createElement('div'); p.classList.add('flame-particle');
            const s = Math.random()*4+2; const sX = Math.random()*targetElement.offsetWidth;
            const dur = Math.random()*2+2; const del = Math.random()*3;
            const c = particleColors[Math.floor(Math.random()*particleColors.length)];
            p.style.cssText = `width:${s}px; height:${s}px; left:${sX}px; background-color:${c}; animation-duration:${dur}s; animation-delay:${del}s;`;
            targetElement.appendChild(p);
        }
    }

    function initSparksForShowcase() {
        if (elements.showcaseCards) {
            elements.showcaseCards.forEach(card => card.addEventListener('mouseenter', () => createSparks(card, SPARK_QUANTITY_CARD_HOVER)));
        }
        if (elements.readMoreShowcaseButtons) {
            elements.readMoreShowcaseButtons.forEach(button => button.addEventListener('mouseenter', () => createSparks(button, SPARK_QUANTITY_BUTTON_HOVER)));
        }
    }
    
    function initSmoothScrollForAnchors() { // Para anchors genéricos, no los de la nav principal
        document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                smoothScrollTo(this.getAttribute('href'));
            });
        });
    }

    function initParallaxHeroScroll() {
        window.addEventListener('scroll', throttle(() => {
            if (elements.hero && !isLoading) {
                elements.hero.style.transform = `translateY(${window.pageYOffset * -0.3}px)`; // Usar -0.3 como en el app.js original
            }
        }, 16)); // 16ms para ~60fps
    }

    function checkCustomFonts() {
        if (!document.fonts) { console.warn("document.fonts API no soportada."); return; }
        document.fonts.ready.then(() => {
            if (document.fonts.check('1em Cinderblock')) {
                console.log('Fuente Cinderblock cargada.');
            } else {
                console.warn('Fuente Cinderblock NO cargada. Aplicando fallback.');
                if (elements.cinderblockFontTestElements) {
                    elements.cinderblockFontTestElements.forEach(el => el.style.fontFamily = 'Ethnocentric, sans-serif');
                }
            }
        }).catch(e => console.error("Error en document.fonts.ready:", e));
    }

    // ===== LOADING SCREEN ===== //
    const initLoadingScreen = () => {
        if (!elements.loadingScreen) return;
        const hide = () => {
            elements.loadingScreen.classList.add('hide');
            setTimeout(() => { elements.loadingScreen.style.display = 'none'; isLoading = false; }, 500);
        };
        if (document.readyState === 'complete') { setTimeout(hide, 200); } // Más rápido si ya está completo
        else { window.addEventListener('load', () => setTimeout(hide, 200), { once: true }); }
        setTimeout(() => { if(isLoading && elements.loadingScreen.style.display !== 'none') hide(); }, 3000); // Fallback
    };

    // ===== NAVIGATION ===== //
    const initNavigation = () => {
        if (elements.navToggle && elements.navMenu) {
            elements.navToggle.addEventListener('click', () => {
                elements.navToggle.classList.toggle('active');
                elements.navMenu.classList.toggle('active');
            });
        }
        if (elements.navLinks) {
            elements.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault(); smoothScrollTo(href);
                        if (elements.navMenu && elements.navMenu.classList.contains('active')) {
                            elements.navToggle.classList.remove('active');
                            elements.navMenu.classList.remove('active');
                        }
                    }
                });
            });
        }
        const updateActive = () => {
            const sections = document.querySelectorAll('section[id]');
            if (!sections.length || !elements.navLinks) return;
            const scrollPos = window.pageYOffset + (elements.navbar ? elements.navbar.offsetHeight : 0) + 50;
            sections.forEach(sec => {
                const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
                if (link) {
                    link.classList.toggle('active', scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight);
                }
            });
        };
        window.addEventListener('scroll', throttle(updateActive, 150)); updateActive();
    };

    // ===== SCROLL EFFECTS ===== //
    const initScrollEffects = () => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            if (elements.navbar) elements.navbar.classList.toggle('scrolled', currentScroll > SCROLL_THRESHOLD);
            if (elements.backToTop) elements.backToTop.classList.toggle('show', currentScroll > SCROLL_THRESHOLD * 3);
        };
        window.addEventListener('scroll', throttle(handleScroll, 100));
        if (elements.backToTop) elements.backToTop.addEventListener('click', () => smoothScrollTo('body'));
        initParallaxHeroScroll(); // El parallax del hero se maneja aquí
    };

    // ===== INTERSECTION OBSERVER ===== //
    const initIntersectionObserver = () => {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // obs.unobserve(entry.target); // Descomentar si la animación es de una sola vez
                }
            });
        }, observerOptions);
        const elementsToAnimate = document.querySelectorAll('.feature-card, .showcase-card, .about-item, .contact-item'); // Ampliado
        elementsToAnimate.forEach((el, index) => {
            el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`; // Sutil delay escalonado
            observer.observe(el);
        });
    };

    // ===== CONTACT FORM ===== //
    const initContactForm = () => {
        if (!elements.contactForm) return;
        const validateEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
        const showFormMessage = (message, isError = false) => {
            const existingMessage = elements.contactForm.querySelector('.form-message');
            if (existingMessage) existingMessage.remove();
            const messageDiv = document.createElement('div');
            messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
            messageDiv.textContent = message;
            messageDiv.style.cssText = `padding:1rem;margin-bottom:1rem;border-radius:8px;text-align:center;font-weight:500;background:${isError ? 'rgba(192,57,43,0.1)' : 'rgba(46,204,113,0.1)'};color:${isError ? '#C0392B' : '#2ECC71'};border:1px solid ${isError ? 'rgba(192,57,43,0.3)' : 'rgba(46,204,113,0.3)'};`;
            elements.contactForm.insertBefore(messageDiv, elements.submitButton);
            setTimeout(() => messageDiv.remove(), 5000);
        };
        elements.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(elements.contactForm);
            const data = Object.fromEntries(formData);
            if (!data.name?.trim()) { showFormMessage('Por favor, ingresa tu nombre.', true); return; }
            if (!validateEmail(data.email)) { showFormMessage('Por favor, ingresa un email válido.', true); return; }
            if (!data.message?.trim()) { showFormMessage('Por favor, describe tu proyecto.', true); return; }
            if(elements.submitButton) {elements.submitButton.classList.add('loading'); elements.submitButton.disabled = true;}
            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
                console.log('Form data:', data);
                showFormMessage('¡Mensaje enviado exitosamente! Te contactaremos pronto.');
                elements.contactForm.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.', true);
            } finally {
                if(elements.submitButton) {elements.submitButton.classList.remove('loading'); elements.submitButton.disabled = false;}
            }
        });
        const inputs = elements.contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
            input.addEventListener('blur', () => { if (!input.value.trim()) input.parentElement.classList.remove('focused'); });
        });
    };

    // ===== INITIALIZATION ===== //
    const initApp = () => {
        console.log("Fenix.Ninja App Initializing...");
        // Core initializations (mostly from original app.js)
        initLoadingScreen();
        initNavigation();
        initScrollEffects(); // Incluye parallax del hero
        initIntersectionObserver(); // Maneja la animación de entrada de tarjetas
        initContactForm();

        // 3D Models
        try { init3DLogo(); } catch (e) { console.error("Error initializing 3D Logo:", e); }
        try { initPhoenixCardModel(); } catch (e) { console.error("Error initializing Phoenix Card Model:", e); }
        try { initUnicornCardModel(); } catch (e) { console.error("Error initializing Unicorn Card Model:", e); }
        try { initFenixWingsCardModel(); } catch (e) { console.error("Error initializing Fenix Wings Card Model:", e); }

        // Particle Effects
        try { createHeroParticles(); } catch (e) { console.error("Error creating hero particles:", e); }
        try { createFeatureCardParticles(); } catch (e) { console.error("Error creating feature card particles:", e); }
        try {
            if (elements.mainTitles && elements.mainTitles.length > 0) {
                elements.mainTitles.forEach(titleEl => createTitleFlameParticles(titleEl, FLAME_PARTICLE_COUNT, FLAME_COLORS));
            }
        } catch (e) { console.error("Error creating title flame particles:", e); }
        
        // Text Animations
        try { if (elements.fontPreviews && elements.fontPreviews.length > 0) initFontTransitions(); } 
        catch (e) { console.error("Error initializing font transitions:", e); }
        
        if (elements.revolutionText) {
            try { createTypingEffect(elements.revolutionText, TYPING_EFFECT_SPEED); } 
            catch (e) { console.error("Error initializing typing effect for revolutionText:", e); }
        } else { console.warn('Element #revolution-text not found for typing effect.'); }

        if (elements.japaneseText) {
            try { createMatrixTypingEffect(elements.japaneseText, MATRIX_TYPING_EFFECT_SPEED); } 
            catch (e) { console.error("Error initializing matrix typing for japaneseText:", e); }
        } else { console.warn('Element #japanese-text not found for matrix typing effect.'); }
        
        // External Libraries/Scripts
        if (typeof setupNoiseButtons === 'function') {
            try { setupNoiseButtons(); } catch(e) { console.error("Error in setupNoiseButtons:", e); }
        } else { console.warn('setupNoiseButtons function is not defined. Ensure js/noise-buttons.js is loaded before app.js.'); }

        if (window.AICanvas && typeof AICanvas.init === 'function') {
            try { AICanvas.init(); } catch (e) { console.error("Error initializing AI Canvas:", e); }
        } else { console.warn('AICanvas.init is not available. Ensure js/ai-canvas.js is loaded before app.js.'); }

        // Other Initializations
        try { initSparksForShowcase(); } catch (e) { console.error("Error initializing sparks for showcase elements:", e); }
        initSmoothScrollForAnchors(); // Para anclas genéricas
        checkCustomFonts();
        console.log("Fenix.Ninja App Initialized.");
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

})();