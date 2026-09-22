/* ==========================================================================
   INTERATIVIDADE & ANIMAÇÕES (JS CORRIGIDO)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 0. GSAP & SCROLLTRIGGER
    // ----------------------------------------------------------------------
    const hasGSAP = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

    if (hasGSAP && hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ----------------------------------------------------------------------
    // 1. ANIMAÇÃO DE CONTADOR DAS MÉTRICAS
    // ----------------------------------------------------------------------
    if (hasGSAP && hasScrollTrigger) {
        const metricNumbers = document.querySelectorAll('.metric-number');

        metricNumbers.forEach((el) => {
            const targetValue = parseFloat(el.getAttribute('data-target')) || 0;
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;

            const counterObj = { val: 0 };

            gsap.to(counterObj, {
                val: targetValue,
                duration: 2.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                onUpdate: () => {
                    let formattedNum;
                    if (decimals > 0) {
                        formattedNum = counterObj.val.toFixed(decimals).replace('.', ',');
                    } else if (counterObj.val >= 1000) {
                        formattedNum = Math.floor(counterObj.val).toLocaleString('pt-BR');
                    } else {
                        formattedNum = Math.floor(counterObj.val);
                    }
                    el.textContent = `${prefix}${formattedNum}${suffix}`;
                }
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. PRELOADER & ROLAGEM
    // ----------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            document.body.style.overflow = '';

            if (hasGSAP) {
                gsap.from('.hero-content > *', {
                    opacity: 0,
                    y: 30,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out',
                    clearProps: 'all'
                });
            }

            if (hasScrollTrigger) {
                setTimeout(() => ScrollTrigger.refresh(), 100);
            }
        }
    }, 1800);

    // ----------------------------------------------------------------------
    // 3. MENU MOBILE
    // ----------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMobileMenu();
        });
    }

    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // ----------------------------------------------------------------------
    // 4. SMOOTH SCROLL (LENIS)
    // ----------------------------------------------------------------------
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (hasScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
        }
    }

    // ----------------------------------------------------------------------
    // 5. CURSOR MAGNÉTICO
    // ----------------------------------------------------------------------
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 400, fill: "forwards" });
        });

        const interactiveElements = document.querySelectorAll('a, button, input, .bento-card, .service-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // ----------------------------------------------------------------------
    // 6. ILHA DINÂMICA NO HEADER
    // ----------------------------------------------------------------------
    const header = document.getElementById('header');
    const heroSection = document.getElementById('inicio');

    if (header && heroSection) {
        const checkScroll = () => {
            if (window.scrollY >= 80) {
                header.classList.add('island');
            } else {
                header.classList.remove('island');
            }
        };

        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
    }

    // ----------------------------------------------------------------------
    // 7. COMPARADOR ANTES E DEPOIS
    // ----------------------------------------------------------------------
    const sliderInput = document.getElementById('before-after-input');
    const afterImage = document.getElementById('after-image');
    const sliderHandle = document.getElementById('slider-handle');

    if (sliderInput && afterImage && sliderHandle) {
        sliderInput.addEventListener('input', (e) => {
            const value = e.target.value;
            afterImage.style.width = `${value}%`;
            sliderHandle.style.left = `${value}%`;
        });
    }

    // ----------------------------------------------------------------------
    // 8. UNIFICAÇÃO DE ANIMAÇÕES REVEAL (GSAP)
    // ----------------------------------------------------------------------
    if (hasGSAP && hasScrollTrigger) {
        const revealElements = document.querySelectorAll(
            '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale'
        );

        revealElements.forEach((el) => {
            const delayValue = parseFloat(el.getAttribute('data-delay')) || 0;
            let fromProps = { opacity: 0 };

            if (el.classList.contains('reveal-down')) {
                fromProps.y = -40;
            } else if (el.classList.contains('reveal-left')) {
                fromProps.x = -40;
            } else if (el.classList.contains('reveal-right')) {
                fromProps.x = 40;
            } else if (el.classList.contains('reveal-scale')) {
                fromProps.scale = 0.95;
            } else {
                fromProps.y = 40;
            }

            gsap.fromTo(el, 
                fromProps, 
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    delay: delayValue,
                    ease: 'power2.out',
                    clearProps: 'all',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

});

window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const swiperEspecialidades = new Swiper('.swiper-especialidades', {
        // Quantidade de slides visíveis por resolução
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true, // Giro infinito
        grabCursor: true, // Transforma o cursor numa mãozinha de arrastar no PC

        // Rotação Automática
        autoplay: {
            delay: 3500, // Tempo de pausa entre cada transição (3.5 segundos)
            disableOnInteraction: false, // CONTINUA rodando após o usuário arrastar ou clicar
            pauseOnMouseEnter: true, // Pausa temporariamente enquanto o mouse estiver sobre o card
        },

        // Velocidade da transição de deslize
        speed: 800,

        // Pontinhos de navegação
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // Setas de navegação
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Adaptabilidade Responsiva
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
    });
});