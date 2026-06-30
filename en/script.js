document.addEventListener('DOMContentLoaded', () => {
    // ===== BACKGROUND CANVAS: LINES + PARTICLES =====
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let W, H;

        const resize = () => {
            W = bgCanvas.width = window.innerWidth;
            H = bgCanvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const lineCount = isTouch ? 20 : 50;
        const particleCount = isTouch ? 30 : 70;

        // Layer 2: Falling Light Lines
        const lines = [];
        for (let i = 0; i < lineCount; i++) {
            lines.push({
                x: Math.random() * W,
                y: Math.random() * H,
                width: Math.random() * 2 + 0.5,
                height: Math.random() * 120 + 40,
                speed: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.35 + 0.1,
                hue: Math.random() > 0.5 ? 182 : 260,
            });
        }

        // Layer 3: Rising Particles
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 2.5 + 1,
                speed: Math.random() * 0.4 + 0.1,
                drift: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.1,
                hue: Math.random() > 0.5 ? 182 : 260,
            });
        }

        function drawBg() {
            ctx.clearRect(0, 0, W, H);

            // --- Layer 2: Falling Lines ---
            lines.forEach(line => {
                line.y += line.speed;
                if (line.y > H + line.height) {
                    line.y = -line.height;
                    line.x = Math.random() * W;
                }

                const gradient = ctx.createLinearGradient(line.x, line.y, line.x, line.y + line.height);
                gradient.addColorStop(0, `hsla(${line.hue}, 70%, 60%, 0)`);
                gradient.addColorStop(0.5, `hsla(${line.hue}, 70%, 60%, ${line.opacity})`);
                gradient.addColorStop(1, `hsla(${line.hue}, 70%, 60%, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(line.x, line.y, line.width, line.height);
            });

            // --- Layer 3: Rising Particles ---
            particles.forEach(p => {
                p.y -= p.speed;
                p.x += p.drift + Math.sin(p.y * 0.01) * 0.2;

                if (p.y < -10) {
                    p.y = H + 10;
                    p.x = Math.random() * W;
                }
                if (p.x < -10) p.x = W + 10;
                if (p.x > W + 10) p.x = -10;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`;
                ctx.fill();

                // Glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity * 0.15})`;
                ctx.fill();
            });

            requestAnimationFrame(drawBg);
        }

        drawBg();
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        });
    });

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Stop observing once it appears
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Card Reveal Animation (glow-border-card staggered entrance)
    const cardRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-revealed');
                cardRevealObserver.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    document.querySelectorAll('.glow-border-card').forEach(card => {
        cardRevealObserver.observe(card);
    });

    // Initialize VanillaTilt for 3D card effects (Only on Desktop)
    if (typeof VanillaTilt !== 'undefined' && window.innerWidth >= 992) {
        VanillaTilt.init(document.querySelectorAll(".glass-card, .glass-panel, .about-photo, .web-card, .cert-card, .timeline-content, .education-card"), {
            max: 12,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            scale: 1.02,
            perspective: 1200
        });
    }

    // Image/Video Modal (Lightbox) Logic
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn = document.getElementById('modalClose');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');
    const counter = document.getElementById('modalCounter');
    const clickableImages = document.querySelectorAll('.profile-img, .exp-img, .cert-img, .edu-img, .web-img');

    let currentGallery = [];
    let currentIndex = 0;

    const updateModal = () => {
        const fileSrc = currentGallery[currentIndex];
        const isVideo = fileSrc.match(/\.(mp4|webm|ogg)$/i);

        if (isVideo) {
            modalImg.style.display = 'none';
            modalImg.src = '';
            if (modalVideo) {
                modalVideo.style.display = 'block';
                modalVideo.src = fileSrc;
                modalVideo.play().catch(e => console.log('Autoplay blocked:', e));
            }
        } else {
            if (modalVideo) {
                modalVideo.style.display = 'none';
                modalVideo.pause();
                modalVideo.src = '';
            }
            modalImg.style.display = 'block';
            modalImg.src = fileSrc;
        }

        if (currentGallery.length > 1) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            counter.style.display = 'block';
            counter.innerText = `${currentIndex + 1} / ${currentGallery.length}`;
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            counter.style.display = 'none';
        }
    };

    // Open modal when image is clicked
    clickableImages.forEach(img => {
        img.addEventListener('click', function () {
            modal.classList.add('show');
            const galleryData = this.getAttribute('data-gallery');
            if (galleryData) {
                currentGallery = galleryData.split(',');
                currentIndex = 0;
            } else {
                currentGallery = [this.src];
                currentIndex = 0;
            }
            updateModal();
        });
    });

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateModal();
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateModal();
        });
    }

    // Helper to stop media
    const stopMedia = () => {
        modal.classList.remove('show');
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = '';
        }
    };

    // Close modal when close button is clicked
    closeBtn.addEventListener('click', () => {
        stopMedia();
    });

    // Close modal when clicking outside the media
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.id === 'modalMediaContainer') {
            stopMedia();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('show')) {
            if (e.key === 'Escape') {
                stopMedia();
            } else if (e.key === 'ArrowRight' && currentGallery.length > 1) {
                currentIndex = (currentIndex + 1) % currentGallery.length;
                updateModal();
            } else if (e.key === 'ArrowLeft' && currentGallery.length > 1) {
                currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
                updateModal();
            }
        }
    });

    // ===== NEW EFFECTS & ANIMATIONS =====

    // Custom Cursor (Only on Desktop Non-Touch Devices)
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 1024);

    if (cursorDot && cursorOutline) {
        if (isTouchDevice) {
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
        } else {
            window.addEventListener('mousemove', (e) => {
                const posX = e.clientX;
                const posY = e.clientY;

                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 150, fill: "forwards" });
            });

            // Hover effect class toggle for custom cursor outline (fully CSS styled)
            const hoverables = document.querySelectorAll('a, .btn, .glass-card, .glass-panel, .menu-toggle, img, i, .read-more-btn');
            hoverables.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.classList.add('cursor-hover');
                });
                el.addEventListener('mouseleave', () => {
                    cursorOutline.classList.remove('cursor-hover');
                });
            });
        }
    }

    // Expandable Content Toggle (Read More / Show Less) - Smooth Heights
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.previousElementSibling;
            if (content && content.classList.contains('expandable-content')) {
                content.classList.toggle('expanded');
                
                // Toggle text
                if (content.classList.contains('expanded')) {
                    button.innerText = 'Show Less';
                } else {
                    button.innerText = 'Read More';
                }
            }
        });
    });

    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${(totalScroll / windowHeight) * 100}%`;
            scrollProgress.style.width = scroll;
        });
    }

    // Typing Effect for Role
    const roleElement = document.querySelector('.role');
    if (roleElement) {
        const textToType = roleElement.innerText;
        roleElement.innerText = '';

        let i = 0;
        const typeWriter = () => {
            if (i < textToType.length) {
                roleElement.textContent += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 50); // Typing speed
            }
        };

        // Start typing effect slightly after page load
        setTimeout(typeWriter, 800);
    }

    // Magnetic Buttons
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 992) return;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            if (window.innerWidth < 992) return;
            btn.style.transform = '';
        });
    });

    // Parallax effect for Glow Background
    const glowBg = document.querySelector('.glow-bg');
    if (glowBg) {
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 992) return;
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            glowBg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Dynamic Stats Logic
    const currentYear = new Date().getFullYear();
    const startYear = 2018;
    const expStatEl = document.getElementById('stat-experience');
    if (expStatEl) {
        const yearsOfExp = Math.max(1, currentYear - startYear);
        const label = expStatEl.getAttribute('data-label') || '+ Years';
        expStatEl.innerText = `${yearsOfExp}${label}`;
    }

    const certCards = document.querySelectorAll('.cert-card');
    const certStatEl = document.getElementById('stat-certificates');
    if (certStatEl && certCards.length > 0) {
        certStatEl.innerText = `${certCards.length}+`;
    }

    // ===== ANIMATED COUNTERS =====
    function animateCounter(el, target, suffix = '') {
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            current = Math.min(current + increment, target);
            el.textContent = Math.floor(current) + suffix;
            if (step >= steps) {
                el.textContent = target + suffix;
                clearInterval(timer);
            }
        }, duration / steps);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.trim();
                const match = text.match(/^(\d+)(\+)?/);
                if (match) {
                    const target = parseInt(match[1]);
                    const suffix = match[2] || '';
                    el.textContent = '0';
                    animateCounter(el, target, suffix);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

    // ===== SMOOTH SECTION REVEAL =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.section').forEach(s => revealObserver.observe(s));

    // ===== Theme Switcher Logic =====
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const themeIcon = themeBtn.querySelector('i');

        let currentTheme = localStorage.getItem('theme') || 'dark';

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme'); // default
                themeIcon.className = 'ph ph-moon';
            } else {
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'light') {
                    themeIcon.className = 'ph ph-sun';
                } else if (theme === 'neon') {
                    themeIcon.className = 'ph ph-lightning';
                }
            }
            localStorage.setItem('theme', theme);
        };

        if (currentTheme !== 'dark') {
            applyTheme(currentTheme);
        }

        themeBtn.addEventListener('click', () => {
            if (currentTheme === 'dark') {
                currentTheme = 'light';
            } else if (currentTheme === 'light') {
                currentTheme = 'neon';
            } else {
                currentTheme = 'dark';
            }
            applyTheme(currentTheme);
        });
    }

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all fields.';
                formStatus.className = 'form-status error';
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                formStatus.textContent = 'Please enter a valid email address.';
                formStatus.className = 'form-status error';
                return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ph ph-spinner" style="margin-right:8px;animation:spin 1s linear infinite;"></i>Sending...';
            btn.disabled = true;

            try {
                // TODO: Ganti dengan Formspree form ID kamu. Daftar gratis di https://formspree.io
                const response = await fetch('https://formspree.io/f/xdavjwqq', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                    formStatus.className = 'form-status';
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send');
                }
            } catch {
                formStatus.textContent = 'Could not send message. Please email me directly at richardpl.meha@gmail.com';
                formStatus.className = 'form-status error';
            }

            btn.replaceChildren();
            btn.insertAdjacentHTML('beforeend', originalText);
            btn.disabled = false;
        });
    }

    // Skeleton loader - remove after page load
    const skeletons = document.querySelectorAll('.skeleton-card');
    if (skeletons.length) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                skeletons.forEach(s => s.remove());
            }, 600);
        });
    }

    // Keyboard: Escape closes modal
    // (already handled in modal code above)

    // Preserve scroll on back button (BFCache)
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            // Page was restored from BFCache — scroll already preserved
        }
    });

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => {
                // SW registration failed silently
            });
        });
    }

});
