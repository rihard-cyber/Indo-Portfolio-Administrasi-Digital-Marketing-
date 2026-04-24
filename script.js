document.addEventListener('DOMContentLoaded', () => {
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

    // Initialize VanillaTilt for 3D card effects (Only on Desktop)
    if (typeof VanillaTilt !== 'undefined' && window.innerWidth >= 992) {
        VanillaTilt.init(document.querySelectorAll(".glass-card, .glass-panel, .about-photo"), {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            scale: 1.02
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
    const clickableImages = document.querySelectorAll('.profile-img, .exp-img, .cert-img, .edu-img');

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
        img.addEventListener('click', function() {
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

    // Custom Cursor
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (cursorDot && cursorOutline) {
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

        // Hover effect for cursor
        const hoverables = document.querySelectorAll('a, .btn, .glass-card, .glass-panel, .menu-toggle, img, i');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
                cursorOutline.style.border = '1px solid rgba(6, 182, 212, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorOutline.style.border = '2px solid rgba(6, 182, 212, 0.5)';
            });
        });
    }

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
                roleElement.innerHTML += textToType.charAt(i);
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
            if(window.innerWidth < 992) return;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            if(window.innerWidth < 992) return;
            btn.style.transform = ''; 
        });
    });

    // Parallax effect for Glow Background
    const glowBg = document.querySelector('.glow-bg');
    if (glowBg) {
        document.addEventListener('mousemove', (e) => {
            if(window.innerWidth < 992) return;
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            glowBg.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Dynamic Stats Logic
    const currentYear = new Date().getFullYear();
    const startYear = 2018; // Tahun mulai bekerja (Job 1)
    const expStatEl = document.getElementById('stat-experience');
    if (expStatEl) {
        // Otomatis hitung tahun berjalan dikurang tahun mulai
        const yearsOfExp = Math.max(1, currentYear - startYear);
        const label = expStatEl.getAttribute('data-label') || '+ Tahun';
        expStatEl.innerText = `${yearsOfExp}${label}`;
    }

    const certCards = document.querySelectorAll('.cert-card');
    const certStatEl = document.getElementById('stat-certificates');
    if (certStatEl && certCards.length > 0) {
        // Otomatis hitung jumlah elemen sertifikat di DOM
        certStatEl.innerText = `${certCards.length}+`;
    }

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

});
