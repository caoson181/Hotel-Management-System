// room-detail.js - Room Detail Page Functionality

// ===== GALLERY DATA =====
const galleryImages = [
    {
        url: "https://media.leonardo-hotels.com/static.leonardo-hotels.com/image/leonardohotelbucharestcitycenter_room_comfortdouble2_2022_4000x2600_7e18f254bc75491965d36cc312e8111f.jpg",
        thumb: "https://media.leonardo-hotels.com/static.leonardo-hotels.com/image/leonardohotelbucharestcitycenter_room_comfortdouble2_2022_4000x2600_7e18f254bc75491965d36cc312e8111f.jpg",
        alt: "Deluxe Bedroom"
    },
    {
        url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumb: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        alt: "Luxury Bathroom"
    },
    {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumb: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        alt: "Living Area"
    },
    {
        url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumb: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        alt: "City View"
    },
    {
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumb: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        alt: "Premium Bedding"
    },
    {
        url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        thumb: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        alt: "Workspace"
    }
];

// ===== ROOM DATA (dynamic from backend) =====
let roomInfo = Object.keys(window.roomData || {}).length ? window.roomData : {
    type: "Double",
    guests: 2,
    size: 32,
    price: 199,
    amenities: ['55" Smart TV', 'Air Conditioning', 'Rain Shower', 'Coffee Machine'],
    description: 'King-size bed with premium Egyptian cotton sheets, offering exceptional softness and comfort for a truly restful night’s sleep. The room features a spacious, elegantly designed bathroom equipped with a modern rain shower, providing a relaxing and refreshing experience. Large windows showcase breathtaking city views, allowing guests to enjoy stunning skylines both day and night, creating a perfect blend of luxury and tranquility throughout their stay.',
    image: "https://media.leonardo-hotels.com/static.leonardo-hotels.com/image/leonardohotelbucharestcitycenter_room_comfortdouble2_2022_4000x2600_7e18f254bc75491965d36cc312e8111f.jpg"
};

// Load room data from sessionStorage if available
function loadRoomFromSession() {
    const selectedRoomData = sessionStorage.getItem('selectedRoom');
    if (selectedRoomData) {
        try {
            const selectedRoom = JSON.parse(selectedRoomData);
            roomInfo = {
                name: selectedRoom.displayName,
                guests: selectedRoom.guests,
                size: selectedRoom.size,
                rating: 4.8,
                reviews: 95,
                pricePerNight: selectedRoom.price,
                amenities: selectedRoom.amenities,
                description: selectedRoom.description ? [selectedRoom.description] : ['Comfortable and well-appointed room with premium amenities.']
            };
            sessionStorage.removeItem('selectedRoom');
        } catch (e) {
            console.error('Error loading room data from session:', e);
        }
    }
}

// ===== GLOBAL VARIABLES =====
let currentIndex = 0;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initRoomData();
    initGallery();
    initBooking();
    initEvents();
    initLightbox();
    initAOS();
});

// ===== INIT ROOM DATA =====
function initRoomData() {
    // Update hero overlay
    const heroTitle = document.querySelector('.hero-overlay h1');
    const roomMeta = document.querySelector('.hero-overlay .room-meta');

    if (heroTitle)
        heroTitle.textContent =
            (window.roomRank ? window.roomRank.toUpperCase() + ' ' : '') +
            (window.roomType || roomInfo.type || 'Room');
    if (roomMeta) {
        roomMeta.innerHTML = `
            <span><i class="fas fa-user"></i> ${roomInfo.guests} Guests</span>
            <span><i class="fas fa-ruler-combined"></i> ${roomInfo.size} m²</span>
            <span><i class="fas fa-star" style="color: #d4af37;"></i> 4.9 (128)</span>
        `;
    }

    // Update amenities
    const amenitiesGrid = document.querySelector('.amenities-grid');
    if (amenitiesGrid) {
        amenitiesGrid.innerHTML = roomInfo.amenities.map(amenity => `
            <div class="amenity-item">
                <i class="fas ${getAmenityIcon(amenity)}"></i> ${amenity}
            </div>
        `).join('');
    }

    // Update description
    const descCard = document.querySelector('.description-card');
    if (descCard) {
        const descContent = descCard.querySelector('div');
        if (descContent) {
            descContent.innerHTML = `<p>${roomInfo.description}</p>`;
        }
    }

    // Update price
    const priceElement = document.querySelector('.booking-card .price');
    if (priceElement) {
        priceElement.innerHTML = `$${roomInfo.price} <small>/night</small>`;
    }
}

// Get icon for amenity
function getAmenityIcon(amenity) {
    const iconMap = {
        'Smart TV': 'fa-tv',
        'Air Conditioning': 'fa-wind',
        'Rain Shower': 'fa-shower',
        'Coffee Machine': 'fa-mug-hot',
        'Ironing': 'fa-tshirt',
        'Work Desk': 'fa-laptop',
        '24h Service': 'fa-clock',
        'In-room Safe': 'fa-vault'
    };
    return iconMap[amenity] || 'fa-check-circle';
}

// ===== GALLERY FUNCTIONS =====
function initGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnailStrip = document.getElementById('thumbnailStrip');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');

    if (!thumbnailStrip) return;

    // Create thumbnails
    createThumbnails(thumbnailStrip);

    // Set active image
    function setActiveImage(index) {
        currentIndex = index;
        if (mainImage) {
            mainImage.style.animation = 'none';
            mainImage.offsetHeight;
            mainImage.style.animation = 'zoomIn 0.5s ease';
            mainImage.src = galleryImages[currentIndex].url;
        }

        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            if (i === currentIndex) {
                thumb.classList.add('active');
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Next/Prev functions
    function nextImage() {
        const newIndex = (currentIndex + 1) % galleryImages.length;
        setActiveImage(newIndex);
    }

    function prevImage() {
        const newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        setActiveImage(newIndex);
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Click on main image to open lightbox
    if (mainImage) {
        mainImage.addEventListener('click', () => {
            openLightbox(galleryImages[currentIndex].url);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    // Set initial image
    setActiveImage(0);
}

function createThumbnails(container) {
    container.innerHTML = '';
    galleryImages.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${img.thumb}" alt="${img.alt}">`;
        thumb.addEventListener('click', () => {
            currentIndex = index;
            const mainImage = document.getElementById('mainImage');
            if (mainImage) {
                mainImage.style.animation = 'none';
                mainImage.offsetHeight;
                mainImage.style.animation = 'zoomIn 0.5s ease';
                mainImage.src = galleryImages[currentIndex].url;
            }
            document.querySelectorAll('.thumbnail').forEach((t, i) => {
                t.classList.toggle('active', i === currentIndex);
            });
        });
        container.appendChild(thumb);
    });
}

// ===== LIGHTBOX FUNCTIONS =====
function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightbox && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const lightboxImg = document.getElementById('lightboxImg');

    if (!lightbox) return;

    // Close lightbox
    if (closeBtn) {
        closeBtn.onclick = () => lightbox.classList.remove('active');
    }

    // Prev/Next in lightbox
    if (prevBtn) {
        prevBtn.onclick = () => {
            const newIdx = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            if (lightboxImg) lightboxImg.src = galleryImages[newIdx].url;
            currentIndex = newIdx;
            updateActiveThumbnail();
            const mainImage = document.getElementById('mainImage');
            if (mainImage) mainImage.src = galleryImages[currentIndex].url;
        };
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            const newIdx = (currentIndex + 1) % galleryImages.length;
            if (lightboxImg) lightboxImg.src = galleryImages[newIdx].url;
            currentIndex = newIdx;
            updateActiveThumbnail();
            const mainImage = document.getElementById('mainImage');
            if (mainImage) mainImage.src = galleryImages[currentIndex].url;
        };
    }

    // Click outside to close (kể cả ấn vào ảnh lớn)
    lightbox.onclick = (e) => {
        if (e.target === lightbox || e.target === lightboxImg) {
            lightbox.classList.remove('active');
        }
    };

    // Close via ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        }
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevBtn && prevBtn.click();
            }
            if (e.key === 'ArrowRight') {
                nextBtn && nextBtn.click();
            }
        }
    });
}

function updateActiveThumbnail() {
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentIndex);
    });
}

// ===== BOOKING FUNCTIONS =====
function initBooking() {
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    const guestCountSpan = document.getElementById('guestCount');
    const totalPriceSpan = document.getElementById('totalPrice');
    const decrementBtn = document.getElementById('decrementGuest');
    const incrementBtn = document.getElementById('incrementGuest');
    const bookBtn = document.getElementById('bookNowBtn');

    let guestCount = 2;

    function calculateTotal() {
        if (checkin && checkout && totalPriceSpan) {
            const nights = Math.ceil((new Date(checkout.value) - new Date(checkin.value)) / (1000 * 60 * 60 * 24));
            totalPriceSpan.textContent = `$${nights * roomInfo.price}`;
        }
    }

    if (checkin) checkin.addEventListener('change', calculateTotal);
    if (checkout) checkout.addEventListener('change', calculateTotal);

    if (incrementBtn) {
        incrementBtn.onclick = () => {
            if (guestCount < 4 && guestCountSpan) {
                guestCountSpan.textContent = ++guestCount;
                calculateTotal();
            }
        };
    }

    if (decrementBtn) {
        decrementBtn.onclick = () => {
            if (guestCount > 1 && guestCountSpan) {
                guestCountSpan.textContent = --guestCount;
                calculateTotal();
            }
        };
    }

    if (bookBtn) {
        bookBtn.onclick = () => {
            showToast(`✓ Room booked! ${(window.roomRank ? window.roomRank.toUpperCase() + ' ' : '') + (roomInfo.type || 'Room')} for ${guestCount} guest(s)`);
        };
    }

    calculateTotal();
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

// ===== GENERAL EVENTS =====
function initEvents() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    });

    // Info cards click animation
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => card.style.transform = '', 150);
        });
    });

    // Similar rooms click
    document.querySelectorAll('.similar-card').forEach(card => {
        card.addEventListener('click', () => {
            const roomName = card.querySelector('h3')?.textContent || 'room';
            showToast(`Navigating to ${roomName}`);
        });
    });
}

// ===== AOS INITIALIZATION =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 500,
            once: true,
            offset: 60
        });
    }
}

// ===== EXPORT FOR GLOBAL USE (nếu cần) =====
window.roomDetail = {
    galleryImages,
    roomInfo,
    openLightbox
};