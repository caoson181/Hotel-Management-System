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
    fetch("/api/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            customerId: window.customerId,
            roomType: type,
            roomRank: rank,
            checkIn: checkin,
            checkOut: checkout
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