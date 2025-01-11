// אנימציית ספירה
class Counter {
    constructor(element, targetValue) {
        this.element = element;
        this.targetValue = targetValue;
        this.currentValue = 0;
        this.duration = 2000; // משך האנימציה ב-ms
        this.startTime = null;
    }

    start() {
        this.startTime = performance.now();
        requestAnimationFrame(this.update.bind(this));
    }

    update(currentTime) {
        if (!this.startTime) {
            this.startTime = currentTime;
        }

        const elapsedTime = currentTime - this.startTime;
        const progress = Math.min(elapsedTime / this.duration, 1);

        // אנימציה עם האטה בסוף
        const easedProgress = this.easeOutQuart(progress);
        this.currentValue = Math.round(easedProgress * this.targetValue);
        
        // עדכון הטקסט
        this.element.textContent = this.currentValue;

        // המשך האנימציה אם לא הגענו לסוף
        if (progress < 1) {
            requestAnimationFrame(this.update.bind(this));
        } else {
            // וידוא שהמספר הסופי מוצג בדיוק
            this.element.textContent = this.targetValue;
        }
    }

    // פונקציית האטה - מהירה בהתחלה ומאטה בסוף
    easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }
}

// אתחול הספירה
function initCounters() {
    const counterElements = document.querySelectorAll('.count');
    
    if (!counterElements.length) {
        setTimeout(initCounters, 100);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = parseInt(element.dataset.target);
                if (!element.hasAttribute('data-counted')) {
                    const counter = new Counter(element, targetValue);
                    counter.start();
                    element.setAttribute('data-counted', 'true');
                    observer.unobserve(element);
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-50px'
    });

    counterElements.forEach(element => observer.observe(element));
}

// מאזין לטעינת התוכן
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCounters, 500);
});

// מאזין לשינויים בתוכן הדף
const contentObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            initCounters();
        }
    });
});

// התחלת מעקב אחר שינויים בתוכן
contentObserver.observe(document.body, {
    childList: true,
    subtree: true
}); 