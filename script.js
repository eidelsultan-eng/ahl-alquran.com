// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDGKHCYjB-ryi6To5lDwlYya6hFOS4i40E",
    authDomain: "ahlquraan-29c5b.firebaseapp.com",
    projectId: "ahlquraan-29c5b",
    storageBucket: "ahlquraan-29c5b.firebasestorage.app",
    messagingSenderId: "677127394598",
    appId: "1:677127394598:web:b4487e06faf1230be95de7",
    measurementId: "G-K7Y7B2KC99"
};

// Initialize Firebase (Compat Version)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    // Loader
    const loader = document.querySelector('.loader-wrapper');
    window.addEventListener('load', () => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });

    // Scroll Effect for Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
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

    document.querySelectorAll('.animate-up, .service-card, .about-content, .about-image, .gallery-item, .step').forEach(el => {
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
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
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
                `*طلب جديد من موقع استوديو أهل القرآن:*%0A` +
                `👤 *الاسم:* ${name}%0A` +
                `📞 *الهاتف:* ${phone}%0A` +
                `🛠️ *نوع الخدمة:* ${service}%0A` +
                `📝 *التفاصيل:* ${message}`;

            const whatsappURL = `https://wa.me/201065305050?text=${whatsappMessage}`;

            window.open(whatsappURL, '_blank');
        });
    }

    // Admin Panel Logic
    window.openLoginModal = () => {
        document.getElementById('loginModal').classList.add('active');
    };

    window.closeLoginModal = () => {
        document.getElementById('loginModal').classList.remove('active');
    };

    window.checkAdminPassword = () => {
        const pass = document.getElementById('adminPassword').value;
        if (pass === '010asd') {
            document.getElementById('loginModal').classList.remove('active');
            document.getElementById('adminPanel').classList.add('active');
            loadGalleryData();
        } else {
            alert('كلمة السر خاطئة');
        }
    };

    window.closeAdminPanel = () => {
        document.getElementById('adminPanel').classList.remove('active');
    };

    // Video ID Extractors
    function getYoutubeID(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function getGoogleDriveID(url) {
        const regExp = /(?:https?:\/\/)?(?:drive\.google\.com\/(?:drive\/)?(?:file\/d\/|folders\/|open\?id=)|docs\.google\.com\/(?:drive\/)?(?:file\/d\/|folders\/|open\?id=))([a-zA-Z0-9_-]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    // Gallery Management (Firestore)
    function loadGalleryData() {
        db.collection('studioGallery').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
            const data = [];
            snapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            // Update Admin Table
            const table = document.getElementById('galleryDataTable');
            if (table) {
                table.innerHTML = data.map((item) => `
                    <tr>
                        <td>${item.desc}</td>
                        <td><a href="${item.link}" target="_blank">رابط اليوتيوب</a></td>
                        <td><button onclick="deleteGalleryItem('${item.id}')" style="background:#ff4444; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>
                    </tr>
                `).join('');
            }

            // Update Public Gallery Grid
            const grid = document.getElementById('dynamicGalleryGrid');
            if (grid) {
                grid.innerHTML = data.map(item => {
                    const youtubeID = getYoutubeID(item.link);
                    const driveID = getGoogleDriveID(item.link);
                    const isFolder = item.link.includes('folders/');

                    let embedSrc = '';
                    if (youtubeID) {
                        embedSrc = `https://www.youtube.com/embed/${youtubeID}?modestbranding=1&rel=0&showinfo=0`;
                        return `
                            <div class="gallery-item animate-up">
                                <div class="video-container">
                                    <iframe src="${embedSrc}" allowfullscreen></iframe>
                                </div>
                            </div>
                        `;
                    } else if (driveID) {
                        if (isFolder) {
                            // Render as a full-width library card with Sandbox to prevent redirects
                            embedSrc = `https://drive.google.com/embeddedfolderview?id=${driveID}#list`;
                            return `
                                <div class="gallery-item folder-item animate-up" style="grid-column: 1 / -1;">
                                    <div class="folder-header">
                                        <span class="folder-icon">🎙️</span>
                                        <div class="folder-info">
                                            <h3>${item.desc || 'المكتبة الصوتية'}</h3>
                                            <p>اختر السورة للاستماع المباشر دون مغادرة الموقع</p>
                                        </div>
                                    </div>
                                    <div class="folder-iframe-wrapper">
                                        <iframe 
                                            src="${embedSrc}" 
                                            allowfullscreen 
                                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups">
                                        </iframe>
                                    </div>
                                </div>
                            `;
                        } else {
                            embedSrc = `https://drive.google.com/file/d/${driveID}/preview`;
                            return `
                                <div class="gallery-item animate-up">
                                    <div class="video-container">
                                        <iframe src="${embedSrc}" allowfullscreen></iframe>
                                    </div>
                                </div>
                            `;
                        }
                    }
                    return '';
                }).join('');
            }
        });
    }

    // Load gallery on page load
    loadGalleryData();

    window.addNewGalleryItem = () => {
        const link = document.getElementById('newItemLink').value;
        const desc = document.getElementById('newItemDesc').value;

        if (!link || !desc) {
            alert('يرجى ملء كافة الحقول');
            return;
        }

        if (!getYoutubeID(link) && !getGoogleDriveID(link)) {
            alert('يرجى إدخال رابط يوتيوب أو جوجل درايف صحيح');
            return;
        }

        db.collection('studioGallery').add({
            link,
            desc,
            timestamp: Date.now()
        }).then(() => {
            document.getElementById('newItemLink').value = '';
            document.getElementById('newItemDesc').value = '';
            alert('تمت إضافة الفيديو بنجاح');
        }).catch(err => {
            console.error(err);
            alert('حدث خطأ أثناء الإضافة');
        });
    };

    window.deleteGalleryItem = (id) => {
        if (confirm('هل أنت متأكد من حذف هذا العمل؟')) {
            db.collection('studioGallery').doc(id).delete()
                .then(() => alert('تم الحذف بنجاح'))
                .catch(err => {
                    console.error(err);
                    alert('حدث خطأ أثناء الحذف');
                });
        }
    };
});
