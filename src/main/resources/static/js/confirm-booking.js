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

document.getElementById("confirmBtn").onclick = () => {
    if (!currentUser) {
        alert("User not loaded yet!");
        return;
    }

    const totalText = document.getElementById("totalPrice").innerText.replace("$", "");
    fetch("/api/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
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
        })
    })
        .then(res => res.json())
        .then(() => {
            alert("✅ Booking confirmed!");
            window.location.href = "/";
        })
        .catch(err => console.error(err));



    const payload = {
        customerName: currentUser?.fullName || "",
        email: currentUser?.email || "",
        phone: currentUser?.phoneNumber || "",
        totalAmount: Number(totalText) || 0,
        roomType: type || "",
        roomRank: rank || "",
        checkInTime: checkin,
        checkOutTime: checkout,
        bookingTime: new Date().toISOString().slice(0, 19)
    };

    console.log("PAYLOAD:", payload);

    fetch("/api/bookings/preview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(data => {
            const bookingId = data.id || data.bookingId;
            window.location.href = `/homepage/payment?bookingId=${bookingId}&total=${totalText}`;
        })
        .catch(err => console.error(err));
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

        const div = document.createElement("div");
        div.style.border = "1px solid #eee";
        div.style.borderRadius = "10px";
        div.style.padding = "15px";
        div.style.marginBottom = "10px";
        div.style.background = "#fafafa";

        div.innerHTML = `
      <div style="display:flex; justify-content:space-between;">
        <div>
          <h4 style="margin:0;">🏨 ${room.name}</h4>

          <p style="margin:5px 0; color:#666;">
            📅 ${formatDate(room.checkin)} → ${formatDate(room.checkout)}
            (${room.nights} nights)
          </p>

          <p style="margin:5px 0; color:#666;">
            👤 ${room.guests} guests
          </p>
        </div>

        <div style="text-align:right;">
          <p style="margin:0; font-weight:bold;">
            ${formatVND(room.price)}
          </p>
          <small style="color:#999;">
            ${formatVND(room.price / room.nights)} / night
          </small>
        </div>
      </div>
    `;

        container.appendChild(div);
    });

    // total
    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `
    <div style="
      margin-top:15px;
      padding-top:10px;
      border-top:2px solid #ddd;
      font-size:18px;
    ">
      🧾 <b>Total: ${formatVND(grandTotal)}</b>
    </div>
  `;

    container.appendChild(totalDiv);
}

document.addEventListener("DOMContentLoaded", () => {
    loadBookingSummary();
});
function formatVND(number) {
    return Number(number).toLocaleString("vi-VN") + " đ";
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
}
document.getElementById("confirmBtn").onclick = () => {
    const cart = JSON.parse(localStorage.getItem("bookingCart")) || [];

    if (cart.length === 0) {
        alert("⚠️ No rooms selected!");
        return;
    }

    if (!currentUser) {
        alert("User not loaded!");
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

    console.log("PAYLOAD:", payload);

    fetch("/api/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(() => {
            alert("✅ Booking success!");

            // clear cart sau khi đặt
            localStorage.removeItem("cart");
            localStorage.removeItem("bookingCart");

            window.location.href = "/";
        })
        .catch(err => console.error(err));
};
