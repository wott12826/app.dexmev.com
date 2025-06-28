// Mobile Device Detection and Blocker
(function() {
    'use strict';
    
    // Function to detect mobile devices
    function isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for mobile user agents
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        
        // Check screen size
        const isSmallScreen = window.innerWidth <= 768;
        
        // Check touch capability
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Check if device is mobile based on user agent or screen size
        return mobileRegex.test(userAgent) || (isSmallScreen && hasTouchScreen);
    }
    
    // Function to create and show the mobile blocker modal
    function showMobileBlocker() {
        // Remove any existing modal
        const existingModal = document.getElementById('mobile-blocker-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'mobile-blocker-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #1f2023 0%, #27282c 100%);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            overflow: hidden;
        `;
        
        // Create modal content
        const content = document.createElement('div');
        content.style.cssText = `
            text-align: center;
            padding: 2rem;
            max-width: 90vw;
            animation: fadeIn 0.5s ease-out;
        `;
        
        // Create icon
        const icon = document.createElement('div');
        icon.innerHTML = '💻';
        icon.style.cssText = `
            font-size: 4rem;
            margin-bottom: 1.5rem;
            animation: bounce 2s infinite;
        `;
        
        // Create title
        const title = document.createElement('h1');
        title.textContent = 'Desktop Only';
        title.style.cssText = `
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        `;
        
        // Create message
        const message = document.createElement('p');
        message.textContent = 'This application functionality is available only on desktop version of the website.';
        message.style.cssText = `
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            color: #a0a0a0;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        `;
        
        // Create additional info
        const info = document.createElement('p');
        info.textContent = 'Please access this application from a desktop computer or laptop for the best experience.';
        info.style.cssText = `
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 2rem;
        `;
        
        // Create close button (for testing purposes)
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close (Desktop Only)';
        closeBtn.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0.7;
        `;
        
        closeBtn.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
            this.style.transform = 'translateY(-2px)';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.opacity = '0.7';
            this.style.transform = 'translateY(0)';
        });
        
        closeBtn.addEventListener('click', function() {
            // Only allow closing if not on mobile
            if (!isMobileDevice()) {
                modal.remove();
            }
        });
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            #mobile-blocker-modal {
                backdrop-filter: blur(10px);
            }
        `;
        
        // Assemble modal
        content.appendChild(icon);
        content.appendChild(title);
        content.appendChild(message);
        content.appendChild(info);
        content.appendChild(closeBtn);
        modal.appendChild(content);
        
        // Add to page
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
        
        // Prevent any interaction with background elements
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Prevent escape key from closing modal on mobile
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMobileDevice()) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
    
    // Function to handle resize events
    function handleResize() {
        if (isMobileDevice()) {
            showMobileBlocker();
        } else {
            const modal = document.getElementById('mobile-blocker-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        }
    }
    
    // Initialize when DOM is ready
    function init() {
        if (isMobileDevice()) {
            showMobileBlocker();
        }
        
        // Listen for resize events
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', function() {
            setTimeout(handleResize, 100);
        });
    }
    
    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for potential external use
    window.MobileBlocker = {
        isMobileDevice: isMobileDevice,
        showMobileBlocker: showMobileBlocker
    };
})(); 