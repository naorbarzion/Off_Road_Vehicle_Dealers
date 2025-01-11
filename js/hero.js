// רישום GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

let player;
let isPlayerReady = false;
let retryCount = 0;
const MAX_RETRIES = 5;

// פונקציה לטעינת YouTube API באופן דינמי
function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        if (window.YT && window.YT.Player) {
            resolve();
            return;
        }

        window.onYouTubeIframeAPIReady = function() {
            resolve();
        };

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        setTimeout(() => reject('YouTube API load timeout'), 5000);
    });
}

// פונקציה ליצירת הנגן
async function initializePlayer() {
    try {
        await loadYouTubeAPI();
        
        if (!document.getElementById('youtube-player')) {
            throw new Error('Player element not found');
        }

        // ניקוי אלמנט קיים אם יש
        const existingPlayer = document.getElementById('youtube-player');
        existingPlayer.innerHTML = '';

        player = new YT.Player('youtube-player', {
            videoId: 'l6f1D6xSjTY',
            playerVars: {
                autoplay: 1,
                loop: 1,
                controls: 0,
                showinfo: 0,
                rel: 0,
                enablejsapi: 1,
                modestbranding: 1,
                mute: 1,
                playsinline: 1,
                playlist: 'l6f1D6xSjTY',
                origin: window.location.origin,
                iv_load_policy: 3, // ביטול הערות
                fs: 0 // ביטול מסך מלא
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
                onError: onPlayerError
            }
        });
    } catch (error) {
        console.error('Player initialization error:', error);
        retryInitialization();
    }
}

// ניסיון חוזר במקרה של כשל
function retryInitialization() {
    if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Retrying player initialization (${retryCount}/${MAX_RETRIES})`);
        setTimeout(initializePlayer, 800 * retryCount);
    }
}

// כשהנגן מוכן
function onPlayerReady(event) {
    console.log('Player Ready');
    isPlayerReady = true;
    retryCount = 0;
    
    event.target.playVideo();
    event.target.mute();
    
    // התאמות גודל מרובות בהתחלה
    resizeVideo();
    setTimeout(resizeVideo, 100);
    setTimeout(resizeVideo, 500);
    setTimeout(resizeVideo, 1000);
    
    // הוספת האזנה לשינוי גודל החלון
    if (!window.resizeListenerAdded) {
        const debouncedResize = debounce(() => {
            resizeVideo();
            setTimeout(resizeVideo, 100); // התאמה נוספת אחרי רגע קט
        }, 150);
        
        window.addEventListener('resize', debouncedResize);
        window.resizeListenerAdded = true;
    }
}

// מעקב אחר מצב הנגן
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
        player.playVideo();
    }
    
    // אם הוידאו מתנגן, נוודא שהגודל נכון
    if (event.data === YT.PlayerState.PLAYING) {
        resizeVideo();
    }
}

// טיפול בשגיאות
function onPlayerError(event) {
    console.error('YouTube Player Error:', event.data);
    if (!isPlayerReady) {
        retryInitialization();
    }
}

// פונקציית Debounce למניעת קריאות מיותרות
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// התאמת גודל הוידאו
function resizeVideo() {
    if (!player || !player.setSize) return;

    const container = document.querySelector('.video-container');
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = 16/9;
    
    let newWidth, newHeight;
    
    // התאמה שונה למובייל ולדסקטופ
    if (width <= 768) {
        // מובייל - כיסוי מלא
        newWidth = Math.max(width, height * ratio) * 1.2;
        newHeight = Math.max(height, width / ratio) * 1.2;
    } else {
        // דסקטופ - חישוב חדש
        newWidth = width * 1.2;  // תמיד 20% יותר רחב מהמסך
        newHeight = newWidth / ratio;
        
        // אם הגובה לא מספיק לכסות את המסך
        if (newHeight < height) {
            newHeight = height * 1.2;
            newWidth = newHeight * ratio;
        }
    }
    
    // מרכוז הוידאו
    const left = (width - newWidth) / 2;
    const top = (height - newHeight) / 2;
    
    const playerElement = document.getElementById('youtube-player');
    if (playerElement) {
        Object.assign(playerElement.style, {
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            width: `${newWidth}px`,
            height: `${newHeight}px`,
            transform: 'none'  // מבטל טרנספורמציות קודמות
        });
        
        // הוספת אנימציית פייד-אין בטעינה ראשונית
        if (!playerElement.dataset.loaded) {
            playerElement.style.opacity = '0';
            setTimeout(() => {
                playerElement.style.transition = 'opacity 0.5s ease-in-out';
                playerElement.style.opacity = '1';
                playerElement.dataset.loaded = 'true';
            }, 100);
        }
    }
    
    player.setSize(Math.ceil(newWidth), Math.ceil(newHeight));
}

// אתחול בטעינת העמוד
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initParallaxEffect();
    initializePlayer();
});

// ביסיון נוסף לטעינה במקרה של כשל
window.addEventListener('load', () => {
    if (!isPlayerReady) {
        console.log('Trying to initialize player on window load');
        initializePlayer();
    }
});

// אנימציות ראשיות
function initHeroAnimations() {
    gsap.from('.content-container img', {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: 'power3.out'
    });

    const textElements = gsap.timeline({ delay: 0.5 });
    
    textElements
        .from('h1 span:first-child', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        })
        .from('h1 span:last-child', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        }, '-=0.6')
        .from('.hero-text', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            stagger: 0.2
        }, '-=0.4')
        .from('.cta-button', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: 'power3.out'
        }, '-=0.4');
}

// אפקט פראלקס
function initParallaxEffect() {
    gsap.to('.overlay', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        opacity: 0.8,
        y: 100
    });
}

// טיפול בכפתור ה-CTA
document.querySelector('.cta-button').addEventListener('click', () => {
    console.log('CTA clicked');
}); 