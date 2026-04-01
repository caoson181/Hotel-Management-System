// hotel-rooms.js
function t(key) {
  return i18nRooms?.[key] || i18nAmenities?.[key] || i18n?.[key] || key || "";
}
// ===== ROOM DATA CONFIGURATION =====
window.roomData = {
  standard: {
    title: "room.standard.title",
    tagline: "room.standard.tagline",
    rooms: [
      {
        type: "single",
        guests: 1,
        size: 18,
        description: "room.standard.single.desc",
        price: 89,
        amenities: [
          "amenity.wifi",
          "amenity.tv",
          "amenity.desk",
          "amenity.shower",
        ],
        image:
          "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        type: "double",
        guests: 2,
        size: 22,
        description: "room.standard.double.desc",
        price: 109,
        amenities: [
          "amenity.wifi",
          "amenity.tv",
          "amenity.fridge",
          "amenity.desk",
        ],
        image:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        type: "twin",
        guests: 2,
        size: 24,
        description: "room.standard.twin.desc",
        price: 119,
        amenities: [
          "amenity.wifi",
          "amenity.tv2",
          "amenity.coffee",
          "amenity.desk",
        ],
        image:
          "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  superior: {
    title: "room.superior.title",
    tagline: "room.superior.tagline",
    rooms: [
      {
        type: "single",
        guests: 1,
        size: 22,
        description: "room.superior.single.desc",
        price: 129,
        amenities: [
          "amenity.wifi",
          "amenity.tv55",
          "amenity.nespresso",
          "amenity.cityview",
        ],
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        type: "double",
        guests: 2,
        size: 28,
        description: "room.superior.double.desc",
        price: 149,
        amenities: [
          "amenity.wifi",
          "amenity.queenbed",
          "amenity.luxbath",
          "amenity.cityview",
        ],
        image:
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        type: "twin",
        guests: 2,
        size: 30,
        description: "room.superior.twin.desc",
        price: 159,
        amenities: [
          "amenity.wifi",
          "amenity.longbed",
          "amenity.seating",
          "amenity.cityview",
        ],
        image: "https://www.royalgardenhotel.co.uk/_img/videos/deluxe-twin.png",
      },
      {
        type: "triple",
        guests: 3,
        size: 35,
        description: "room.superior.triple.desc",
        price: 189,
        amenities: [
          "amenity.wifi",
          "amenity.family",
          "amenity.minibar",
          "amenity.cityview",
        ],
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  deluxe: {
    title: "room.deluxe.title",
    tagline: "room.deluxe.tagline",
    rooms: [
      {
        type: "double",
        guests: 2,
        size: 32,
        description: "room.deluxe.double.desc",
        price: 199,
        amenities: [
          "amenity.kingbed",
          "amenity.jacuzzi",
          "amenity.closet",
          "amenity.skyview",
        ],
        image:
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      },
      {
        type: "twin",
        guests: 2,
        size: 34,
        description: "room.deluxe.twin.desc",
        price: 209,
        amenities: [
          "amenity.queen2",
          "amenity.shower",
          "amenity.lux",
          "amenity.skyview",
        ],
        image:
          "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        type: "family",
        guests: 4,
        size: 45,
        description: "room.deluxe.family.desc",
        price: 279,
        amenities: [
          "amenity.king2single",
          "amenity.living",
          "amenity.kitchen",
          "amenity.skyview",
        ],
        image:
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  executive: {
    title: "room.executive.title",
    tagline: "room.executive.tagline",
    rooms: [
      {
        type: "double",
        guests: 2,
        size: 38,
        description: "room.executive.double.desc",
        price: 249,
        amenities: [
          "amenity.lounge",
          "amenity.work",
          "amenity.printer",
          "amenity.meeting",
        ],
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      },
      {
        type: "twin",
        guests: 2,
        size: 38,
        description: "room.executive.twin.desc",
        price: 259,
        amenities: [
          "amenity.work2",
          "amenity.lounge",
          "amenity.call",
          "amenity.cityview",
        ],
        image:
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    ],
  },

  suite: {
    title: "room.suite.title",
    tagline: "room.suite.tagline",
    rooms: [
      {
        type: "junior",
        guests: 2,
        size: 50,
        description: "room.suite.junior.desc",
        price: 349,
        displayName: "room.suite.junior.name",
        amenities: [
          "amenity.butler",
          "amenity.living",
          "amenity.panorama",
          "amenity.bar",
        ],
        image:
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
      {
        type: "presidential",
        guests: 5,
        size: 80,
        description: "room.suite.presidential.desc",
        price: 599,
        displayName: "room.suite.presidential.name",
        amenities: [
          "amenity.bedroom",
          "amenity.dining",
          "amenity.butler",
          "amenity.panorama",
        ],
        image:
          "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      },
    ],
  },
};

// ===== GLOBAL VARIABLES =====
let compareList = [];
let currentRank = 0;

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
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
  const container = document.querySelector(".rooms-container");
  if (!container) return;

  let html = "";

  Object.entries(roomData).forEach(([rankKey, rankValue]) => {
    html += `
            <section class="rank-section" data-rank="${rankKey}" id="rank-${rankKey}">
                <div class="rank-content">
                    <div class="rank-title" data-aos="fade-right">
                        <h2>${t(rankValue.title)}</h2>
                        <span>${t(rankValue.tagline)}</span>
                    </div>
                    <div class="room-grid">
        `;

    rankValue.rooms.forEach((room) => {
      const displayName = room.displayName
        ? t(room.displayName)
        : `${t(rankValue.title)} ${t(room.type)}`;

      const roomId = `${rankKey}-${room.type.toLowerCase()}`;

      html += `
                <div class="room-card" data-rank="${rankKey}" data-type="${room.type.toLowerCase()}" data-id="${roomId}">
                    <div class="room-card-inner">

                        <!-- FRONT -->
                        <div class="room-card-front">
                            <div class="flip-indicator">
                                <i class="fas fa-sync-alt"></i> ${t("flip")}
                            </div>

                            <div class="room-image">
                                <div class="room-image-content">
                                    <img src="${room.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}"
                                         alt="${displayName}"
                                         loading="lazy"
                                         onerror="this.src='https://via.placeholder.com/400x200?text=Room+Image'">
                                </div>
                                <span class="room-type-badge">${t(room.type)}</span>
                            </div>

                            <div class="room-info">
                                <h3>${displayName}</h3>

                                <div class="room-meta">
                                    <span>
                                        <i class="fas fa-user"></i>
                                        ${room.guests} ${room.guests > 1 ? t("guests") : t("guest")}
                                    </span>
                                    <span>
                                        <i class="fas fa-ruler-combined"></i>
                                        ${room.size} m²
                                    </span>
                                </div>

                                <p class="room-description">${t(room.description)}</p>

                                <div class="room-footer">
                                    <span class="price-tag">
                                        $${room.price} <small>${t("perNight")}</small>
                                    </span>

                                    <a href="/room-detail?rank=${rankKey}&type=${room.type}" 
                                       class="btn-detail view-detail-btn"
                                       data-rank="${rankKey}" 
                                       data-type="${room.type}">
                                       ${t("viewDetail")}
                                    </a>
                                </div>

                                <div class="compare-check">
                                    <label>
                                        <input type="checkbox" class="room-select" data-id="${roomId}">
                                        <i class="fas fa-plus-circle"></i> ${t("addCompare")}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- BACK -->
                        <div class="room-card-back">
                            <button class="btn-back">
                                <i class="fas fa-arrow-left"></i>
                            </button>

                            <h4>${t("roomServices")}</h4>

                            <ul>
                                ${room.amenities
                                  .map(
                                    (amenity) => `
                                    <li><i class="fas fa-check-circle"></i> ${t(amenity)}</li>
                                `,
                                  )
                                  .join("")}
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

  // STAFF NOTE
  html += `
        <div class="staff-note" data-aos="fade-up">
            <h4>
                <i class="fas fa-clipboard-list"></i>
                ${t("howToBook")}
            </h4>
            <p>
                <strong>${t("step1")}</strong> ${t("step1desc")}<br>
                <strong>${t("step2")}</strong> ${t("step2desc")}<br>
                <strong>${t("step3")}</strong> ${t("step3desc")}<br>
                <strong>${t("step4")}</strong> ${t("step4desc")}<br>
                <strong>${t("step5")}</strong> ${t("step5desc")}
            </p>
            <p>
                <i class="fas fa-check-circle" style="color: var(--primary-gold);"></i>
                <strong>${t("note")}</strong> ${t("notedesc")}
            </p>
        </div>
    `;

  container.innerHTML = html;

  // ✅ GIỮ NGUYÊN
  setTimeout(() => {
    initCardFlip();
  }, 100);
}

// ===== ROOM CARD FLIP HANDLER =====
function initCardFlip() {
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".room-card");
    if (!card) return;

    const isCompareCheckbox = e.target.closest(".compare-check");
    const isDetailButton = e.target.closest(".btn-detail");
    const isBackButton = e.target.closest(".btn-back");

    if (isCompareCheckbox || isDetailButton) {
      return;
    }

    if (isBackButton) {
      e.preventDefault();
      card.classList.remove("flipped");
      return;
    }

    card.classList.toggle("flipped");
    createRipple(e, card);
  });

  document.addEventListener("click", (e) => {
    const flippedCards = document.querySelectorAll(".room-card.flipped");
    if (flippedCards.length > 0) {
      let clickedInsideCard = false;
      flippedCards.forEach((card) => {
        if (card.contains(e.target)) {
          clickedInsideCard = true;
        }
      });

      if (!clickedInsideCard) {
        flippedCards.forEach((card) => {
          card.classList.remove("flipped");
        });
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".room-card.flipped").forEach((card) => {
        card.classList.remove("flipped");
      });
    }
  });
}

// ===== RIPPLE EFFECT =====
function createRipple(e, card) {
  const ripple = document.createElement("span");
  const rect = card.getBoundingClientRect();

  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.className = "ripple";

  card.style.position = "relative";
  card.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// ===== PARALLAX SCROLLING =====
function initParallax() {
  const sections = document.querySelectorAll(".rank-section");

  window.addEventListener("scroll", () => {
    sections.forEach((section) => {
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
  const progressFill = document.querySelector(".rank-progress-fill");
  const sections = document.querySelectorAll(".rank-section");

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const maxScroll = documentHeight - windowHeight;
    const percentage = (scrollPosition / maxScroll) * 100;
    if (progressFill) {
      progressFill.style.width = percentage + "%";
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
  const dots = document.querySelectorAll(".rank-dot");
  const sections = document.querySelectorAll(".rank-section");

  dots.forEach((dot, index) => {
    if (sections[index]) {
      dot.setAttribute("data-rank", sections[index]?.dataset.rank || "");
    }

    dot.addEventListener("click", () => {
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function updateActiveDot(index) {
  const dots = document.querySelectorAll(".rank-dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// ===== COMPARISON TOOL - CẬP NHẬT REMOVE ĐÚNG =====
function initComparison() {
  const compareBtn = document.getElementById("toggleCompare");
  const modal = document.querySelector(".comparison-modal");
  const closeBtn = document.querySelector(".close-compare");
  const clearBtn = document.querySelector(".btn-clear");
  const bookBtn = document.querySelector(".btn-book");

  if (!compareBtn || !modal) return;

  // Xử lý khi checkbox thay đổi
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("room-select")) {
      e.stopPropagation();

      const roomId = e.target.dataset.id;
      const card = e.target.closest(".room-card");
      const roomName = card.querySelector("h3").textContent;
      const roomPrice = card.querySelector(".price-tag").textContent;
      const roomMeta = card.querySelector(".room-meta").innerHTML;
      const roomImage = card.querySelector(".room-image-content").innerHTML;

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
            type: card.dataset.type,
          });
          showNotification(`Added "${roomName}" to comparison`);
        } else {
          e.target.checked = false;
          showNotification("You can compare up to 3 rooms at a time");
        }
      } else {
        // Xóa khỏi danh sách so sánh
        const index = compareList.findIndex((item) => item.id === roomId);
        if (index !== -1) {
          const removedRoom = compareList[index];
          compareList.splice(index, 1);
          showNotification(`Removed "${removedRoom.name}" from comparison`);
        }
      }

      updateCompareButton();

      // Nếu modal đang mở, cập nhật lại grid
      if (modal.classList.contains("active")) {
        updateComparisonGrid();
      }
    }
  });

  // Xử lý click trên label
  document.addEventListener("click", (e) => {
    if (e.target.closest(".compare-check")) {
      e.stopPropagation();
    }
  });

  // Hiển thị modal
  compareBtn.addEventListener("click", () => {
    if (compareList.length < 2) {
      showNotification("Please select at least 2 rooms to compare");
      return;
    }

    updateComparisonGrid();
    modal.classList.add("active");
  });

  // Đóng modal
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // Xóa tất cả
  clearBtn.addEventListener("click", () => {
    // Bỏ check tất cả checkbox
    document.querySelectorAll(".room-select").forEach((cb) => {
      cb.checked = false;
    });

    // Xóa danh sách
    compareList = [];
    updateCompareButton();
    modal.classList.remove("active");
    showNotification("Cleared all comparisons");
  });

  // Đặt phòng
  bookBtn.addEventListener("click", () => {
    if (compareList.length > 0) {
      const roomNames = compareList.map((r) => r.name).join(", ");
      showNotification(`Booking ${compareList.length} rooms: ${roomNames}`);
      // Thêm logic đặt phòng ở đây
    }
  });

  // Click outside để đóng modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

// Cập nhật nút so sánh
function updateCompareButton() {
  const compareBtn = document.getElementById("toggleCompare");
  if (!compareBtn) return;

  const countSpan = compareBtn.querySelector(".compare-count");
  if (countSpan) {
    countSpan.textContent = `(${compareList.length})`;
  }
}

// Cập nhật grid so sánh
function updateComparisonGrid() {
  const grid = document.getElementById("comparisonGrid");
  if (!grid) return;

  if (compareList.length === 0) {
    grid.innerHTML =
      '<p style="text-align: center; padding: 2rem; color: var(--text-light);">No rooms selected for comparison</p>';
    return;
  }

  grid.innerHTML = compareList
    .map(
      (room) => `
        <div class="compare-item" data-id="${room.id}">
            <div class="room-image-content">${room.image}</div>
            <h4>${room.name}</h4>
            <div class="room-meta">${room.meta}</div>
            <div class="price-tag">${room.price}</div>
            <button class="btn-detail remove-compare-btn" data-id="${room.id}">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `,
    )
    .join("");

  // Thêm event listener cho các nút Remove trong modal
  document.querySelectorAll(".remove-compare-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const roomId = btn.dataset.id;

      // Tìm và bỏ check checkbox tương ứng
      const checkbox = document.querySelector(
        `.room-select[data-id="${roomId}"]`,
      );
      if (checkbox) {
        checkbox.checked = false;
        // Trigger sự kiện change để cập nhật compareList
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });
}

// ===== TIME-BASED LIGHTING =====
function initTimeBasedLighting() {
  const hour = new Date().getHours();
  const body = document.body;

  if (hour >= 5 && hour < 8) {
    body.classList.add("morning");
  } else if (hour >= 17 && hour < 19) {
    body.classList.add("evening");
  } else if (hour >= 19 || hour < 5) {
    body.classList.add("night");
  }

  setInterval(() => {
    const newHour = new Date().getHours();
    body.classList.remove("morning", "evening", "night");

    if (newHour >= 5 && newHour < 8) {
      body.classList.add("morning");
    } else if (newHour >= 17 && newHour < 19) {
      body.classList.add("evening");
    } else if (newHour >= 19 || newHour < 5) {
      body.classList.add("night");
    }
  }, 3600000);
}

// ===== AOS INITIALIZATION =====
function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== VIEW DETAILS HANDLER =====
document.addEventListener("click", (e) => {
  const detailBtn = e.target.closest(".view-detail-btn");
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

  const room = rankData.rooms.find(
    (r) => r.type.toLowerCase() === type.toLowerCase(),
  );
  if (!room) return;

  showNotification(
    `Viewing ${rankData.title} ${room.type} - $${room.price}/night`,
  );
  // console.log('Room details:', { rank, type, room });
  window.location.href = `/room-detail?rank=${rank}&type=${room.type}`;
}
