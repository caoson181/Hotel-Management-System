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
      <span><i class="fas fa-star" style="color: #d4af37;"></i> 4.9 (128)</span>
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
  const nextCart = readCart().filter((room) => room.id !== id);
  writeCart(nextCart);
  loadCartUI();
}

function loadCartUI() {
  const cart = readCart();
  const count = document.getElementById("cartCount");
  const container = document.getElementById("cartItems");
  const totalText = document.getElementById("cartTotalText");

  if (count) {
    count.textContent = String(cart.length);
  }

  if (!container) {
    return;
  }

  container.innerHTML = "";
  let total = 0;

  cart.forEach((room) => {
    total += Number(room.price || 0);
    const div = document.createElement("div");
    div.style.border = "1px solid #eee";
    div.style.borderRadius = "10px";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";
    div.style.background = "#fafafa";
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:10px;">
        <div>
          <p style="margin:0; font-weight:600;">${room.name}</p>
          <small style="color:#666;">${room.checkin} -> ${room.checkout} (${room.nights} nights)</small><br/>
          <small style="color:#666;">${room.guests} guests</small><br/>
          <small style="color:#999;">${formatVND(room.price)}</small>
        </div>
        <button onclick="removeRoom(${room.id})" style="color:red;border:none;background:none;cursor:pointer;font-size:16px">X</button>
      </div>
    `;
    container.appendChild(div);
  });

  if (totalText) {
    totalText.textContent = cart.length ? `Total ${formatVND(total)}` : "";
  }

  const totalDiv = document.createElement("div");
  totalDiv.innerHTML = `
    <div style="margin-top:10px; padding-top:10px; border-top:1px solid #ddd; font-size:16px;">
      <b>Total: ${formatVND(total)}</b>
    </div>
  `;
  container.appendChild(totalDiv);
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
    name: `${pageType} ${pageRank}`,
    price: nights * Number(roomInfo.price || 0),
    checkin,
    checkout,
    guests: guestCount,
    nights,
  };
}

function addCurrentRoomToCart() {
  const room = buildCartItem();
  const cart = readCart();
  cart.push(room);
  writeCart(cart);
  loadCartUI();
  showToast("Room added to cart");
}

async function checkoutCart(payMode) {
  const cart = readCart();
  if (!cart.length) {
    throw new Error("Cart is empty.");
  }

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

  await response.json();
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
  const cartIcon = document.getElementById("cartIcon");
  const cartPopup = document.getElementById("cartPopup");

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
      window.location.href = "/checkout/payment";
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

  cartIcon?.addEventListener("click", () => {
    cartPopup?.classList.toggle("hidden");
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
  initGallery();
  initLightbox();
  initBookingCard();
  initEvents();
  initAOS();
  loadCartUI();
  await loadPriceFromDB(pageType, pageRank);
  await loadSimilarPrices();
  await syncBookingCard();
});

window.removeRoom = removeRoom;
window.roomDetail = {
  roomInfo,
  openLightbox,
};
