// hotel-rooms.js

// ===== ROOM DATA CONFIGURATION =====
window.roomData = {
    standard: {
        title: 'STANDARD',
        tagline: 'Essential comfort',
        rooms: [
            {
                type: 'Single',
                guests: 1,
                size: 18,
                description: 'Compact and functional room with a comfortable single bed. Perfect for solo travelers.',
                price: 89,
                amenities: ['Free WiFi', 'Smart TV', 'Work Desk', 'Rain Shower'],
                image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800' // Ảnh single
            },
            {
                type: 'Double',
                guests: 2,
                size: 22,
                description: 'Cozy room with a double bed. All essential amenities for a pleasant stay.',
                price: 109,
                amenities: ['Free WiFi', 'Smart TV', 'Mini Fridge', 'Work Desk'],
                image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Ảnh single
            },
            {
                type: 'Twin',
                guests: 2,
                size: 24,
                description: 'Two comfortable single beds. Ideal for friends or colleagues traveling together.',
                price: 119,
                amenities: ['Free WiFi', '2 Smart TVs', 'Coffee Machine', 'Work Desk'],
                image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Ảnh single
            }
        ]
    },
    superior: {
        title: 'SUPERIOR',
        tagline: 'Elevated experience',
        rooms: [
            {
                type: 'Single',
                guests: 1,
                size: 22,
                description: 'Spacious single room with upgraded amenities and city view.',
                price: 129,
                amenities: ['Free WiFi', '55" Smart TV', 'Nespresso', 'City View'],
                image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Ảnh single
            },
            {
                type: 'Double',
                guests: 2,
                size: 28,
                description: 'Bright and airy room with a queen-size bed and work desk.',
                price: 149,
                amenities: ['Free WiFi', 'Queen Bed', 'Luxury Bath', 'City View'],
                image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Ảnh single
            },
            {
                type: 'Twin',
                guests: 2,
                size: 30,
                description: 'Two extra-long single beds with premium bedding and seating area.',
                price: 159,
                amenities: ['Free WiFi', 'Extra-long Beds', 'Seating Area', 'City View'],
                image: 'https://www.royalgardenhotel.co.uk/_img/videos/deluxe-twin.png' // Ảnh single
            },
            {
                type: 'Triple',
                guests: 3,
                size: 35,
                description: 'Perfect for small families: one double + one single bed.',
                price: 189,
                amenities: ['Free WiFi', 'Family Layout', 'Mini Bar', 'City View'],
                image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Ảnh single
            }
        ]
    },
    deluxe: {
        title: 'DELUXE',
        tagline: 'Luxury & space',
        rooms: [
            {
                type: 'Double',
                guests: 2,
                size: 32,
                description: 'Spacious room with king-size bed, luxurious bathroom, and skyline view.',
                price: 199,
                amenities: ['King Bed', 'Jacuzzi', 'Walk-in Closet', 'Skyline View'],
                image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' // Ảnh single
            },
            {
                type: 'Twin',
                guests: 2,
                size: 34,
                description: 'Two queen-size beds with premium amenities and separate shower.',
                price: 209,
                amenities: ['2 Queen Beds', 'Separate Shower', 'Luxury Amenities', 'Skyline View'],
                image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800' // Ảnh single
            },
            {
                type: 'Family',
                guests: 4,
                size: 45,
                description: 'One king bed + two single beds. Separate living area and luxury bath.',
                price: 279,
                amenities: ['King Bed + 2 Singles', 'Living Area', 'Kitchenette', 'Skyline View'],
                image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Ảnh single
            }
        ]
    },
    executive: {
        title: 'EXECUTIVE',
        tagline: 'Business class',
        rooms: [
            {
                type: 'Double',
                guests: 2,
                size: 38,
                description: 'Designed for business travelers with ergonomic workspace and lounge access.',
                price: 249,
                amenities: ['Executive Lounge', 'Work Station', 'Printer', 'Meeting Room Access'],
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' // Ảnh single
            },
            {
                type: 'Twin',
                guests: 2,
                size: 38,
                description: 'Two premium single beds with separate work areas. Access to executive lounge.',
                price: 259,
                amenities: ['2 Work Stations', 'Executive Lounge', 'Conference Call Setup', 'City View'],
                image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Ảnh single
            }
        ]
    },
    suite: {
        title: 'SUITE',
        tagline: 'The pinnacle',
        rooms: [
            {
                type: 'Double',
                guests: 2,
                size: 50,
                description: 'Separate bedroom and living area. Panoramic city views and butler service.',
                price: 349,
                displayName: 'Junior Suite',
                amenities: ['Butler Service', 'Separate Living', 'Panoramic View', 'Private Bar'],
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                type: 'Family',
                guests: 5,
                size: 80,
                description: 'Two bedrooms, living room, dining area. The ultimate luxury experience.',
                price: 599,
                displayName: 'Presidential Family Suite',
                amenities: ['2 Bedrooms', 'Dining Room', 'Private Butler', 'Panoramic View'],
                image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg' // Ảnh single

            }
        ]
    }
};

// ===== GLOBAL VARIABLES =====
let compareList = [];
let currentRank = 0;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadRooms();
    initParallax();
    initProgressBar();
    initVerticalNav();
    initComparison();
    initTimeBasedLighting();
    initAOS();
});

// ===== LOAD ROOMS DYNAMICALLY =====
function loadRooms() {
    const container = document.querySelector('.rooms-container');
    if (!container) return;

    let html = '';

    Object.entries(roomData).forEach(([rankKey, rankValue]) => {
        html += `
            <section class="rank-section" data-rank="${rankKey}" id="rank-${rankKey}">
                <div class="rank-content">
                    <div class="rank-title" data-aos="fade-right">
                        <h2>${rankValue.title}</h2>
                        <span>${rankValue.tagline}</span>
                    </div>
                    <div class="room-grid">
        `;

        rankValue.rooms.forEach(room => {
            const displayName = room.displayName || `${rankValue.title} ${room.type}`;
            const roomId = `${rankKey}-${room.type.toLowerCase()}`;

            html += `
                <div class="room-card" data-rank="${rankKey}" data-type="${room.type.toLowerCase()}" data-id="${roomId}">
                    <div class="room-card-inner">
                        <!-- Mặt trước -->
                        <div class="room-card-front">
                            <div class="flip-indicator">
                                <i class="fas fa-sync-alt"></i> Click to flip
                            </div>
                            <div class="room-image">
                                <div class="room-image-content">
                                    <img src="${room.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}"
                                         alt="${displayName}"
                                         loading="lazy"
                                         onerror="this.src='https://via.placeholder.com/400x200?text=Room+Image'">
                                </div>
                                <span class="room-type-badge">${room.type}</span>
                            </div>
                            <div class="room-info">
                                <h3>${displayName}</h3>
                                <div class="room-meta">
                                    <span><i class="fas fa-user"></i> ${room.guests} Guest${room.guests > 1 ? 's' : ''}</span>
                                    <span><i class="fas fa-ruler-combined"></i> ${room.size} m²</span>
                                </div>
                                <p class="room-description">${room.description}</p>
                                <div class="room-footer">
                                    <span class="price-tag">$${room.price} <small>/night</small></span>
                                    <a href="/room-detail?rank=${rankKey}&type=${room.type}" class="btn-detail view-detail-btn" data-rank="${rankKey}" data-type="${room.type}">View Details</a>
                                </div>
                                <div class="compare-check">
                                    <label>
                                        <input type="checkbox" class="room-select" data-id="${roomId}">
                                        <i class="fas fa-plus-circle"></i> Add to compare
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Mặt sau - CHỈ CHỨA SERVICES -->
                        <div class="room-card-back">
                            <button class="btn-back">
                                <i class="fas fa-arrow-left"></i>
                            </button>
                            <h4>Room Services</h4>
                            <ul>
                                ${room.amenities.map(amenity => `
                                    <li><i class="fas fa-check-circle"></i> ${amenity}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
            </section>
        `;
    });

    // Add staff note
    html += `
        <div class="staff-note" data-aos="fade-up">
            <h4>
                <i class="fas fa-clipboard-list"></i>
                        How to Book Your Perfect Room
            </h4>
                <p>
                    <strong>Step 1:</strong> Browse through 5 luxury ranks - <strong>Standard, Superior, Deluxe, Executive, and Suite</strong>.<br>
                    <strong>Step 2:</strong> Choose your preferred room type - Single, Double, Twin, Triple, or Family.<br>
                    <strong>Step 3:</strong> <strong>Click on any room card</strong> to flip it and view all included amenities and services.<br>
                    <strong>Step 4:</strong> Use the <strong>"Add to compare"</strong> checkbox to compare up to 3 rooms side by side.<br>
                    <strong>Step 5:</strong> Click <strong>"View Details"</strong> when you've found your perfect match to complete your booking.
                </p>
                <p>
                    <i class="fas fa-check-circle" style="color: var(--primary-gold);"></i>
                    <strong>Note:</strong> After booking, our team will assign your specific room number while guaranteeing
                    the room type and rank you selected. Enjoy your stay!
                </p>
        </div>
    `;

    container.innerHTML = html;

    // Khởi tạo flip handler sau khi rooms đã load
    setTimeout(() => {
        initCardFlip();
    }, 100);
}

// ===== ROOM CARD FLIP HANDLER =====
function initCardFlip() {
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.room-card');
        if (!card) return;

        const isCompareCheckbox = e.target.closest('.compare-check');
        const isDetailButton = e.target.closest('.btn-detail');
        const isBackButton = e.target.closest('.btn-back');

        if (isCompareCheckbox || isDetailButton) {
            return;
        }

        if (isBackButton) {
            e.preventDefault();
            card.classList.remove('flipped');
            return;
        }

        card.classList.toggle('flipped');
        createRipple(e, card);
    });

    document.addEventListener('click', (e) => {
        const flippedCards = document.querySelectorAll('.room-card.flipped');
        if (flippedCards.length > 0) {
            let clickedInsideCard = false;
            flippedCards.forEach(card => {
                if (card.contains(e.target)) {
                    clickedInsideCard = true;
                }
            });

            if (!clickedInsideCard) {
                flippedCards.forEach(card => {
                    card.classList.remove('flipped');
                });
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.room-card.flipped').forEach(card => {
                card.classList.remove('flipped');
            });
        }
    });
}

// ===== RIPPLE EFFECT =====
function createRipple(e, card) {
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple';

    card.style.position = 'relative';
    card.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== PARALLAX SCROLLING =====
function initParallax() {
    const sections = document.querySelectorAll('.rank-section');

    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const scrollPosition = window.scrollY;
            const sectionTop = rect.top + scrollPosition;
            const speed = 0.3;

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (scrollPosition - sectionTop) * speed;
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });
}

// ===== PROGRESS BAR =====
function initProgressBar() {
    const progressFill = document.querySelector('.rank-progress-fill');
    const sections = document.querySelectorAll('.rank-section');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const maxScroll = documentHeight - windowHeight;
        const percentage = (scrollPosition / maxScroll) * 100;
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                updateActiveDot(index);
                currentRank = index;
            }
        });
    });
}

// ===== VERTICAL NAVIGATION =====
function initVerticalNav() {
    const dots = document.querySelectorAll('.rank-dot');
    const sections = document.querySelectorAll('.rank-section');

    dots.forEach((dot, index) => {
        if (sections[index]) {
            dot.setAttribute('data-rank', sections[index]?.dataset.rank || '');
        }

        dot.addEventListener('click', () => {
            if (sections[index]) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function updateActiveDot(index) {
    const dots = document.querySelectorAll('.rank-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// ===== COMPARISON TOOL - CẬP NHẬT REMOVE ĐÚNG =====
function initComparison() {
    const compareBtn = document.getElementById('toggleCompare');
    const modal = document.querySelector('.comparison-modal');
    const closeBtn = document.querySelector('.close-compare');
    const clearBtn = document.querySelector('.btn-clear');
    const bookBtn = document.querySelector('.btn-book');

    if (!compareBtn || !modal) return;

    // Xử lý khi checkbox thay đổi
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('room-select')) {
            e.stopPropagation();

            const roomId = e.target.dataset.id;
            const card = e.target.closest('.room-card');
            const roomName = card.querySelector('h3').textContent;
            const roomPrice = card.querySelector('.price-tag').textContent;
            const roomMeta = card.querySelector('.room-meta').innerHTML;
            const roomImage = card.querySelector('.room-image-content').innerHTML;

            if (e.target.checked) {
                // Thêm vào danh sách so sánh
                if (compareList.length < 3) {
                    compareList.push({
                        id: roomId,
                        name: roomName,
                        price: roomPrice,
                        meta: roomMeta,
                        image: roomImage,
                        rank: card.dataset.rank,
                        type: card.dataset.type
                    });
                    showNotification(`Added "${roomName}" to comparison`);
                } else {
                    e.target.checked = false;
                    showNotification('You can compare up to 3 rooms at a time');
                }
            } else {
                // Xóa khỏi danh sách so sánh
                const index = compareList.findIndex(item => item.id === roomId);
                if (index !== -1) {
                    const removedRoom = compareList[index];
                    compareList.splice(index, 1);
                    showNotification(`Removed "${removedRoom.name}" from comparison`);
                }
            }

            updateCompareButton();

            // Nếu modal đang mở, cập nhật lại grid
            if (modal.classList.contains('active')) {
                updateComparisonGrid();
            }
        }
    });

    // Xử lý click trên label
    document.addEventListener('click', (e) => {
        if (e.target.closest('.compare-check')) {
            e.stopPropagation();
        }
    });

    // Hiển thị modal
    compareBtn.addEventListener('click', () => {
        if (compareList.length < 2) {
            showNotification('Please select at least 2 rooms to compare');
            return;
        }

        updateComparisonGrid();
        modal.classList.add('active');
    });

    // Đóng modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Xóa tất cả
    clearBtn.addEventListener('click', () => {
        // Bỏ check tất cả checkbox
        document.querySelectorAll('.room-select').forEach(cb => {
            cb.checked = false;
        });

        // Xóa danh sách
        compareList = [];
        updateCompareButton();
        modal.classList.remove('active');
        showNotification('Cleared all comparisons');
    });

    // Đặt phòng
    bookBtn.addEventListener('click', () => {
        if (compareList.length > 0) {
            const roomNames = compareList.map(r => r.name).join(', ');
            showNotification(`Booking ${compareList.length} rooms: ${roomNames}`);
            // Thêm logic đặt phòng ở đây
        }
    });

    // Click outside để đóng modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Cập nhật nút so sánh
function updateCompareButton() {
    const compareBtn = document.getElementById('toggleCompare');
    if (!compareBtn) return;

    const countSpan = compareBtn.querySelector('.compare-count');
    if (countSpan) {
        countSpan.textContent = `(${compareList.length})`;
    }
}

// Cập nhật grid so sánh
function updateComparisonGrid() {
    const grid = document.getElementById('comparisonGrid');
    if (!grid) return;

    if (compareList.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-light);">No rooms selected for comparison</p>';
        return;
    }

    grid.innerHTML = compareList.map(room => `
        <div class="compare-item" data-id="${room.id}">
            <div class="room-image-content">${room.image}</div>
            <h4>${room.name}</h4>
            <div class="room-meta">${room.meta}</div>
            <div class="price-tag">${room.price}</div>
            <button class="btn-detail remove-compare-btn" data-id="${room.id}">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `).join('');

    // Thêm event listener cho các nút Remove trong modal
    document.querySelectorAll('.remove-compare-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const roomId = btn.dataset.id;

            // Tìm và bỏ check checkbox tương ứng
            const checkbox = document.querySelector(`.room-select[data-id="${roomId}"]`);
            if (checkbox) {
                checkbox.checked = false;
                // Trigger sự kiện change để cập nhật compareList
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });
}

// ===== TIME-BASED LIGHTING =====
function initTimeBasedLighting() {
    const hour = new Date().getHours();
    const body = document.body;

    if (hour >= 5 && hour < 8) {
        body.classList.add('morning');
    } else if (hour >= 17 && hour < 19) {
        body.classList.add('evening');
    } else if (hour >= 19 || hour < 5) {
        body.classList.add('night');
    }

    setInterval(() => {
        const newHour = new Date().getHours();
        body.classList.remove('morning', 'evening', 'night');

        if (newHour >= 5 && newHour < 8) {
            body.classList.add('morning');
        } else if (newHour >= 17 && newHour < 19) {
            body.classList.add('evening');
        } else if (newHour >= 19 || newHour < 5) {
            body.classList.add('night');
        }
    }, 3600000);
}

// ===== AOS INITIALIZATION =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== VIEW DETAILS HANDLER =====
document.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('.view-detail-btn');
    if (detailBtn) {
        e.preventDefault();
        e.stopPropagation();

        const rank = detailBtn.dataset.rank;
        const type = detailBtn.dataset.type;

        showRoomDetails(rank, type);
    }
});

function showRoomDetails(rank, type) {
    const rankData = roomData[rank];
    if (!rankData) return;

    const room = rankData.rooms.find(r => r.type.toLowerCase() === type.toLowerCase());
    if (!room) return;

    showNotification(`Viewing ${rankData.title} ${room.type} - $${room.price}/night`);
    // console.log('Room details:', { rank, type, room });
    window.location.href = `/room-detail?rank=${rank}&type=${room.type}`;
}
