/* ============================================
   Rikash Gebeya - Facebook Blue Theme
   Unified JavaScript for All 7 Pages
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 1. MOBILE MENU TOGGLE FUNCTIONALITY
    // ============================================
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Optional: Change toggle icon based on menu state
            const isExpanded = navMenu.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
            mobileToggle.innerHTML = isExpanded ? '✕' : '☰';
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = mobileToggle.contains(event.target) || navMenu.contains(event.target);
            if (!isClickInside && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '☰';
            }
        });
        
        // Close mobile menu when window is resized above mobile breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '☰';
            }
        });
    }
    
    // ============================================
    // 2. ACTIVE NAVIGATION HIGHLIGHTING
    // ============================================
    function setActiveNavItem() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu li a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref ? linkHref.split('/').pop() : '';
            
            // Remove active class from all parent li elements
            const parentLi = link.closest('li');
            if (parentLi) {
                parentLi.classList.remove('active');
            }
            
            // Add active class if current page matches link
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === '/' && linkPage === 'index.html')) {
                if (parentLi) {
                    parentLi.classList.add('active');
                }
            }
        });
    }
    
    setActiveNavItem();
    
    // ============================================
    // 3. CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const message = document.getElementById('message')?.value || '';
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual API call if needed)
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ============================================
    // 4. NOTIFICATION SYSTEM (Toast Messages)
    // ============================================
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#1877f2'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Lato', sans-serif;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
            cursor: pointer;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
        
        // Allow clicking to dismiss
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Add animation styles dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // ============================================
    // 5. SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // 6. LAZY LOADING IMAGES (Performance)
    // ============================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ============================================
    // 7. ADD FADE-IN ANIMATION ON SCROLL
    // ============================================
    const fadeElements = document.querySelectorAll('.split-section, .feature-card, .product-card, .contact-card');
    
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(element => {
            element.style.opacity = '0';
            fadeObserver.observe(element);
        });
        
        // Update fade-in animation when class is added
        const fadeStyle = document.createElement('style');
        fadeStyle.textContent = `
            .fade-in {
                animation: fadeInUp 0.6s ease forwards;
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(fadeStyle);
    } else {
        // Fallback for older browsers
        fadeElements.forEach(element => {
            element.style.opacity = '1';
        });
    }
    
    // ============================================
    // 8. PRODUCT CARD CLICK HANDLER (Shop Page)
    // ============================================
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productName = this.querySelector('h3')?.textContent || 'Product';
            showNotification(`Coming soon! ${productName} will be available shortly.`, 'info');
        });
    });
    
    // ============================================
    // 9. PAYMENT METHOD CLICK HANDLER (Payment Page)
    // ============================================
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodName = this.querySelector('span')?.textContent || 'This payment method';
            showNotification(`${methodName} will be available soon! We're working on integrating it.`, 'info');
        });
    });
    
    // ============================================
    // 10. SCROLL TO TOP BUTTON (Optional)
    // ============================================
    // Create scroll to top button if page is long
    function createScrollToTopButton() {
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background-color: var(--pure-white, white);
            color: var(--fb-blue, #1877f2);
            border: none;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 999;
        `;
        
        document.body.appendChild(scrollBtn);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Only add scroll button if page height is significant
    if (document.body.scrollHeight > window.innerHeight * 1.5) {
        createScrollToTopButton();
    }
    
    // ============================================
    // 11. DYNAMIC YEAR IN FOOTER
    // ============================================
    const footerElement = document.querySelector('.footer .footer-content');
    if (footerElement) {
        const currentYear = new Date().getFullYear();
        const footerText = footerElement.innerHTML;
        if (footerText.includes('© 2026')) {
            footerElement.innerHTML = footerText.replace('2026', currentYear);
        }
    }
    
    // ============================================
    // 12. CONSOLE WELCOME MESSAGE (Developer Friendly)
    // ============================================
    console.log('%c🚀 Rikash Gebeya | Facebook Blue Theme', 'color: #1877f2; font-size: 16px; font-weight: bold;');
    console.log('%cWebsite is ready! All 7 pages are styled with Facebook blue theme.', 'color: #1464c7; font-size: 12px;');
    
    // ============================================
    // 13. PREVENT FORM RESUBMISSION ON PAGE REFRESH
    // ============================================
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
    
});

// ============================================
// 14. SERVICE WORKER REGISTRATION (Optional for PWA)
// ============================================
// Uncomment if you want to add PWA capabilities
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
*/