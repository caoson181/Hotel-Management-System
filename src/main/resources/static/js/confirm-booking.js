const params = new URLSearchParams(window.location.search);

const type = params.get("type");
const rank = params.get("rank");
const checkin = params.get("checkin");
const checkout = params.get("checkout");

document.getElementById("roomInfo").textContent = `${rank} - ${type}`;
document.getElementById("checkin").textContent = checkin;
document.getElementById("checkout").textContent = checkout;

fetch(`/rooms/api/filter?type=${type}&rank=${rank}`)
    .then(res => res.json())
    .then(data => renderRooms(data));

;
document.getElementById("confirmBtn").onclick = () => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const cart = JSON.parse(localStorage.getItem("bookingCart")) || [];

    if (!currentUser) {
        alert("User not loaded!");
        return;
    }

    if (mode === "multi") {
        if (cart.length === 0) {
            alert("⚠️ No rooms selected!");
            return;
        }

        const payload = {
            customerId: currentUser.customerId,
            customerName: currentUser.fullName,
            email: currentUser.email,
            phone: currentUser.phoneNumber,
            rooms: cart.map(r => ({
                roomType: r.type,
                roomRank: r.rank,
                checkInTime: r.checkin,
                checkOutTime: r.checkout,
                guests: r.guests,
                price: r.price
            })),
            totalAmount: cart.reduce((sum, r) => sum + Number(r.price), 0),
            bookingTime: new Date().toISOString()
        };

        fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(() => {
                alert("✅ Multi booking success!");
                localStorage.removeItem("bookingCart");
                window.location.href = "/";
            });

        return;
    }

    // SINGLE
    const type = params.get("type");
    const rank = params.get("rank");
    const checkin = params.get("checkin");
    const checkout = params.get("checkout");

    const totalText = document.getElementById("totalPrice").innerText.replace(/[^\d]/g, "");

    const payload = {
        customerId: currentUser.customerId,
        customerName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phoneNumber,
        totalAmount: Number(totalText),
        roomType: type,
        roomRank: rank,
        checkInTime: checkin,
        checkOutTime: checkout,
        bookingTime: new Date().toISOString()
    };

    fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(() => {
            alert("✅ Booking success!");
            localStorage.removeItem("bookingCart");
            window.location.href = "/";
        });
};
function renderRooms(rooms) {
    const container = document.getElementById("roomList");
    container.innerHTML = "";

    rooms.forEach(room => {
        const div = document.createElement("div");
        div.className = "room-card";

        div.textContent = room.roomNumber;

        if (room.status.toUpperCase() === "AVAILABLE") {
            div.classList.add("available");

            div.onclick = () => {
                selectedRoomId = room.id;

                document.querySelectorAll(".room-card")
                    .forEach(el => el.classList.remove("selected"));

                div.classList.add("selected");
            };

        } else {
            div.classList.add("unavailable");
        }

        container.appendChild(div);
    });
}
let currentUser = null;
fetch("/api/users/me")
    .then(res => res.json())
    .then(user => {
        currentUser = user;
        document.getElementById("fullName").textContent = user.fullName;
        document.getElementById("gender").textContent = user.gender;
        document.getElementById("dob").textContent = formatDate(user.dateOfBirth);
        document.getElementById("phone").textContent = user.phoneNumber;
        document.getElementById("email").textContent = user.email;
    })
    .catch(err => console.error(err));

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
}
document.addEventListener("DOMContentLoaded", () => {
    const total = localStorage.getItem("bookingTotal") || "$0";

    const el = document.getElementById("totalPrice");
    if (el) {
        el.innerText = total;
    }
});


function loadBookingSummary() {
    const cart = JSON.parse(localStorage.getItem("bookingCart")) || [];
    const container = document.getElementById("bookingSummary");
    container.innerHTML = "";

    let grandTotal = 0;

    cart.forEach(room => {
        grandTotal += Number(room.price);

        const card = document.createElement("div");
        card.className = "booking-item";
        card.innerHTML = `
            <div class="booking-item-title">🏨 ${room.name}</div>
            <div class="booking-item-row">📅 ${formatDate(room.checkin)} → ${formatDate(room.checkout)}</div>
            <div class="booking-item-row">👤 ${room.guests} guests</div>
            <div class="booking-item-price">${formatVND(room.price)}</div>
        `;
        container.appendChild(card);
    });

    const total = document.createElement("div");
    total.className = "booking-total";
    total.innerHTML = `Total: <strong>${formatVND(grandTotal)}</strong>`;
    container.appendChild(total);
}

document.addEventListener("DOMContentLoaded", () => {
    loadBookingSummary();
});

// ================= HELPERS =================
function formatVND(number) {
    return Number(number).toLocaleString("vi-VN") + " đ";
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    const isMultiBooking = mode === "multi";

    if (isMultiBooking) {
        document.getElementById("singleBookingSection").style.display = "none";
        document.getElementById("multiBookingSection").style.display = "block";

        loadBookingSummary();

    } else {
        document.getElementById("singleBookingSection").style.display = "block";
        document.getElementById("multiBookingSection").style.display = "none";

        const type = params.get("type");
        const rank = params.get("rank");
        const checkin = params.get("checkin");
        const checkout = params.get("checkout");

        document.getElementById("roomInfo").textContent = `${rank} - ${type}`;
        document.getElementById("checkin").textContent = checkin;
        document.getElementById("checkout").textContent = checkout;

        fetch(`/rooms/api/filter?type=${type}&rank=${rank}`)
            .then(res => res.json())
            .then(data => renderRooms(data));
    }

    // load user
    fetch("/api/users/me")
        .then(res => res.json())
        .then(user => {
            currentUser = user;
            document.getElementById("fullName").textContent = user.fullName;
            document.getElementById("gender").textContent = user.gender;
            document.getElementById("dob").textContent = formatDate(user.dateOfBirth);
            document.getElementById("phone").textContent = user.phoneNumber;
            document.getElementById("email").textContent = user.email;
        });
});

window.addEventListener("pageshow", () => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("mode") === "single") {
        localStorage.removeItem("bookingCart");
    }
});

