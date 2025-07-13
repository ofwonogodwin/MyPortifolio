// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');

// Theme Management
class ThemeManager {
    constructor() {
        this.initTheme();
        this.bindEvents();
    }

    initTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }
    }

    bindEvents() {
        themeSwitch.addEventListener('change', () => {
            if (themeSwitch.checked) {
                this.enableDarkMode();
            } else {
                this.enableLightMode();
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.enableLightMode();
                }
            }
        });
    }

    enableDarkMode() {
        document.body.classList.add('dark-mode');
        themeSwitch.checked = true;
        localStorage.setItem('theme', 'dark');
    }

    enableLightMode() {
        document.body.classList.remove('dark-mode');
        themeSwitch.checked = false;
        localStorage.setItem('theme', 'light');
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveNavLink();
        });
    }

    toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;

        // Show/hide back to top button
        if (scrollTop > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Add shadow to navbar on scroll
        const navbar = document.querySelector('.navbar');
        if (scrollTop > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }

    updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;

        navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const elementTop = targetElement.offsetTop;
                const elementBottom = elementTop + targetElement.offsetHeight;

                if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
}

// Animation Management
class AnimationManager {
    constructor() {
        this.observeElements();
        this.initScrollAnimations();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.about-card, .project-card, .contact-card');
        animatedElements.forEach(el => observer.observe(el));
    }

    initScrollAnimations() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-image');

            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Typing animation for hero title
        this.typeWriter();
    }

    typeWriter() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid';

        let i = 0;
        const timer = setInterval(() => {
            heroTitle.textContent += text.charAt(i);
            i++;

            if (i > text.length) {
                clearInterval(timer);
                heroTitle.style.borderRight = 'none';
            }
        }, 50);
    }
}

// Utility Functions
class UtilityManager {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Back to top button
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Add hover effects to cards
        this.addCardEffects();

        // Initialize contact form handling
        this.handleContactInteractions();

        // Add loading states to external links
        this.handleExternalLinks();

        // Add copy email functionality
        this.addCopyEmailFunction();
    }

    addCardEffects() {
        const cards = document.querySelectorAll('.about-card, .project-card, .contact-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    handleContactInteractions() {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

        emailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Show a toast message or feedback
                this.showNotification('Opening email client...', 'info');
            });
        });
    }

    handleExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="#"]');

        externalLinks.forEach(link => {
            if (link.href.startsWith('http') && !link.href.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');

                link.addEventListener('click', () => {
                    this.showNotification('Opening external link...', 'info');
                });
            }
        });
    }

    addCopyEmailFunction() {
        const emailElements = document.querySelectorAll('.contact-card p');

        emailElements.forEach(element => {
            if (element.textContent.includes('@')) {
                element.style.cursor = 'pointer';
                element.title = 'Click to copy email';

                element.addEventListener('click', () => {
                    const email = element.textContent.trim();
                    this.copyToClipboard(email);
                });
            }
        });
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Email copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy email', 'error');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Performance and Accessibility
class PerformanceManager {
    constructor() {
        this.optimizeImages();
        this.addKeyboardNavigation();
        this.handleReducedMotion();
    }

    optimizeImages() {
        // Add lazy loading to images if any are added later
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }

    addKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // ESC key closes mobile menu
            if (e.key === 'Escape') {
                const navManager = new NavigationManager();
                navManager.closeMobileMenu();
            }

            // Enter/Space on focusable elements
            if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('focusable')) {
                e.preventDefault();
                e.target.click();
            }
        });

        // Add focus styles for keyboard navigation
        const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--primary-color)';
                element.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
    }

    handleReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-medium', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
    }
}

// Custom Cursor Effect (Optional Enhancement)
class CursorManager {
    constructor() {
        this.createCustomCursor();
    }

    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';

        Object.assign(cursor.style, {
            width: '20px',
            height: '20px',
            border: '2px solid var(--primary-color)',
            borderRadius: '50%',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: '9999',
            transition: 'transform 0.1s ease',
            transform: 'translate(-50%, -50%)',
            opacity: '0'
        });

        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Scale cursor on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'var(--primary-color)';
                cursor.style.opacity = '0.3';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.opacity = '1';
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const animationManager = new AnimationManager();
    const utilityManager = new UtilityManager();
    const performanceManager = new PerformanceManager();

    // Initialize custom cursor only on desktop
    if (window.innerWidth > 768) {
        const cursorManager = new CursorManager();
    }

    // Add loading class removal after page load
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Console message for developers
    console.log(`
    🚀 Welcome to Godwin's Portfolio!
    
    This portfolio was built with:
    ✨ Vanilla JavaScript
    🎨 Modern CSS with Custom Properties
    📱 Responsive Design
    🌙 Dark Mode Support
    ♿ Accessibility Features
    
    Feel free to explore the code!
    `);
});

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Error handling for production
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }, 0);
    });
}
