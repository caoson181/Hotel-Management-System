const staffModal = document.getElementById("staffModal");
const staffModalCloseBtn = document.querySelector("#staffModal .close");
const statusEl = document.getElementById("m-status");

function closeStaffModal() {
  staffModal?.classList.remove("show");
}

document.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!staffModal || !statusEl) {
      return;
    }

    statusEl.classList.remove("active", "disabled");

    document.getElementById("m-id").innerText = btn.dataset.id || "N/A";
    document.getElementById("m-name").innerText = btn.dataset.name || "N/A";
    document.getElementById("m-email").innerText = btn.dataset.email || "N/A";
    document.getElementById("m-phone").innerText = btn.dataset.phone || "N/A";
    document.getElementById("m-gender").innerText = btn.dataset.gender || "N/A";
    document.getElementById("m-role").innerText = btn.dataset.role || "N/A";
    document.getElementById("m-salary").innerText = btn.dataset.salary || "N/A";
    document.getElementById("m-hiredate").innerText = btn.dataset.hiredate || "N/A";

    if (btn.dataset.status === "true") {
      statusEl.textContent = "Active";
      statusEl.classList.add("active");
    } else {
      statusEl.textContent = "Disabled";
      statusEl.classList.add("disabled");
    }

    staffModal.classList.add("show");
  });
});

staffModalCloseBtn?.addEventListener("click", closeStaffModal);
staffModal?.addEventListener("click", (event) => {
  if (event.target === staffModal) {
    closeStaffModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeStaffModal();
  }
});
