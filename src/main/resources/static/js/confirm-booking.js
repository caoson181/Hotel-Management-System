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
