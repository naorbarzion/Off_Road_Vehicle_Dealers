// אנימציית כניסה ללוגואים
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // מוסיף דיליי לכל לוגו בנפרד
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100); // דיליי של 100ms בין כל לוגו
            }
        });
    }, {
        threshold: 0.1
    });

    // מחיל את האובזרבר על כל הלוגואים
    document.querySelectorAll('.client-logo').forEach((logo) => {
        observer.observe(logo);
    });
}); 