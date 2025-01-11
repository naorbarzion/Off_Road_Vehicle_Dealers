document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea');

    // ולידציה בזמן אמת
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });

    // ולידציה של שדה בודד
    function validateInput(input) {
        const wrapper = input.closest('.input-wrapper');
        
        if (input.value.trim() === '') {
            setError(wrapper, 'שדה חובה');
            return false;
        }

        switch (input.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    setError(wrapper, 'כתובת מייל לא תקינה');
                    return false;
                }
                break;

            case 'tel':
                const phoneRegex = /^[0-9\-\+]{9,13}$/;
                if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
                    setError(wrapper, 'מספר טלפון לא תקין');
                    return false;
                }
                break;
        }

        clearError(wrapper);
        return true;
    }

    // הצגת הודעת שגיאה
    function setError(wrapper, message) {
        clearError(wrapper);
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.color = '#ff4444';
        error.style.fontSize = '0.8rem';
        error.style.marginTop = '0.25rem';
        wrapper.appendChild(error);
        wrapper.querySelector('.form-input').style.borderColor = '#ff4444';
    }

    // ניקוי הודעת שגיאה
    function clearError(wrapper) {
        const existingError = wrapper.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        wrapper.querySelector('.form-input').style.borderColor = '#eee';
    }

    // שליחת הטופס
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // ולידציה של כל השדות
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // הוספת אנימציית טעינה
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        form.classList.add('loading');

        try {
            // כאן תהיה הקריאה לשרת
            await new Promise(resolve => setTimeout(resolve, 1500)); // סימולציה של קריאת שרת

            // הצגת הודעת הצלחה
            Swal.fire({
                title: 'תודה!',
                text: 'פנייתך התקבלה בהצלחה. ניצור איתך קשר בהקדם.',
                icon: 'success',
                confirmButtonColor: '#FF8C00'
            });

            // איפוס הטופס
            form.reset();

        } catch (error) {
            Swal.fire({
                title: 'שגיאה',
                text: 'אירעה שגיאה בשליחת הטופס. אנא נסה שוב.',
                icon: 'error',
                confirmButtonColor: '#FF8C00'
            });
        } finally {
            // החזרת כפתור השליחה למצב הרגיל
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.classList.remove('loading');
        }
    });

    // אנימציה לאייקון המודרני
    const modernIcon = document.querySelector('.modern-icon');
    if (modernIcon) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            modernIcon.style.transform = `rotate(${-15 + scrolled * 0.1}deg)`;
        });
    }
}); 