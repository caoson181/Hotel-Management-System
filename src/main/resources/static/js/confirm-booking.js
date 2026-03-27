const params = new URLSearchParams(window.location.search);

const type = params.get("type");
const rank = params.get("rank");
const checkin = params.get("checkin");
const checkout = params.get("checkout");

document.getElementById("roomInfo").textContent = `${rank} - ${type}`;
document.getElementById("checkin").textContent = checkin;
document.getElementById("checkout").textContent = checkout;

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