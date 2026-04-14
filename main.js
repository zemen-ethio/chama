/* ============================================
   Rikash Gebeya - Facebook Blue Theme
   Unified JavaScript for All 7 Pages
   WITH INFINITE RIGHT-TO-LEFT SCROLL
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // 0. SETUP INFINITE SCROLL WRAPPER
    // ============================================
    function setupInfiniteScroll() {
        // Get the body element
        const body = document.body;
        
        // Get all direct children of body (excluding script tags)
        const bodyChildren = Array.from(body.children).filter(child => child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE');
        
        // Create wrapper div
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'scroll-wrapper';
        
        // Create scroll container
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'scroll-container';
        
        // Create first content copy
        const contentOriginal = document.createElement('div');
        contentOriginal.className = 'page-content-wrapper';
        
        // Move all body children into contentOriginal
        bodyChildren.forEach(child => {
            contentOriginal.appendChild(child);
        });
        
        // Create duplicate content for seamless looping
        const contentDuplicate = document.createElement('div');
        contentDuplicate.className = 'page-content-wrapper';
        contentDuplicate.innerHTML = contentOriginal.innerHTML;
        
        // Append both to scroll container
        scrollContainer.appendChild(contentOriginal);
        scrollContainer.appendChild(contentDuplicate);
        
        // Append scroll container to wrapper
        scrollWrapper.appendChild(scrollContainer);
        
        // Clear body and add wrapper
        while (body.firstChild) {
            body.removeChild(body.firstChild);
        }
        body.appendChild(scrollWrapper);
        
        // Re-attach event listeners after DOM manipulation
        reattachEventListeners();
    }
    
    // Function to reattach event listeners after content duplication
    function reattachEventListeners() {
        // Re-run all initialization functions
        initMobileMenu();
        initActiveNav();
        initContactForm();
        initProductCards();
        initPaymentMethods();
        initScrollToTop();
        initFadeAnimations();
        initDynamicFooterYear();
    }
    
    // ============================================
    // 1. MOBILE MENU TOGGLE FUNCTIONALITY
    // ============================================
    function initMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileToggle && navMenu) {
            // Remove existing event listeners by cloning and replacing
            const newToggle = mobileToggle.cloneNode(true);
            mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
            const newNavMenu = navMenu.cloneNode(true);
            navMenu.parentNode.replaceChild(newNavMenu, navMenu);
            
            const finalToggle = document.getElementById('mobileMenuToggle');
            const finalNavMenu = document.getElementById('navMenu');
            
            if (finalToggle && finalNavMenu) {
                finalToggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    finalNavMenu.classList.toggle('active');
                    finalToggle.setAttribute('aria-expanded', finalNavMenu.classList.contains('active'));
                    finalToggle.innerHTML = finalNavMenu.classList.contains('active') ? '✕' : '☰';
                });
                
                // Close when clicking outside
                document.addEventListener('click', function(event) {
                    if (finalNavMenu && finalToggle) {
                        const isClickInside = finalToggle.contains(event.target) || finalNavMenu.contains(event.target);
                        if (!isClickInside && finalNavMenu.classList.contains('active')) {
                            finalNavMenu.classList.remove('active');
                            finalToggle.setAttribute('aria-expanded', 'false');
                            finalToggle.innerHTML = '☰';
                        }
                    }
                });
                
                // Close on resize
                window.addEventListener('resize', function() {
                    if (window.innerWidth > 768 && finalNavMenu.classList.contains('active')) {
                        finalNavMenu.classList.remove('active');
                        finalToggle.setAttribute('aria-expanded', 'false');
                        finalToggle.innerHTML = '☰';
                    }
                });
            }
        }
    }
    
    // ============================================
    // 2. ACTIVE NAVIGATION HIGHLIGHTING
    // ============================================
    function initActiveNav() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu li a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref ? linkHref.split('/').pop() : '';
            const parentLi = link.closest('li');
            
            if (parentLi) {
                parentLi.classList.remove('active');
            }
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === '/' && linkPage === 'index.html')) {
                if (parentLi) {
                    parentLi.classList.add('active');
                }
            }
        });
    }
    
    // ============================================
    // 3. CONTACT FORM HANDLING
    // ============================================
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            // Remove existing listener
            const newForm = contactForm.cloneNode(true);
            contactForm.parentNode.replaceChild(newForm, contactForm);
            
            const finalForm = document.getElementById('contactForm');
            if (finalForm) {
                finalForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const name = document.getElementById('name')?.value || '';
                    const email = document.getElementById('email')?.value || '';
                    const message = document.getElementById('message')?.value || '';
                    
                    if (!name || !email || !message) {
                        showNotification('Please fill in all required fields.', 'error');
                        return;
                    }
                    
                    if (!isValidEmail(email)) {
                        showNotification('Please enter a valid email address.', 'error');
                        return;
                    }
                    
                    showNotification('Thank you for your message! We will get back to you soon.', 'success');
                    finalForm.reset();
                });
            }
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ============================================
    // 4. NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
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
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
            cursor: pointer;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
        
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Add animation styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // ============================================
    // 5. PRODUCT CARD CLICK HANDLER
    // ============================================
    function initProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            newCard.addEventListener('click', function() {
                const productName = this.querySelector('h3')?.textContent || 'Product';
                showNotification(`Coming soon! ${productName} will be available shortly.`, 'info');
            });
        });
    }
    
    // ============================================
    // 6. PAYMENT METHOD CLICK HANDLER
    // ============================================
    function initPaymentMethods() {
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            const newMethod = method.cloneNode(true);
            method.parentNode.replaceChild(newMethod, method);
            newMethod.addEventListener('click', function() {
                const methodName = this.querySelector('span')?.textContent || 'This payment method';
                showNotification(`${methodName} will be available soon! We're working on integrating it.`, 'info');
            });
        });
    }
    
    // ============================================
    // 7. SCROLL TO TOP BUTTON
    // ============================================
    function initScrollToTop() {
        if (document.body.scrollHeight > window.innerHeight * 1.5) {
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
    
    // ============================================
    // 8. FADE-IN ANIMATIONS ON SCROLL
    // ============================================
    function initFadeAnimations() {
        const fadeElements = document.querySelectorAll('.split-section, .feature-card, .product-card, .contact-card');
        
        if ('IntersectionObserver' in window) {
            fadeElements.forEach(element => {
                element.style.opacity = '0';
            });
            
            const fadeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        fadeObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            fadeElements.forEach(element => fadeObserver.observe(element));
            
            const fadeStyle = document.createElement('style');
            fadeStyle.textContent = `
                .fade-in {
                    animation: fadeInUp 0.6s ease forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(fadeStyle);
        } else {
            fadeElements.forEach(element => element.style.opacity = '1');
        }
    }
    
    // ============================================
    // 9. DYNAMIC YEAR IN FOOTER
    // ============================================
    function initDynamicFooterYear() {
        const footerElement = document.querySelector('.footer .footer-content');
        if (footerElement) {
            const currentYear = new Date().getFullYear();
            const footerText = footerElement.innerHTML;
            if (footerText.includes('2026')) {
                footerElement.innerHTML = footerText.replace('2026', currentYear);
            }
        }
    }
    
    // ============================================
    // 10. SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    function initSmoothScroll() {
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
    }
    
    // ============================================
    // INITIALIZE EVERYTHING
    // ============================================
    
    // First, setup the infinite scroll wrapper
    setupInfiniteScroll();
    
    // Then initialize all components (they will be reattached)
    setTimeout(() => {
        initMobileMenu();
        initActiveNav();
        initContactForm();
        initProductCards();
        initPaymentMethods();
        initScrollToTop();
        initFadeAnimations();
        initDynamicFooterYear();
        initSmoothScroll();
    }, 100);
    
    // Console welcome message
    console.log('%c🚀 Rikash Gebeya | Facebook Blue Theme | Infinite Scroll Active', 'color: #1877f2; font-size: 16px; font-weight: bold;');
    console.log('%cThe page is scrolling infinitely from right to left! Hover to pause.', 'color: #1464c7; font-size: 12px;');
    
    // Prevent form resubmission
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
    
});
