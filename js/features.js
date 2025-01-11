// מחכה שהדף ייטען במלואו
document.addEventListener('DOMContentLoaded', () => {
    // GSAP ScrollTrigger הגדרת
    gsap.registerPlugin(ScrollTrigger);

    // אנימציית כותרת
    gsap.from('.section-title', {
        scrollTrigger: {
            trigger: '.features-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1
    });

    // אנימציית כרטיסי יתרונות
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1
        });
    });

    // אנימציית אייקונים
    const icons = document.querySelectorAll('.feature-icon');
    icons.forEach((icon) => {
        // אנימציית כניסה
        gsap.from(icon, {
            scrollTrigger: {
                trigger: icon,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            rotation: -180,
            duration: 0.8,
            ease: "back.out(1.7)"
        });

        // אפקט ריחוף בהובר
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.1,
                duration: 0.3,
                ease: "power1.out"
            });
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                duration: 0.3,
                ease: "power1.out"
            });
        });
    });

    // Intersection Observer לאנימציות נוספות
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // הוספת אפקט הופעה הדרגתית לטקסטים
    document.querySelectorAll('.feature-card h3, .feature-card p').forEach((el) => {
        observer.observe(el);
    });
}); 