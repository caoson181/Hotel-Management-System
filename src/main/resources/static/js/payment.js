const params = new URLSearchParams(window.location.search);
const bookingId = params.get("bookingId");

// load total
fetch(`/api/bookings/${bookingId}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("totalPrice").innerText =
            "$" + (data.totalAmount || 0);
    });

const btn = document.getElementById("payBtn");

btn.onclick = () => {
    btn.disabled = true;
    btn.innerText = "Processing...";

    fetch(`/api/bookings/${bookingId}/pay`, {
        method: "POST"
    })
        .then(res => res.json())
        .then(() => {
            alert("✅ Payment success");
            window.location.href = "/";
        })
        .catch(err => console.error(err));
};
// nút VNPay riêng
document.getElementById("vnpayBtn").onclick = () => {
    const totalText = document
        .getElementById("totalPrice")
        .innerText.replace("$", "");

    const amount = Number(totalText);

    window.location.href = `/create-payment?amount=${amount}&bookingId=${bookingId}`;
};

