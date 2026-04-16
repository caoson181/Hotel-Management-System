// room-showcase.js - Fixed syntax error
const currentFlagEl = document.getElementById("currentFlag");
const currentLang = (
    new URLSearchParams(window.location.search).get("lang") ||
    (currentFlagEl?.className.includes("fi-vn") ? "vi" : "") ||
    document.documentElement.lang ||
    "en"
).toLowerCase();

const isVietnamese = currentLang.startsWith("vi");

const roomData = [
    {
        rank: "STANDARD",
        name: "Standard Room",
        shortInfo: [
            { icon: "fas fa-ruler-combined", text: "Area: 30m²" },
            { icon: "fas fa-bed", text: "1 Queen Bed or 2 Twin Beds" },
            { icon: "fas fa-wifi", text: "Free High-Speed WiFi" }
        ],
        longDesc: "Comfortable and cozy room with modern amenities, perfect for solo travelers or couples. Features a work desk, flat-screen TV, and en-suite bathroom with rain shower.",
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200"
        ],
        bgImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920",
        thumb: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
        amenities: [
            { icon: "fas fa-wifi", text: "Free WiFi" },
            { icon: "fas fa-tv", text: "32 inch LED TV" },  // Sửa lỗi
            { icon: "fas fa-snowflake", text: "Air Conditioning" },
            { icon: "fas fa-shower", text: "Rain Shower" },
            { icon: "fas fa-coffee", text: "Coffee/Tea Maker" },
            { icon: "fas fa-shield-alt", text: "Electronic Safe" }
        ]
    },
    {
        rank: "SUPERIOR",
        name: "Superior Room",
        shortInfo: [
            { icon: "fas fa-ruler-combined", text: "Area: 50m²" },
            { icon: "fas fa-bed", text: "1 King Bed" },
            { icon: "fas fa-city", text: "City View" }
        ],
        longDesc: "Spacious room with large windows offering stunning city views. Includes a comfortable seating area, mini-bar, and upgraded bathroom amenities.",
        images: [
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200"
        ],
        bgImage: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1920",
        thumb: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400",
        amenities: [
            { icon: "fas fa-wifi", text: "High-Speed WiFi" },
            { icon: "fas fa-tv", text: "43 inch 4K Smart TV" },  // Sửa lỗi
            { icon: "fas fa-snowflake", text: "Climate Control" },
            { icon: "fas fa-bath", text: "Bathtub & Shower" },
            { icon: "fas fa-glass-cheers", text: "Mini Bar" },
            { icon: "fas fa-city", text: "City View Window" },
            { icon: "fas fa-couch", text: "Seating Area" }
        ]
    },
    {
        rank: "DELUXE",
        name: "Deluxe Room",
        shortInfo: [
            { icon: "fas fa-ruler-combined", text: "Area: 60m²" },
            { icon: "fas fa-bed", text: "1 King Bed + Sofa Bed" },
            { icon: "fas fa-tree", text: "Garden View Balcony" }
        ],
        longDesc: "Luxurious room with private balcony overlooking the tropical garden. Features a separate sitting area, premium bedding, and deluxe bathroom with bathtub.",
        images: [
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
            "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200"
        ],
        bgImage: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920",
        thumb: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400",
        amenities: [
            { icon: "fas fa-wifi", text: "Premium WiFi" },
            { icon: "fas fa-tv", text: "55 inch 4K Smart TV" },  // Sửa lỗi
            { icon: "fas fa-snowflake", text: "Individual AC Control" },
            { icon: "fas fa-bath", text: "Separate Bathtub & Shower" },
            { icon: "fas fa-glass-cheers", text: "Complimentary Minibar" },
            { icon: "fas fa-tree", text: "Garden View Balcony" },
            { icon: "fas fa-couch", text: "Living Area with Sofa" },
            { icon: "fas fa-tshirt", text: "Bathrobe & Slippers" }
        ]
    },
    {
        rank: "EXECUTIVE",
        name: "Executive Room",
        shortInfo: [
            { icon: "fas fa-ruler-combined", text: "Area: 80m²" },
            { icon: "fas fa-briefcase", text: "Work Station + Meeting Area" },
            { icon: "fas fa-cocktail", text: "Executive Lounge Access" }
        ],
        longDesc: "Designed for business travelers with dedicated work area and meeting space. Includes exclusive access to Executive Lounge with complimentary refreshments.",
        images: [
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200"
        ],
        bgImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920",
        thumb: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400",
        amenities: [
            { icon: "fas fa-wifi", text: "Business High-Speed WiFi" },
            { icon: "fas fa-tv", text: "65 inch 4K Smart TV" },  // Sửa lỗi
            { icon: "fas fa-snowflake", text: "Premium Climate Control" },
            { icon: "fas fa-bath", text: "Rain Shower & Bathtub" },
            { icon: "fas fa-glass-cheers", text: "Fully Stocked Minibar" },
            { icon: "fas fa-briefcase", text: "Executive Work Desk" },
            { icon: "fas fa-crown", text: "Executive Lounge Access" },
            { icon: "fas fa-utensils", text: "Breakfast Included" },
            { icon: "fas fa-tshirt", text: "Premium Bath Amenities" }
        ]
    },
    {
        rank: "SUITE",
        name: "Suite Room",
        shortInfo: [
            { icon: "fas fa-ruler-combined", text: "Area: 100m²" },
            { icon: "fas fa-bed", text: "1 King Bed + Separate Living Room" },
            { icon: "fas fa-hot-tub", text: "Jacuzzi + Private Terrace" }
        ],
        longDesc: "The ultimate luxury experience with separate living and dining areas, private terrace with panoramic city views, and a lavish bathroom with jacuzzi and rain shower.",
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200"
        ],
        bgImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920",
        thumb: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
        amenities: [
            { icon: "fas fa-wifi", text: "Ultra High-Speed WiFi" },
            { icon: "fas fa-tv", text: "75 inch 4K OLED TV + Soundbar" },  // Sửa lỗi
            { icon: "fas fa-snowflake", text: "Multi-Zone Climate Control" },
            { icon: "fas fa-hot-tub", text: "Private Jacuzzi" },
            { icon: "fas fa-wine-glass-alt", text: "Premium Minibar & Wine Fridge" },
            { icon: "fas fa-utensils", text: "In-Room Dining Service" },
            { icon: "fas fa-crown", text: "Butler Service" },
            { icon: "fas fa-tree", text: "Private Terrace with Panoramic View" },
            { icon: "fas fa-couch", text: "Separate Living & Dining Area" },
            { icon: "fas fa-tshirt", text: "Designer Bathrobes & Slippers" },
            { icon: "fas fa-spa", text: "Luxury Bath Products" }
        ]
    }
];

if (isVietnamese) {
    const viContent = {
        STANDARD: {
            name: "Phòng Standard",
            shortInfo: [
                { icon: "fas fa-ruler-combined", text: "Diện tích: 30m²" },
                { icon: "fas fa-bed", text: "1 giường queen hoặc 2 giường đơn" },
                { icon: "fas fa-wifi", text: "WiFi tốc độ cao miễn phí" }
            ],
            longDesc: "Phòng ấm cúng và tiện nghi với thiết kế hiện đại, phù hợp cho khách đi một mình hoặc các cặp đôi. Trang bị bàn làm việc, TV màn hình phẳng và phòng tắm riêng với vòi sen cao cấp.",
            amenities: [
                { icon: "fas fa-wifi", text: "WiFi miễn phí" },
                { icon: "fas fa-tv", text: "TV LED 32 inch" },
                { icon: "fas fa-snowflake", text: "Điều hòa không khí" },
                { icon: "fas fa-shower", text: "Vòi sen cao cấp" },
                { icon: "fas fa-coffee", text: "Máy pha trà/cà phê" },
                { icon: "fas fa-shield-alt", text: "Két an toàn điện tử" }
            ]
        },
        SUPERIOR: {
            name: "Phòng Superior",
            shortInfo: [
                { icon: "fas fa-ruler-combined", text: "Diện tích: 50m²" },
                { icon: "fas fa-bed", text: "1 giường king" },
                { icon: "fas fa-city", text: "Hướng nhìn thành phố" }
            ],
            longDesc: "Phòng rộng rãi với cửa sổ lớn và tầm nhìn thành phố ấn tượng. Có khu vực ghế ngồi thoải mái, minibar và tiện nghi phòng tắm được nâng cấp.",
            amenities: [
                { icon: "fas fa-wifi", text: "WiFi tốc độ cao" },
                { icon: "fas fa-tv", text: "Smart TV 4K 43 inch" },
                { icon: "fas fa-snowflake", text: "Điều hòa kiểm soát nhiệt độ" },
                { icon: "fas fa-bath", text: "Bồn tắm và vòi sen" },
                { icon: "fas fa-glass-cheers", text: "Mini bar" },
                { icon: "fas fa-city", text: "Cửa sổ hướng phố" },
                { icon: "fas fa-couch", text: "Khu vực ghế ngồi" }
            ]
        },
        DELUXE: {
            name: "Phòng Deluxe",
            shortInfo: [
                { icon: "fas fa-ruler-combined", text: "Diện tích: 60m²" },
                { icon: "fas fa-bed", text: "1 giường king + sofa bed" },
                { icon: "fas fa-tree", text: "Ban công hướng vườn" }
            ],
            longDesc: "Phòng sang trọng với ban công riêng nhìn ra khu vườn nhiệt đới. Có khu vực tiếp khách riêng, chăn ga cao cấp và phòng tắm deluxe với bồn tắm.",
            amenities: [
                { icon: "fas fa-wifi", text: "WiFi cao cấp" },
                { icon: "fas fa-tv", text: "Smart TV 4K 55 inch" },
                { icon: "fas fa-snowflake", text: "Điều hòa điều chỉnh riêng" },
                { icon: "fas fa-bath", text: "Bồn tắm và vòi sen riêng" },
                { icon: "fas fa-glass-cheers", text: "Minibar miễn phí" },
                { icon: "fas fa-tree", text: "Ban công hướng vườn" },
                { icon: "fas fa-couch", text: "Phòng khách có sofa" },
                { icon: "fas fa-tshirt", text: "Áo choàng và dép đi trong phòng" }
            ]
        },
        EXECUTIVE: {
            name: "Phòng Executive",
            shortInfo: [
                { icon: "fas fa-ruler-combined", text: "Diện tích: 80m²" },
                { icon: "fas fa-briefcase", text: "Khu làm việc + tiếp khách" },
                { icon: "fas fa-cocktail", text: "Quyền vào executive lounge" }
            ],
            longDesc: "Thiết kế dành cho khách doanh nhân với khu làm việc chuyên biệt và không gian họp nhỏ. Bao gồm quyền sử dụng Executive Lounge cùng đồ uống miễn phí.",
            amenities: [
                { icon: "fas fa-wifi", text: "WiFi doanh nhân tốc độ cao" },
                { icon: "fas fa-tv", text: "Smart TV 4K 65 inch" },
                { icon: "fas fa-snowflake", text: "Điều hòa cao cấp" },
                { icon: "fas fa-bath", text: "Vòi sen mưa và bồn tắm" },
                { icon: "fas fa-glass-cheers", text: "Minibar đầy đủ" },
                { icon: "fas fa-briefcase", text: "Bàn làm việc executive" },
                { icon: "fas fa-crown", text: "Quyền vào executive lounge" },
                { icon: "fas fa-utensils", text: "Bao gồm bữa sáng" },
                { icon: "fas fa-tshirt", text: "Tiện nghi phòng tắm cao cấp" }
            ]
        },
        SUITE: {
            name: "Phòng Suite",
            shortInfo: [
                { icon: "fas fa-ruler-combined", text: "Diện tích: 100m²" },
                { icon: "fas fa-bed", text: "1 giường king + phòng khách riêng" },
                { icon: "fas fa-hot-tub", text: "Jacuzzi + sân hiên riêng" }
            ],
            longDesc: "Trải nghiệm nghỉ dưỡng đỉnh cao với khu tiếp khách và phòng ăn riêng, sân hiên riêng có tầm nhìn toàn cảnh thành phố cùng phòng tắm sang trọng với jacuzzi và vòi sen mưa.",
            amenities: [
                { icon: "fas fa-wifi", text: "WiFi siêu tốc" },
                { icon: "fas fa-tv", text: "TV OLED 4K 75 inch + soundbar" },
                { icon: "fas fa-snowflake", text: "Điều hòa đa vùng" },
                { icon: "fas fa-hot-tub", text: "Jacuzzi riêng" },
                { icon: "fas fa-wine-glass-alt", text: "Minibar cao cấp & tủ rượu" },
                { icon: "fas fa-utensils", text: "Dịch vụ ăn uống tại phòng" },
                { icon: "fas fa-crown", text: "Dịch vụ quản gia" },
                { icon: "fas fa-tree", text: "Sân hiên riêng nhìn toàn cảnh" },
                { icon: "fas fa-couch", text: "Phòng khách & phòng ăn riêng" },
                { icon: "fas fa-tshirt", text: "Áo choàng và dép thiết kế riêng" },
                { icon: "fas fa-spa", text: "Bộ sản phẩm phòng tắm cao cấp" }
            ]
        }
    };

    roomData.forEach((room) => {
        const translated = viContent[room.rank];
        if (!translated) return;
        room.name = translated.name;
        room.shortInfo = translated.shortInfo;
        room.longDesc = translated.longDesc;
        room.amenities = translated.amenities;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const dynamicBg = document.getElementById('dynamicBg');
    const roomRankLabel = document.getElementById('roomRankLabel');
    const roomTitle = document.getElementById('roomTitle');
    const basicInfoList = document.getElementById('basicInfoList');
    const thumbStrip = document.getElementById('thumbStrip');
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('roomModal');

    let currentRoomIndex = 0;
    let isTransitioning = false;

    function renderBasicInfo(room) {
        return room.shortInfo.map(item => `<p><i class="${item.icon}"></i> ${item.text}</p>`).join('');
    }

    function renderAmenities(room) {
        return room.amenities.map(item =>
            `<div class="amenity-item"><i class="${item.icon}"></i> ${item.text}</div>`
        ).join('');
    }

    function setBackgroundImage(url) {
        if (!dynamicBg) return;
        dynamicBg.style.transition = 'opacity 0.35s ease';
        dynamicBg.style.opacity = '0';
        setTimeout(() => {
            dynamicBg.style.backgroundImage = `url('${url}')`;
            dynamicBg.style.opacity = '1';
        }, 180);
    }

    function updateFeaturedRoom(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        const room = roomData[index];
        if (!room) return;

        // Update active thumbnail
        document.querySelectorAll('.thumb-item').forEach((el, i) => {
            if (i === index) el.classList.add('active');
            else el.classList.remove('active');
        });

        // Update background
        setBackgroundImage(room.bgImage);

        // Update text content
        setTimeout(() => {
            if (roomRankLabel) roomRankLabel.textContent = room.rank;
            if (roomTitle) roomTitle.textContent = room.name;
            if (basicInfoList) basicInfoList.innerHTML = renderBasicInfo(room);
            currentRoomIndex = index;
            isTransitioning = false;
        }, 200);
    }

    function renderThumbnails() {
        if (!thumbStrip) return;

        let html = '';
        roomData.forEach((room, idx) => {
            html += `<div class="thumb-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                <img src="${room.thumb}" alt="${room.name}">
            </div>`;
        });
        thumbStrip.innerHTML = html;

        document.querySelectorAll('.thumb-item').forEach(item => {
            item.addEventListener('click', function(e) {
                const index = parseInt(this.dataset.index);
                if (!isNaN(index) && index !== currentRoomIndex) {
                    updateFeaturedRoom(index);
                }
            });
        });
    }

    function openModalWithCurrentRoom() {
        const room = roomData[currentRoomIndex];
        if (!room || !modal) return;

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const thumbnailsHtml = room.images.map((img, idx) =>
            `<img src="${img}" alt="thumb ${idx+1}" class="${idx === 0 ? 'active-thumb' : ''}" data-img="${img}">`
        ).join('');

        modalContent.innerHTML = `
            <button class="close-modal"><i class="fas fa-times"></i></button>
            <div class="modal-grid">
                <div class="modal-left">
                    <div class="modal-main-image">
                        <img src="${room.images[0]}" alt="${room.name}" id="modalMainImage">
                    </div>
                    <div class="modal-thumbnails">
                        ${thumbnailsHtml}
                    </div>
                </div>
                <div class="modal-right">
                    <div class="room-rank-modal">${room.rank}</div>
                    <h2>${room.name}</h2>
                    <div class="modal-desc">${room.longDesc}</div>
                    <div class="amenities-grid" id="modalAmenities">
                        ${renderAmenities(room)}
                    </div>
                </div>
            </div>
        `;

        modal.innerHTML = '';
        modal.appendChild(modalContent);
        modal.classList.add('active');

        // Thumbnail click events
        const modalThumbs = modal.querySelectorAll('.modal-thumbnails img');
        const mainImage = modal.querySelector('#modalMainImage');

        modalThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                if (mainImage) mainImage.src = this.dataset.img;
                modalThumbs.forEach(t => t.classList.remove('active-thumb'));
                this.classList.add('active-thumb');
            });
        });

        // Close button
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModalWithCurrentRoom);
    }

    // Initialize
    if (dynamicBg && roomData[0]) {
        dynamicBg.style.backgroundImage = `url('${roomData[0].bgImage}')`;
    }
    if (roomRankLabel && roomData[0]) roomRankLabel.textContent = roomData[0].rank;
    if (roomTitle && roomData[0]) roomTitle.textContent = roomData[0].name;
    if (basicInfoList && roomData[0]) basicInfoList.innerHTML = renderBasicInfo(roomData[0]);

    renderThumbnails();

    // ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal) modal.classList.remove('active');
    });
});
