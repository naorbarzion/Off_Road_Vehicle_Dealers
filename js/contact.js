// Google Sheet ID
const GOOGLE_SHEET_ID = '176gi1lSJHQn0KCYXycQ0DHE9_A9FWC-aVG5Jr83hmak';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPwD1wvn_5HgWiGBb2ze5bnlfy-yXhxJqrWYGLIiunSczWOKSiyNrI8KQXP14gTxZW/exec';

// הודעת אישור ללקוח
const CONFIRMATION_MESSAGE = {
    title: '<i class="fas fa-check-circle" style="color: #4CAF50; font-size: 3rem; margin-bottom: 1rem;"></i><br>תודה שפנית אלינו!',
    html: `
        <div style="text-align: right; direction: rtl; padding: 1rem;">
            <div style="background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,215,0,0.1)); padding: 1.5rem; border-radius: 15px; margin-bottom: 1.5rem;">
                <p style="font-size: 1.2em; margin-bottom: 15px; color: #333; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fas fa-handshake" style="color: #FF8C00;"></i>
                    תודה על פנייתך לטרייסר טכנולוגיות
                </p>
                <p style="margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fas fa-clock" style="color: #FF8C00;"></i>
                    פנייתך התקבלה בהצלחה וסמנכ"ל הפרוייקטים הארצי שלנו יצור איתך קשר בהקדם
                </p>
            </div>
            <div style="background: linear-gradient(135deg, rgba(255,140,0,0.05), rgba(255,215,0,0.05)); padding: 1.5rem; border-radius: 15px;">
                <p style="margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fas fa-star" style="color: #FF8C00;"></i>
                    אנו מודים לך על התעניינותך במוצרי החברה
                </p>
                <p style="margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fas fa-rocket" style="color: #FF8C00;"></i>
                    מצפים לשיתוף פעולה פורה ומוצלח
                </p>
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,140,0,0.2);">
                <p style="color: #666; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fas fa-heart" style="color: #FF8C00;"></i>
                    בברכה,<br>
                    צוות טרייסר טכנולוגיות
                </p>
            </div>
        </div>
    `,
    icon: false,
    confirmButtonText: '<i class="fas fa-check"></i> סגור',
    confirmButtonColor: '#FF8C00',
    showClass: {
        popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
    },
    customClass: {
        popup: 'modern-popup',
        confirmButton: 'modern-button'
    }
};

// הוספת סטייל לפופאפ
const style = document.createElement('style');
style.textContent = `
    .modern-popup {
        border-radius: 20px !important;
        padding: 2rem !important;
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
    }
    .modern-button {
        border-radius: 12px !important;
        padding: 1rem 2rem !important;
        font-size: 1.1rem !important;
        font-weight: 600 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        transition: all 0.3s ease !important;
    }
    .modern-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 15px rgba(255,140,0,0.3) !important;
    }
`;
document.head.appendChild(style);

// הודעת שגיאה
const ERROR_MESSAGE = {
    title: '<i class="fas fa-exclamation-circle" style="color: #f44336; font-size: 3rem; margin-bottom: 1rem;"></i><br>שגיאה בשליחת הטופס',
    html: `
        <div style="text-align: right; direction: rtl; padding: 1rem;">
            <p style="color: #666; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-phone" style="color: #f44336;"></i>
                אירעה שגיאה בשליחת הטופס. אנא נסה שוב או צור קשר בטלפון
            </p>
        </div>
    `,
    icon: false,
    confirmButtonText: '<i class="fas fa-redo"></i> נסה שוב',
    confirmButtonColor: '#f44336',
    showClass: {
        popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
    },
    customClass: {
        popup: 'modern-popup',
        confirmButton: 'modern-button'
    }
};

// טעקב אחר פעילות המשתמש
class UserActivityTracker {
    constructor() {
        this.activities = [];
        this.startTime = new Date();
        this.currentSection = '';
        this.device = this.getDeviceInfo();
        this.setupTracking();
    }

    // זיהוי המכשיר
    getDeviceInfo() {
        const ua = navigator.userAgent;
        const device = {
            type: /Mobile|Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : 'desktop',
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            browser: this.getBrowserInfo(),
            os: this.getOSInfo()
        };
        return device;
    }

    // זיהוי דפדפן
    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    }

    // זיהוי מערכת הפעלה
    getOSInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'MacOS';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Other';
    }

    // הגדרת מעקב
    setupTracking() {
        // מעקב אחר תנועת עכבר/מגע
        document.addEventListener('mousemove', this.throttle((e) => {
            this.trackMouseMovement(e);
        }, 500));

        // מעקב אחר לחיצות
        document.addEventListener('click', (e) => {
            this.trackClick(e);
        });

        // מעקב אחר גלילה
        document.addEventListener('scroll', this.throttle(() => {
            this.trackScroll();
        }, 500));

        // זיהוי אזורים
        this.setupIntersectionObserver();
    }

    // מעקב אחר תנועת עכבר
    trackMouseMovement(e) {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
            const section = this.findParentSection(element);
            if (section && section !== this.currentSection) {
                this.currentSection = section;
                this.addActivity('hover', {
                    section: section,
                    position: `${e.clientX}x${e.clientY}`
                });
            }
        }
    }

    // מעקב אחר לחיצות
    trackClick(e) {
        const element = e.target;
        const section = this.findParentSection(element);
        this.addActivity('click', {
            section: section || 'unknown',
            element: element.tagName,
            text: element.textContent?.trim(),
            position: `${e.clientX}x${e.clientY}`
        });
    }

    // מעקב אחר גלילה
    trackScroll() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        this.addActivity('scroll', {
            percentage: scrollPercent
        });
    }

    // זיהוי אזורים בדף
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.addActivity('view', {
                        section: entry.target.id || 'unknown-section',
                        visible: true,
                        time: new Date().toISOString()
                    });
                }
            });
        }, { threshold: 0.5 });

        // מעקב אחר כל האזורים החשובים
        document.querySelectorAll('section, .footer-content, .contact-form').forEach(section => {
            observer.observe(section);
        });
    }

    // מציאת האזור הקרוב ביותר
    findParentSection(element) {
        let current = element;
        while (current && current !== document.body) {
            if (current.tagName === 'SECTION' || current.classList.contains('footer-content') || 
                current.classList.contains('contact-form')) {
                return current.id || current.className;
            }
            current = current.parentElement;
        }
        return null;
    }

    // הוספת פעילות למערך
    addActivity(type, data) {
        this.activities.push({
            type,
            timestamp: new Date().toISOString(),
            data
        });
    }

    // מניעת עומס של אירועים
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // קבלת סיכום הפעילות
    getActivitySummary() {
        const duration = Math.round((new Date() - this.startTime) / 1000);
        return {
            device: this.device,
            duration: duration,
            activities: this.activities,
            mostViewedSections: this.getMostViewedSections(),
            totalClicks: this.activities.filter(a => a.type === 'click').length
        };
    }

    // ניתוח האזורים הנצפים ביותר
    getMostViewedSections() {
        const sections = {};
        this.activities.forEach(activity => {
            if (activity.data.section) {
                sections[activity.data.section] = (sections[activity.data.section] || 0) + 1;
            }
        });
        return Object.entries(sections)
            .sort(([,a], [,b]) => b - a)
            .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    }
}

// יצירת מופע של המעקב
const userTracker = new UserActivityTracker();

// עדכון הקוד הקיים של שליחת הטופס
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // הצגת אנימציית טעינה
    Swal.fire({
        title: 'שולח...',
        html: 'אנא המתן',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        // איסוף נתונים מהטופס + נתוני פעילות
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString(),
            source: window.location.href,
            userActivity: userTracker.getActivitySummary() // הוספת נתוני הפעילות
        };

        // שליחה לסקריפט של גוגל
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('Form submission response:', response);
        await Swal.fire(CONFIRMATION_MESSAGE);
        this.reset();

    } catch (error) {
        console.error('Form submission error:', error);
        await Swal.fire(ERROR_MESSAGE);
    }
}); 
