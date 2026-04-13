const pageType = (window.roomType || "").toLowerCase();
const pageRank = (window.roomRank || "").toLowerCase();
const ROOM_CATALOG = {
  standard: {
    single: {
      guests: 1,
      size: 18,
      description: "room.standard.single.desc",
      amenities: ["amenity.wifi", "amenity.tv", "amenity.desk", "amenity.shower"],
      image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    double: {
      guests: 2,
      size: 22,
      description: "room.standard.double.desc",
      amenities: ["amenity.wifi", "amenity.tv", "amenity.fridge", "amenity.desk"],
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    twin: {
      guests: 2,
      size: 24,
      description: "room.standard.twin.desc",
      amenities: ["amenity.wifi", "amenity.tv2", "amenity.coffee", "amenity.desk"],
      image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  },
  superior: {
    single: {
      guests: 1,
      size: 22,
      description: "room.superior.single.desc",
      amenities: ["amenity.wifi", "amenity.tv55", "amenity.nespresso", "amenity.cityview"],
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    double: {
      guests: 2,
      size: 28,
      description: "room.superior.double.desc",
      amenities: ["amenity.wifi", "amenity.queenbed", "amenity.luxbath", "amenity.cityview"],
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    twin: {
      guests: 2,
      size: 30,
      description: "room.superior.twin.desc",
      amenities: ["amenity.wifi", "amenity.longbed", "amenity.seating", "amenity.cityview"],
      image: "https://www.royalgardenhotel.co.uk/_img/videos/deluxe-twin.png",
    },
    triple: {
      guests: 3,
      size: 35,
      description: "room.superior.triple.desc",
      amenities: ["amenity.wifi", "amenity.family", "amenity.minibar", "amenity.cityview"],
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  },
  deluxe: {
    double: {
      guests: 2,
      size: 32,
      description: "room.deluxe.double.desc",
      amenities: ["amenity.kingbed", "amenity.jacuzzi", "amenity.closet", "amenity.skyview"],
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    },
    twin: {
      guests: 2,
      size: 34,
      description: "room.deluxe.twin.desc",
      amenities: ["amenity.queen2", "amenity.shower", "amenity.lux", "amenity.skyview"],
      image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    family: {
      guests: 4,
      size: 45,
      description: "room.deluxe.family.desc",
      amenities: ["amenity.king2single", "amenity.living", "amenity.kitchen", "amenity.skyview"],
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  },
  executive: {
    double: {
      guests: 2,
      size: 38,
      description: "room.executive.double.desc",
      amenities: ["amenity.lounge", "amenity.work", "amenity.printer", "amenity.meeting"],
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    },
    twin: {
      guests: 2,
      size: 38,
      description: "room.executive.twin.desc",
      amenities: ["amenity.work2", "amenity.lounge", "amenity.call", "amenity.cityview"],
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  },
  suite: {
    double: {
      guests: 2,
      size: 50,
      description: "room.suite.junior.desc",
      amenities: ["amenity.butler", "amenity.living", "amenity.panorama", "amenity.bar"],
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    family: {
      guests: 5,
      size: 80,
      description: "room.suite.presidential.desc",
      amenities: ["amenity.bedroom", "amenity.dining", "amenity.butler", "amenity.panorama"],
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    },
  },
};

let currentIndex = 0;
let guestCount = 2;
let availabilityState = {
  loaded: false,
  available: false,
  availableCount: 0,
};
let selectedReviewRating = 0;
let reviewState = {
  averageRating: 0,
  totalReviews: 0,
  ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  reviews: [],
};

const selectedRoomConfig = ROOM_CATALOG[pageRank]?.[pageType] || {};
const roomInfo = {
  guests: Number(selectedRoomConfig.guests || 2),
  size: Number(selectedRoomConfig.size || 32),
  price: 0,
  amenities: Array.isArray(selectedRoomConfig.amenities) ? selectedRoomConfig.amenities : [],
  description: selectedRoomConfig.description || "Comfortable and well-appointed room with premium amenities.",
  image: selectedRoomConfig.image || "https://images.unsplash.com/photo-1590490360182-c33d5773345b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
};
const galleryImages = [
  {
    url: roomInfo.image,
    thumb: roomInfo.image,
    alt: window.roomType || "Room",
  },
  {
    url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    alt: "Luxury Bathroom",
  },
  {
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    alt: "Living Area",
  },
  {
    url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    alt: "City View",
  },
];

function t(key) {
  return i18nRooms?.[key] || i18nAmenities?.[key] || i18n?.[key] || key || "";
}

function formatVND(number) {
  return Number(number || 0).toLocaleString("vi-VN") + " d";
}

const BOOKING_NOTIFICATION_STORAGE_KEY = "gravity.notifications";
const BOOKING_NOTIFICATION_LIMIT = 10;
const BOOKING_NOTIFICATION_AUTO_OPEN_KEY = "gravity.notifications.autoOpen";

function persistBookingNotification(payload) {
  if (window.GravityNotifications?.addBookingSuccessNotification) {
    window.GravityNotifications.addBookingSuccessNotification(payload);
    sessionStorage.setItem(BOOKING_NOTIFICATION_AUTO_OPEN_KEY, "true");
    return;
  }

  try {
    const existing = JSON.parse(
      localStorage.getItem(BOOKING_NOTIFICATION_STORAGE_KEY) || "[]",
    );
    const notifications = Array.isArray(existing) ? existing : [];
    const roomCount = Number(payload.roomCount || 0);

    notifications.unshift({
      id: `${Date.now()}`,
      title: "Booking created successfully",
      message: `Your booking for ${
        roomCount === 1 ? "1 room" : `${roomCount} room(s)`
      } from ${payload.checkIn} to ${payload.checkOut} was recorded successfully.`,
      codeLabel: `Code: ${String(payload.groupCode || "")
        .slice(0, 8)
        .toUpperCase()} | ${payload.status || "UNPAID"}`,
      amount: payload.totalAmount || 0,
      createdAt: payload.createdAt || new Date().toISOString(),
      read: false,
    });

    localStorage.setItem(
      BOOKING_NOTIFICATION_STORAGE_KEY,
      JSON.stringify(notifications.slice(0, BOOKING_NOTIFICATION_LIMIT)),
    );
    sessionStorage.setItem(BOOKING_NOTIFICATION_AUTO_OPEN_KEY, "true");
  } catch (error) {
    console.error("Failed to persist booking notification", error);
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    alert(message);
    return;
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function parseTypeRank(name) {
  const parts = String(name || "").trim().split(/\s+/);
  return {
    roomType: parts[0] || "",
    roomRank: parts.slice(1).join(" ") || "",
  };
}

function buildRoomDetailUrl(rank, type) {
  return `/room-detail?rank=${encodeURIComponent(rank || "")}&type=${encodeURIComponent(type || "")}`;
}

async function fetchRepresentativeRoom(type, rank) {
  const response = await fetch(`/api/rooms/representative?type=${encodeURIComponent(type)}&rank=${encodeURIComponent(rank)}`);
  if (!response.ok) {
    throw new Error("Representative room not found");
  }
  return response.json();
}

async function loadPriceFromDB(type, rank) {
  if (!type || !rank) {
    return;
  }

  try {
    const data = await fetchRepresentativeRoom(type, rank);
    roomInfo.price = Number(data.price || 0);
    const priceValue = document.getElementById("priceValue");
    if (priceValue) {
      priceValue.textContent = formatVND(roomInfo.price);
    }
    updateTotal();
  } catch (error) {
    console.error(error);
  }
}

async function loadSimilarPrices() {
  const list = [
    { rank: "superior", type: "twin" },
    { rank: "executive", type: "double" },
    { rank: "suite", type: "family" },
  ];

  for (const item of list) {
    try {
      const data = await fetchRepresentativeRoom(item.type, item.rank);
      const priceEl = document.getElementById(`price-${item.rank}-${item.type}`);
      if (priceEl) {
        priceEl.textContent = `${formatVND(data.price)} /night`;
      }
    } catch (error) {
      console.error("Error loading similar price", error);
    }
  }
}

function getAmenityIcon(amenity) {
  const iconMap = {
    "Smart TV": "fa-tv",
    "Air Conditioning": "fa-wind",
    "Rain Shower": "fa-shower",
    "Coffee Machine": "fa-mug-hot",
    Ironing: "fa-tshirt",
    "Work Desk": "fa-laptop",
    "24h Service": "fa-clock",
    "In-room Safe": "fa-vault",
  };
  return iconMap[amenity] || "fa-check-circle";
}

function initRoomData() {
  const heroTitle = document.querySelector(".hero-overlay h1");
  const roomMeta = document.querySelector(".hero-overlay .room-meta");
  const amenitiesGrid = document.querySelector(".amenities-grid");
  const descCard = document.querySelector(".description-card div");

  if (heroTitle) {
    heroTitle.textContent = `${String(window.roomRank || "").toUpperCase()} ${window.roomType || "Room"}`.trim();
  }

  if (roomMeta) {
    roomMeta.innerHTML = `
      <span><i class="fas fa-user"></i> ${roomInfo.guests} Guests</span>
      <span><i class="fas fa-ruler-combined"></i> ${roomInfo.size} m2</span>
      <span><i class="fas fa-star" style="color: #d4af37;"></i> ${Number(reviewState.averageRating || 0).toFixed(1)} (${reviewState.totalReviews || 0})</span>
    `;
  }

  if (amenitiesGrid) {
    amenitiesGrid.innerHTML = roomInfo.amenities
      .map((amenity) => `<div class="amenity-item"><i class="fas ${getAmenityIcon(amenity)}"></i> ${t(amenity)}</div>`)
      .join("");
  }

  if (descCard) {
    descCard.innerHTML = `<p>${t(roomInfo.description)}</p>`;
  }
}

function renderStarsMarkup(rating) {
  const normalized = Math.max(0, Math.min(5, Number(rating || 0)));
  let html = "";
  for (let index = 1; index <= 5; index += 1) {
    html += `<i class="${normalized >= index ? "fas" : "far"} fa-star"></i>`;
  }
  return html;
}

function getRatingCountsObject(source) {
  return {
    5: Number(source?.[5] ?? source?.["5"] ?? 0),
    4: Number(source?.[4] ?? source?.["4"] ?? 0),
    3: Number(source?.[3] ?? source?.["3"] ?? 0),
    2: Number(source?.[2] ?? source?.["2"] ?? 0),
    1: Number(source?.[1] ?? source?.["1"] ?? 0),
  };
}

function applyReviewSummary(data) {
  reviewState = {
    averageRating: Number(data?.averageRating || 0),
    totalReviews: Number(data?.totalReviews || 0),
    ratingCounts: getRatingCountsObject(data?.ratingCounts || {}),
    reviews: Array.isArray(data?.reviews) ? data.reviews : [],
  };

  const averageRatingValue = document.getElementById("averageRatingValue");
  const averageRatingStars = document.getElementById("averageRatingStars");
  const averageRatingNote = document.getElementById("averageRatingNote");
  const reviewCountTitle = document.getElementById("reviewCountTitle");

  if (averageRatingValue) {
    averageRatingValue.textContent = reviewState.averageRating.toFixed(1);
  }
  if (averageRatingStars) {
    averageRatingStars.innerHTML = renderStarsMarkup(reviewState.averageRating);
  }
  if (averageRatingNote) {
    averageRatingNote.textContent =
      reviewState.totalReviews > 0
        ? `${reviewState.totalReviews} review${reviewState.totalReviews > 1 ? "s" : ""}`
        : "No ratings yet";
  }
  if (reviewCountTitle) {
    reviewCountTitle.textContent = String(reviewState.totalReviews);
  }

  for (let rating = 5; rating >= 1; rating -= 1) {
    const count = reviewState.ratingCounts[rating] || 0;
    const countEl = document.getElementById(`ratingCount${rating}`);
    const barEl = document.getElementById(`ratingBar${rating}`);
    if (countEl) {
      countEl.textContent = String(count);
    }
    if (barEl) {
      const width = reviewState.totalReviews > 0 ? (count / reviewState.totalReviews) * 100 : 0;
      barEl.style.width = `${width}%`;
    }
  }

  initRoomData();
  renderReviewsList();
}

async function loadReviews() {
  try {
    const response = await fetch(`/api/room-comments?type=${encodeURIComponent(pageType)}&rank=${encodeURIComponent(pageRank)}`);
    if (!response.ok) {
      throw new Error("Could not load reviews.");
    }
    const data = await response.json();
    applyReviewSummary(data);
  } catch (error) {
    console.error(error);
  }
}

function getFilteredReviews() {
  const ratingFilter = document.getElementById("reviewRatingTrigger")?.dataset.value || "all";
  const sortType = document.getElementById("reviewSortTrigger")?.dataset.value || "newest";
  const items = [...reviewState.reviews];

  const filtered = ratingFilter === "all"
    ? items
    : items.filter((review) => Number(review.rating) === Number(ratingFilter));

  filtered.sort((left, right) => {
    const leftTime = new Date(left.createdAt || 0).getTime();
    const rightTime = new Date(right.createdAt || 0).getTime();
    return sortType === "oldest" ? leftTime - rightTime : rightTime - leftTime;
  });

  return filtered;
}

function createReviewItemMarkup(review) {
  const safeAuthorName = escapeHtml(review.authorName || "Guest");
  const safeAuthorInitial = escapeHtml(review.authorInitial || "G");
  const safeCreatedAtText = escapeHtml(review.createdAtText || "");
  const safeContent = escapeHtml(review.content || "");
  const avatar = review.avatarUrl
    ? `<img class="review-avatar" src="${escapeHtml(review.avatarUrl)}" alt="${safeAuthorName}">`
    : `<div class="review-avatar-placeholder">${safeAuthorInitial}</div>`;

  return `
    <article class="review-item">
      <div class="review-item-header">
        <div class="review-author">
          ${avatar}
          <div class="review-author-meta">
            <strong>${safeAuthorName}</strong>
            <span>${safeCreatedAtText}</span>
          </div>
        </div>
        <div class="review-rating" aria-label="${review.rating} stars">
          ${renderStarsMarkup(review.rating)}
        </div>
      </div>
      <div class="review-content">${safeContent}</div>
    </article>
  `;
}

function renderReviewsList() {
  const list = document.getElementById("reviewsList");
  const empty = document.getElementById("reviewsEmptyState");
  if (!list || !empty) {
    return;
  }

  const items = getFilteredReviews();
  if (!items.length) {
    list.innerHTML = "";
    empty.style.display = "block";
    empty.textContent = reviewState.totalReviews
      ? "No reviews match the selected filter."
      : "No reviews yet. Be the first to comment on this room.";
    return;
  }

  empty.style.display = "none";
  list.innerHTML = items.map(createReviewItemMarkup).join("");
}

function setSelectedReviewRating(value) {
  selectedReviewRating = Number(value || 0);
  document.querySelectorAll(".review-star-btn").forEach((button) => {
    const buttonValue = Number(button.dataset.value || 0);
    button.classList.toggle("active", buttonValue <= selectedReviewRating);
    const icon = button.querySelector("i");
    if (icon) {
      icon.className = `${buttonValue <= selectedReviewRating ? "fas" : "far"} fa-star`;
    }
  });
}

function setReviewFormMessage(message, mode = "") {
  const formMessage = document.getElementById("reviewFormMessage");
  if (!formMessage) {
    return;
  }
  formMessage.textContent = message || "";
  formMessage.classList.remove("error", "success");
  if (mode) {
    formMessage.classList.add(mode);
  }
}

async function submitReview() {
  if (!window.isLoggedIn) {
    setReviewFormMessage("Please log in with a customer account to send a review.", "error");
    return;
  }
  if (!selectedReviewRating) {
    setReviewFormMessage("Please choose a star rating before sending.", "error");
    return;
  }

  const contentEl = document.getElementById("reviewContent");
  const submitBtn = document.getElementById("submitReviewBtn");
  const content = String(contentEl?.value || "").trim();

  if (!content) {
    setReviewFormMessage("Please write your comment before sending.", "error");
    return;
  }

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    setReviewFormMessage("Sending review...");

    const response = await fetch("/api/room-comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomType: pageType,
        roomRank: pageRank,
        content,
        rating: selectedReviewRating,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Could not send review.");
    }

    const data = await response.json();
    applyReviewSummary(data);
    if (contentEl) {
      contentEl.value = "";
    }
    setSelectedReviewRating(0);
    setReviewFormMessage("Review sent successfully.", "success");
  } catch (error) {
    console.error(error);
    setReviewFormMessage(error.message || "Could not send review.", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
    }
  }
}

function initReviewSection() {
  document.querySelectorAll(".review-star-btn").forEach((button) => {
    button.addEventListener("click", () => setSelectedReviewRating(button.dataset.value));
  });

  document.getElementById("submitReviewBtn")?.addEventListener("click", submitReview);

  document.querySelectorAll(".reviews-dropdown-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const dropdown = trigger.closest(".reviews-dropdown");
      const willOpen = !dropdown?.classList.contains("open");
      document.querySelectorAll(".reviews-dropdown.open").forEach((item) => {
        item.classList.remove("open");
        item.querySelector(".reviews-dropdown-trigger")?.setAttribute("aria-expanded", "false");
      });
      if (dropdown && willOpen) {
        dropdown.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.querySelectorAll("[data-dropdown-option]").forEach((option) => {
    option.addEventListener("click", () => {
      const targetId = option.dataset.target;
      const target = document.getElementById(targetId);
      const dropdown = option.closest(".reviews-dropdown");
      if (!target || !dropdown) {
        return;
      }

      target.dataset.value = option.dataset.value || "";
      const label = target.querySelector(".reviews-dropdown-label");
      if (label) {
        label.textContent = option.textContent || "";
      }

      dropdown.querySelectorAll(".reviews-dropdown-option").forEach((item) => {
        item.classList.toggle("active", item === option);
      });

      dropdown.classList.remove("open");
      target.setAttribute("aria-expanded", "false");
      renderReviewsList();
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".reviews-dropdown.open").forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".reviews-dropdown-trigger")?.setAttribute("aria-expanded", "false");
    });
  });
}

function createThumbnails(container) {
  container.innerHTML = "";
  galleryImages.forEach((img, index) => {
    const thumb = document.createElement("div");
    thumb.className = `thumbnail ${index === 0 ? "active" : ""}`;
    thumb.innerHTML = `<img src="${img.thumb}" alt="${img.alt}">`;
    thumb.addEventListener("click", () => setActiveImage(index));
    container.appendChild(thumb);
  });
}

function setActiveImage(index) {
  currentIndex = index;
  const mainImage = document.getElementById("mainImage");
  if (mainImage) {
    mainImage.src = galleryImages[currentIndex].url;
  }
  document.querySelectorAll(".thumbnail").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("active", thumbIndex === currentIndex);
  });
}

function initGallery() {
  const thumbnailStrip = document.getElementById("thumbnailStrip");
  const prevBtn = document.getElementById("prevImage");
  const nextBtn = document.getElementById("nextImage");
  const mainImage = document.getElementById("mainImage");

  if (!thumbnailStrip) {
    return;
  }

  createThumbnails(thumbnailStrip);
  setActiveImage(0);

  prevBtn?.addEventListener("click", () => {
    setActiveImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
  });

  nextBtn?.addEventListener("click", () => {
    setActiveImage((currentIndex + 1) % galleryImages.length);
  });

  mainImage?.addEventListener("click", () => openLightbox(galleryImages[currentIndex].url));
}

function openLightbox(imgSrc) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (!lightbox || !lightboxImg) {
    return;
  }
  lightboxImg.src = imgSrc;
  lightbox.classList.add("active");
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.querySelector(".close-lightbox");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  if (!lightbox) {
    return;
  }

  closeBtn?.addEventListener("click", () => lightbox.classList.remove("active"));
  prevBtn?.addEventListener("click", () => {
    setActiveImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
    if (lightboxImg) {
      lightboxImg.src = galleryImages[currentIndex].url;
    }
  });
  nextBtn?.addEventListener("click", () => {
    setActiveImage((currentIndex + 1) % galleryImages.length);
    if (lightboxImg) {
      lightboxImg.src = galleryImages[currentIndex].url;
    }
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === lightboxImg) {
      lightbox.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      lightbox.classList.remove("active");
    }
  });
}

function updateAvailabilityBox(titleText, bodyText, mode = "") {
  const box = document.getElementById("availabilityBox");
  const title = document.getElementById("availabilityTitle");
  const text = document.getElementById("availabilityText");
  if (!box || !title || !text) {
    return;
  }

  box.classList.remove("available", "unavailable");
  if (mode) {
    box.classList.add(mode);
  }
  title.textContent = titleText;
  text.textContent = bodyText;
}

function setDateBounds() {
  const today = getTodayString();
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");

  if (checkinInput) {
    checkinInput.min = today;
    if (!checkinInput.value || checkinInput.value < today) {
      checkinInput.value = today;
    }
  }

  if (checkoutInput) {
    checkoutInput.min = checkinInput?.value || today;
    if (!checkoutInput.value || checkoutInput.value <= (checkinInput?.value || today)) {
      const nextDay = new Date(`${checkinInput?.value || today}T00:00:00`);
      nextDay.setDate(nextDay.getDate() + 1);
      checkoutInput.value = nextDay.toISOString().split("T")[0];
    }
  }
}

async function refreshAvailability() {
  const checkin = document.getElementById("checkin")?.value;
  const checkout = document.getElementById("checkout")?.value;

  availabilityState = { loaded: false, available: false, availableCount: 0 };

  if (!checkin || !checkout || !pageType || !pageRank) {
    updateAvailabilityBox(
      "Select dates to check availability",
      "Availability will be calculated for the exact date range you choose.",
    );
    return;
  }

  if (checkin < getTodayString()) {
    updateAvailabilityBox("Invalid check-in date", "Check-in date cannot be in the past.", "unavailable");
    return;
  }

  if (checkout <= checkin) {
    updateAvailabilityBox("Invalid date range", "Check-out must be after check-in.", "unavailable");
    return;
  }

  try {
    const response = await fetch(`/api/rooms/availability?type=${encodeURIComponent(pageType)}&rank=${encodeURIComponent(pageRank)}&checkIn=${checkin}&checkOut=${checkout}`);
    if (!response.ok) {
      throw new Error("Availability lookup failed");
    }

    const data = await response.json();
    availabilityState = {
      loaded: true,
      available: Boolean(data.available),
      availableCount: Number(data.availableCount || 0),
    };

    if (availabilityState.available) {
      updateAvailabilityBox(
        `${availabilityState.availableCount} room(s) available`,
        "This room type is available for the selected dates.",
        "available",
      );
    } else {
      updateAvailabilityBox(
        "No rooms available",
        "This room type and rank are sold out for the selected dates.",
        "unavailable",
      );
    }
  } catch (error) {
    console.error(error);
    updateAvailabilityBox(
      "Availability unavailable",
      "Could not check room availability right now.",
      "unavailable",
    );
  }
}

function updateTotal() {
  const checkin = document.getElementById("checkin")?.value;
  const checkout = document.getElementById("checkout")?.value;
  const totalPrice = document.getElementById("totalPrice");
  if (!checkin || !checkout || !totalPrice) {
    return;
  }

  const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
  totalPrice.textContent = formatVND(Math.max(0, nights) * Number(roomInfo.price || 0));
}

async function syncBookingCard() {
  setDateBounds();
  updateTotal();
  await refreshAvailability();
}

function readCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function writeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeRoom(id) {
  const nextCart = readCart().filter((room) => String(room.id) !== String(id));
  writeCart(nextCart);
  loadCartUI();
}

function loadCartUI() {
  const cart = readCart();
  const count = document.getElementById("cartCount");
  const container = document.getElementById("cartItems");
  const totalText = document.getElementById("cartTotalText");

  if (count) {
    count.textContent = `(${cart.length})`;
  }

  if (!container) {
    return;
  }

  container.innerHTML = "";
  const completeItems = cart.filter((room) => room.checkin && room.checkout);
  const total = completeItems.reduce((sum, room) => sum + Number(room.price || 0), 0);

  if (!cart.length) {
    container.innerHTML = `<p class="cart-empty-state">${t("booking.empty")}</p>`;
  } else {
    container.innerHTML = cart
      .map((room) => {
        const detailUrl =
          room.detailUrl ||
          `/room-detail?rank=${encodeURIComponent(room.roomRank || pageRank)}&type=${encodeURIComponent(room.roomType || pageType)}`;

        return `
          <div class="cart-item-card ${room.draft ? "draft-item" : ""}">
            <div class="cart-item-image">
              <img src="${room.image || roomInfo.image}" alt="${room.name}">
            </div>
            <div class="cart-item-body">
              <h4>${room.name}</h4>
              <div class="cart-item-meta">
                <span><i class="fas fa-user"></i> ${room.guests || guestCount} guests</span>
                ${room.size ? `<span><i class="fas fa-ruler-combined"></i> ${room.size} m²</span>` : ""}
              </div>
              <div class="cart-item-price">
                ${room.draft ? room.priceText || "Select dates to calculate total" : formatVND(room.price)}
              </div>
              ${
                room.draft
                  ? `<p class="cart-item-note">${t("booking.completeDates")}</p>`
                  : `
                    <div class="cart-item-stay">
                      <div class="stay-date-chip">
                        <span class="stay-chip-label">${t("booking.checkin")}</span>
                        <strong>${room.checkin}</strong>
                      </div>
                      <div class="stay-arrow"><i class="fas fa-arrow-right"></i></div>
                      <div class="stay-date-chip">
                        <span class="stay-chip-label">${t("booking.checkout")}</span>
                        <strong>${room.checkout}</strong>
                      </div>
                      <div class="stay-night-badge">${room.nights} ${t("booking.nights")}</div>
                    </div>
                  `
              }
              <div class="cart-item-actions">
                ${
                  room.draft
                    ? `<a class="btn-detail" href="${detailUrl}">${t("booking.chooseDates")}</a>`
                    : ""
                }
                <button class="btn-remove-cart" data-id="${room.id}">
                  <i class="fas fa-trash"></i> Remove
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  if (totalText) {
    totalText.textContent = formatVND(total);
  }

  container.querySelectorAll(".btn-remove-cart").forEach((button) => {
    button.addEventListener("click", () => removeRoom(button.dataset.id));
  });
}

function buildCartItem() {
  const checkin = document.getElementById("checkin")?.value;
  const checkout = document.getElementById("checkout")?.value;

  if (!checkin || !checkout) {
    throw new Error("Please select check-in and check-out dates.");
  }
  if (checkin < getTodayString()) {
    throw new Error("Check-in date cannot be in the past.");
  }
  if (checkout <= checkin) {
    throw new Error("Check-out must be after check-in.");
  }
  if (!availabilityState.loaded || !availabilityState.available) {
    throw new Error("No rooms available for the selected dates.");
  }

  const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
  return {
    id: Date.now(),
    draft: false,
    name: `${pageType} ${pageRank}`,
    roomType: pageType,
    roomRank: pageRank,
    image: roomInfo.image,
    size: roomInfo.size,
    price: nights * Number(roomInfo.price || 0),
    checkin,
    checkout,
    guests: guestCount,
    nights,
  };
}

function addCurrentRoomToCart() {
  const room = buildCartItem();
  const cart = readCart().filter(
    (item) =>
      !(
        item.draft &&
        String(item.roomType).toLowerCase() === pageType &&
        String(item.roomRank).toLowerCase() === pageRank
      ),
  );
  cart.push(room);
  writeCart(cart);
  loadCartUI();
  showToast(t("booking.added"));
}

function validateCheckoutCart(cart) {
  const incompleteItem = cart.find((item) => !item.checkin || !item.checkout || item.draft);
  if (incompleteItem) {
    throw new Error(t("booking.completeDates"));
  }
}

async function checkoutCart(payMode) {
  const cart = readCart();
  if (!cart.length) {
    throw new Error(t("booking.empty"));
  }
  validateCheckoutCart(cart);

  const payload = {
    payMode,
    items: cart.map((item) => {
      const parsed = parseTypeRank(item.name);
      return {
        roomType: parsed.roomType,
        roomRank: parsed.roomRank,
        checkIn: item.checkin,
        checkOut: item.checkout,
        guests: item.guests,
        price: item.price,
      };
    }),
  };

  const response = await fetch("/api/customer-bookings/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Checkout failed");
  }

  const result = await response.json();
  const checkInDates = cart.map((item) => item.checkin).filter(Boolean).sort();
  const checkOutDates = cart.map((item) => item.checkout).filter(Boolean).sort();

  persistBookingNotification({
    groupCode: result.groupCode,
    status: result.status,
    totalAmount: result.totalAmount,
    roomCount: cart.length,
    checkIn: checkInDates[0] || "",
    checkOut: checkOutDates[checkOutDates.length - 1] || "",
    createdAt: new Date().toISOString(),
  });

  localStorage.removeItem("cart");
  loadCartUI();
  showToast("Booking saved successfully. Staff will assign the room(s) later.");
}

function initBookingCard() {
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const guestCountSpan = document.getElementById("guestCount");
  const decrementBtn = document.getElementById("decrementGuest");
  const incrementBtn = document.getElementById("incrementGuest");
  const addRoomBtn = document.getElementById("addRoomBtn");
  const payNowBtn = document.getElementById("payNowBtn");
  const payLaterBtn = document.getElementById("payLaterBtn");
  const toggleCartBtn = document.getElementById("toggleCart");
  const cartModal = document.getElementById("cartModal");
  const closeCartBtn = document.getElementById("closeCartModal");
  const clearCartBtn = document.getElementById("clearCartBtn");

  if (guestCountSpan) {
    guestCountSpan.textContent = String(guestCount);
  }

  checkin?.addEventListener("change", async () => {
    const checkoutInput = document.getElementById("checkout");
    if (checkoutInput) {
      checkoutInput.min = checkin.value || getTodayString();
    }
    await syncBookingCard();
  });

  checkout?.addEventListener("change", syncBookingCard);

  incrementBtn?.addEventListener("click", () => {
    if (guestCount < 8) {
      guestCount += 1;
      if (guestCountSpan) {
        guestCountSpan.textContent = String(guestCount);
      }
    }
  });

  decrementBtn?.addEventListener("click", () => {
    if (guestCount > 1) {
      guestCount -= 1;
      if (guestCountSpan) {
        guestCountSpan.textContent = String(guestCount);
      }
    }
  });

  addRoomBtn?.addEventListener("click", () => {
    try {
      addCurrentRoomToCart();
    } catch (error) {
      alert(error.message || "Could not add room to cart.");
    }
  });

  payNowBtn?.addEventListener("click", () => {
    try {
      if (!readCart().length) {
        addCurrentRoomToCart();
      }
      validateCheckoutCart(readCart());
      const returnUrl = buildRoomDetailUrl(pageRank, pageType);
      window.location.href = `/checkout/payment?returnUrl=${encodeURIComponent(returnUrl)}`;
    } catch (error) {
      alert(error.message || "Could not start payment.");
    }
  });

  payLaterBtn?.addEventListener("click", async () => {
    try {
      if (!readCart().length) {
        addCurrentRoomToCart();
      }
      await checkoutCart("PAY_LATER");
    } catch (error) {
      alert(error.message || "Checkout failed.");
    }
  });

  toggleCartBtn?.addEventListener("click", () => {
    loadCartUI();
    cartModal?.classList.add("active");
  });

  closeCartBtn?.addEventListener("click", () => {
    cartModal?.classList.remove("active");
  });

  cartModal?.addEventListener("click", (event) => {
    if (event.target === cartModal) {
      cartModal.classList.remove("active");
    }
  });

  clearCartBtn?.addEventListener("click", () => {
    writeCart([]);
    loadCartUI();
  });
}

function initEvents() {
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
  });
}

function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 500, once: true, offset: 60 });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  setDateBounds();
  const priceValue = document.getElementById("priceValue");
  if (priceValue && roomInfo.price > 0) {
    priceValue.textContent = formatVND(roomInfo.price);
  }
  initRoomData();
  initReviewSection();
  initGallery();
  initLightbox();
  initBookingCard();
  initEvents();
  initAOS();
  loadCartUI();
  await loadReviews();
  await loadPriceFromDB(pageType, pageRank);
  await loadSimilarPrices();
  await syncBookingCard();
});

window.removeRoom = removeRoom;
window.roomDetail = {
  roomInfo,
  openLightbox,
};
