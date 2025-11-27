
'use strict';

const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const mobileToggle = document.getElementById('mobileToggle');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section[id]');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const skillProgressBars = document.querySelectorAll('.skill-progress');

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    createParticles();
    initScrollAnimations();
    animateSkillBars();
});

function initializeApp() {
    loadTheme();
    
    setupEventListeners();
    
    handleScroll();
    
    addFadeInClass();
    
}

function setupEventListeners() {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', updateActiveNav);
    
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (backToTop) {
        backToTop.addEventListener('click', scrollToTop);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', validateInput);
            input.addEventListener('blur', validateInput);
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    if (scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    revealOnScroll();
}

function handleNavClick(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    }
}

function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    
    const icon = themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    body.style.transition = 'background 0.5s ease, color 0.5s ease';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-sun';
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    let errors = [];
    
    if (name.length < 3) {
        errors.push('Ism kamida 3 ta belgidan iborat bo\'lishi kerak!');
        isValid = false;
    }
    
    if (!isValidEmail(email)) {
        errors.push('Email manzili noto\'g\'ri formatda!');
        isValid = false;
    }
    
    if (subject.length < 3) {
        errors.push('Mavzu kamida 3 ta belgidan iborat bo\'lishi kerak!');
        isValid = false;
    }
    
    if (message.length < 10) {
        errors.push('Xabar kamida 10 ta belgidan iborat bo\'lishi kerak!');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('error', errors.join('\n'));
        return;
    }
    
    showNotification('success', '✅ Xabaringiz muvaffaqiyatli yuborildi!\nTez orada siz bilan bog\'lanamiz.');
    
    contactForm.reset();
    
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
    
    console.log('Form Data:', { name, email, subject, message });
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    let isValid = true;
    
    switch (name) {
        case 'name':
            isValid = value.length >= 3;
            break;
        case 'email':
            isValid = isValidEmail(value);
            break;
        case 'subject':
            isValid = value.length >= 3;
            break;
        case 'message':
            isValid = value.length >= 10;
            break;
    }
    
    input.style.borderColor = value === '' ? '' : 
        isValid ? 'var(--lime-green)' : '#ff4444';
    
    const icon = input.parentElement.querySelector('.input-icon');
    if (icon) {
        icon.style.color = value === '' ? '' : 
            isValid ? 'var(--lime-green)' : '#ff4444';
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        max-width: 400px;
        padding: 1.5rem 2rem;
        background: ${type === 'success' ? 
            'linear-gradient(135deg, #32CD32, #7FFF00)' : 
            'linear-gradient(135deg, #ff4444, #ff6666)'};
        color: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        font-weight: 500;
        white-space: pre-line;
        line-height: 1.6;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
    
    alert(message);
}

function handleFilterClick(e) {
    const filterValue = this.getAttribute('data-filter');
    
    filterBtns.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    
    portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function animateSkillBars() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 200);
                
                observer.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    skillProgressBars.forEach(bar => observer.observe(bar));
}

function addFadeInClass() {
    const elements = document.querySelectorAll(`
        .about-card,
        .skill-category,
        .portfolio-card,
        .info-card,
        .contact-form-wrapper
    `);
    
    elements.forEach(el => el.classList.add('fade-in'));
}

function revealOnScroll() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(127, 255, 0, 0.8), transparent);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: float ${duration}s ease-in-out ${delay}s infinite;
            pointer-events: none;
            filter: blur(1px);
        `;
        
        particlesContainer.appendChild(particle);
    }
}

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };
    smoothScrollPolyfill();
}

function initCursorGlow() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(127, 255, 0, 0.5), transparent);
        pointer-events: none;
        z-index: 9999;
        filter: blur(10px);
        transition: transform 0.2s ease;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    if (window.innerWidth < 768) {
        cursor.style.display = 'none';
    }
}

if (window.innerWidth >= 768) {
    initCursorGlow();
}

window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`%c⚡ Page loaded in ${Math.round(loadTime)}ms`, 
        'color: #7FFF00; font-weight: bold;');
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    if ((e.key === ' ' || e.key === 'Enter') && e.target === themeToggle) {
        e.preventDefault();
        toggleTheme();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        validateInput,
        handleFormSubmit
    };
}
