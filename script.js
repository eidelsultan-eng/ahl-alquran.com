document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.querySelector('.loader-wrapper');
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });

    // Scroll Effect for Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-up, .service-card, .about-content, .about-image, .gallery-item').forEach(el => {
        el.classList.add('animate-up');
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Form Submission to WhatsApp
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service-type').value;
            const message = document.getElementById('message').value;

            const whatsappMessage = `السلام عليكم ورحمة الله وبركاته%0A%0A` +
                `*طلب حجز جديد من موقع استوديو أهل القرآن:*%0A` +
                `👤 *الاسم:* ${name}%0A` +
                `📞 *الهاتف:* ${phone}%0A` +
                `🛠️ *نوع الخدمة:* ${service}%0A` +
                `📝 *تفاصيل:* ${message}`;

            const whatsappURL = `https://wa.me/201234567890?text=${whatsappMessage}`; // Placeholder number

            window.open(whatsappURL, '_blank');
        });
    }
});
