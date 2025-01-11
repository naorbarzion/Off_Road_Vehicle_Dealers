// רישום פלאגין GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// פונקציות עזר
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// אנימציות גלובליות
function initGlobalAnimations() {
    // אנימציה לכל האלמנטים עם הקלאס animate-on-scroll
    gsap.utils.toArray('.animate-on-scroll').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });
}

// טיפול בתפריט נייד
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuButton.classList.toggle('active');
        });
    }
}

// טיפול בגלילה חלקה
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// אופטימיזציה לטעינת תמונות
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// אתחול כל הפונקציונליות בטעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    initGlobalAnimations();
    initMobileMenu();
    initSmoothScroll();
    lazyLoadImages();
}); 