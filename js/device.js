// רישום GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initDeviceAnimations();
    initNotifications();
});

// אנימציות ראשיות
function initDeviceAnimations() {
    // אנימציית טקסט
    gsap.from('#device .text-white > *', {
        scrollTrigger: {
            trigger: '#device',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // אנימציית המכשיר
    gsap.from('.device-container img', {
        scrollTrigger: {
            trigger: '#device',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
    });
}

// אנימציית התראות
function initNotifications() {
    const notifications = document.querySelectorAll('.notification');
    
    // הוספת קלאס show בהדרגה
    notifications.forEach((notification, index) => {
        setTimeout(() => {
            notification.classList.add('show');
        }, 1000 + (index * 200));
    });

    // אנימציית ScrollTrigger להתראות
    gsap.from('.notification', {
        scrollTrigger: {
            trigger: '#device',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
}

// אפקט Parallax
ScrollTrigger.create({
    trigger: '#device',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: self => {
        gsap.to('.device-container', {
            y: self.progress * 50,
            duration: 0
        });
    }
}); 