// =======================
// STATE
// =======================
let rooms = [];
let currentFilter = 'all';
let currentSort = {
    field: 'roomNumber',
    order: 'asc'
};
let searchTerm = '';
let currentPage = 1;
const itemsPerPage = 10;

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
    loadRooms();
    updateSortOrderButtons();

    document.getElementById("searchInput")?.addEventListener("input", (e) => {
        searchTerm = e.target.value.toLowerCase();
        currentPage = 1;
        renderTable();
    });

    document.getElementById("sortSelect")?.addEventListener("change", (e) => {
        currentSort.field = e.target.value;
        renderTable();
    });

    document.getElementById("sortAsc")?.addEventListener("click", () => {
        currentSort.order = "asc";
        updateSortOrderButtons();
        renderTable();
    });

    document.getElementById("sortDesc")?.addEventListener("click", () => {
        currentSort.order = "desc";
        updateSortOrderButtons();
        renderTable();
    });

    document.querySelectorAll(".status-circle").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".status-circle").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.status;
            currentPage = 1;
            renderTable();
        });
    });

    document.getElementById("roomForm")?.addEventListener("submit", saveRoom);
});

// =======================
// LOAD DATA FROM BACKEND
// =======================
function loadRooms() {
    fetch("/rooms/api")
        .then(res => res.json())
        .then(data => {
            rooms = data;
            renderTable();
        })
        .catch(err => console.error("Load rooms error:", err));
}

// =======================
// UTIL
// =======================
function getStatusClass(status) {
    return status.toLowerCase().replace(" ", "-");
}

function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(value);
}

function updateSortOrderButtons() {
    const sortAscBtn = document.getElementById("sortAsc");
    const sortDescBtn = document.getElementById("sortDesc");
    if (!sortAscBtn || !sortDescBtn) return;

    sortAscBtn.classList.toggle("active", currentSort.order === "asc");
    sortDescBtn.classList.toggle("active", currentSort.order === "desc");
}

// =======================
// RENDER TABLE
// =======================
function renderTable() {
    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;

    let filtered = rooms.filter(room => {
        if (currentFilter !== 'all' && room.status.toLowerCase() !== currentFilter) return false;

        if (searchTerm) {
            return room.roomNumber.toLowerCase().includes(searchTerm) ||
                room.roomType.toLowerCase().includes(searchTerm);
        }

        return true;
    });

    // SORT
    filtered.sort((a, b) => {
        let aVal = a[currentSort.field];
        let bVal = b[currentSort.field];

        if (currentSort.field === "roomNumber") {
            aVal = parseInt(aVal);
            bVal = parseInt(bVal);
        }

        return currentSort.order === "asc"
            ? (aVal > bVal ? 1 : -1)
            : (aVal < bVal ? 1 : -1);
    });

    // PAGINATION
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(start, start + itemsPerPage);

    // RENDER
    tableBody.innerHTML = pageData.map(room => `
        <tr>
            <td><strong>${room.roomNumber}</strong></td>
            <td>${room.roomType}</td>
            <td>
                <span class="status-badge status-${getStatusClass(room.status)}">
                    ${room.status}
                </span>
            </td>
            <td>${formatCurrency(room.basePrice)}</td>
            <td>${formatCurrency(room.price)}</td>
            <td>${room.roomRank}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon" onclick="viewRoom(${room.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editRoom(${room.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteRoom(${room.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");

    renderPagination(totalPages);
}

// =======================
// PAGINATION
// =======================
function renderPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`;
    }

    pagination.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    renderTable();
}

// =======================
// VIEW
// =======================
function viewRoom(id) {
    fetch(`/rooms/api/${id}`)
        .then(res => res.json())
        .then(room => {

            const html = `
                <div class="detail-item">
                    <div class="detail-label">Room Number:</div>
                    <div class="detail-value"><strong>${room.roomNumber}</strong></div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Room Type:</div>
                    <div class="detail-value">${room.roomType}</div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Status:</div>
                    <div class="detail-value">
                        <span class="status-badge status-${getStatusClass(room.status)}">
                            ${room.status}
                        </span>
                    </div>
                </div>
                
                

                <div class="detail-item">
                    <div class="detail-label">Base Price:</div>
                    <div class="detail-value">${formatCurrency(room.basePrice)}</div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Current Price:</div>
                    <div class="detail-value">${formatCurrency(room.price)}</div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Room Rank:</div>
                    <div class="detail-value">${room.roomRank}</div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Description:</div>
                    <div class="detail-value">${room.description || "-"}</div>
                </div>

            `;

            document.getElementById("detailModalBody").innerHTML = html;

            openModal("detailModal");
        })
        .catch(err => {
            console.error(err);
            alert("Cannot load room details");
        });
}
// =======================
// ADD / EDIT
// =======================
function openAddModal() {
    document.getElementById("modalTitle").innerText = "Add Room";
    document.getElementById("roomForm").reset();
    document.getElementById("roomId").value = "";
    openModal("formModal");
}

function editRoom(id) {
    fetch(`/rooms/api/${id}`)
        .then(res => res.json())
        .then(room => {
            document.getElementById("modalTitle").innerText = "Edit Room";

            document.getElementById("roomId").value = room.id;
            document.getElementById("room_number").value = room.roomNumber;
            document.getElementById("room_type").value = room.roomType;
            document.getElementById("status").value = room.status;
            document.getElementById("base_price").value = room.basePrice;
            document.getElementById("price").value = room.price;
            document.getElementById("room_rank").value = room.roomRank;
            document.getElementById("description").value = room.description || "";

            openModal("formModal");
        });
}

function saveRoom(e) {
    e.preventDefault();

    const id = document.getElementById("roomId").value;

    const room = {
        roomNumber: document.getElementById("room_number").value,
        roomType: document.getElementById("room_type").value,
        status: document.getElementById("status").value,
        basePrice: parseFloat(document.getElementById("base_price").value),
        price: parseFloat(document.getElementById("price").value),
        roomRank: document.getElementById("room_rank").value,
        description: document.getElementById("description").value
    };

    const url = id ? `/rooms/api/${id}` : `/rooms/api`;
    const method = id ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(room)
    })
        .then(res => {
            if (!res.ok) return res.text().then(msg => { throw new Error(msg); });
            return res.json();
        })
        .then(() => {
            alert(id ? "Updated!" : "Added!");
            closeModal("formModal");
            loadRooms();
        })
        .catch(err => alert(err.message));
}

// =======================
// DELETE
// =======================
function deleteRoom(id) {
    if (!confirm("Delete this room?")) return;

    fetch(`/rooms/api/${id}`, { method: "DELETE" })
        .then(() => {
            loadRooms();
        });
}

// =======================
// MODAL
// =======================
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// =======================
// GLOBAL
// =======================
window.viewRoom = viewRoom;
window.editRoom = editRoom;
window.deleteRoom = deleteRoom;
window.openAddModal = openAddModal;
window.closeModal = closeModal;
window.goToPage = goToPage;
