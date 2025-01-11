document.addEventListener('DOMContentLoaded', () => {
    // רישום GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // אנימציה לקופסאות השירותים
    const serviceCards = document.querySelectorAll('#services .bg-white');
    serviceCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.2
        });
    });

    // אנימציה לאייקונים
    const icons = document.querySelectorAll('#services .w-16');
    icons.forEach((icon) => {
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
    });
}); 