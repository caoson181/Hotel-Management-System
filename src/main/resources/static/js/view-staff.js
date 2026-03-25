document.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = document.getElementById("staffModal");

    modal.classList.add("show");

    document.getElementById("m-id").innerText = btn.dataset.id;
    document.getElementById("m-name").innerText = btn.dataset.name;
    document.getElementById("m-email").innerText = btn.dataset.email;
    document.getElementById("m-phone").innerText = btn.dataset.phone;
    document.getElementById("m-gender").innerText = btn.dataset.gender;
    document.getElementById("m-role").innerText = btn.dataset.role;
    document.getElementById("m-salary").innerText = btn.dataset.salary || "N/A";
    document.getElementById("m-hiredate").innerText =
      btn.dataset.hiredate || "N/A";

    const statusEl = document.getElementById("m-status");

    if (btn.dataset.status === "true") {
      statusEl.innerHTML = "✔ Active";
      statusEl.classList.add("active");
    } else {
      statusEl.innerHTML = "✖ Disabled";
      statusEl.classList.add("disabled");
    }
  });
});

// close modal
document.querySelector(".close").onclick = () => {
  document.getElementById("staffModal").classList.remove("show");
};
