// View Room JavaScript - Cho Receptionist và Housekeeping

// Sample data
let rooms = window.rooms || [];
let userRole = "";
let allBookings = []; // Store all bookings data

// Status flow theo role
const statusFlows = {
  receptionist: {
    available: ["reserved", "occupied"],
    reserved: ["occupied"],
    occupied: ["checked-out"],
    "checked-out": [],
    housekeeping: [],
  },
  manager: {
    available: ["reserved", "occupied"],
    reserved: ["occupied"],
    occupied: ["checked-out"],
    "checked-out": [],
    housekeeping: [],
  },
  housekeeping: {
    "checked-out": ["housekeeping"],
    housekeeping: ["available"],
    available: [],
    reserved: [],
    occupied: [],
  },
};

// State
let currentFilter = "all";
let currentSort = {
  field: "roomNumber",
  order: "asc",
};
let searchTerm = "";
let currentPage = 0;
let currentTypeFilter = "all";
let currentRankFilter = "all";
const itemsPerPage = 10;

// DOM Elements
let tableBody,
  searchInput,
  sortSelect,
  sortAsc,
  sortDesc,
  statusCircles,
  pagination,
  roleIndicator;
let typeFilter, rankFilter, bookingsTableBody;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  userRole = (window.userRoleFromServer || "receptionist")
    .replace("ROLE_", "")
    .toLowerCase();

  if (userRole === "housekeeper") {
    userRole = "housekeeping";
  }
  console.log("View Room JS loaded - Role:", userRole);

  // Get DOM elements
  tableBody = document.getElementById("tableBody");
  searchInput = document.getElementById("searchInput");
  sortSelect = document.getElementById("sortSelect");
  sortAsc = document.getElementById("sortAsc");
  sortDesc = document.getElementById("sortDesc");
  statusCircles = document.querySelectorAll(".status-circle");
  pagination = document.getElementById("pagination");
  roleIndicator = document.getElementById("userRole");
  typeFilter = document.getElementById("typeFilter");
  rankFilter = document.getElementById("rankFilter");
  bookingsTableBody = document.getElementById("bookingsTableBody");

  // Set role indicator
  if (roleIndicator) {
    roleIndicator.textContent =
      userRole.charAt(0).toUpperCase() + userRole.slice(1);
  }

  // Initial render
  loadRooms();
  fetchBookingsData();

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase();
      currentPage = 0;
      renderTable();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort.field = e.target.value;
      renderTable();
    });
  }

  if (sortAsc) {
    sortAsc.addEventListener("click", () => {
      sortAsc.classList.add("active");
      if (sortDesc) sortDesc.classList.remove("active");
      currentSort.order = "asc";
      renderTable();
    });
  }

  if (sortDesc) {
    sortDesc.addEventListener("click", () => {
      sortDesc.classList.add("active");
      if (sortAsc) sortAsc.classList.remove("active");
      currentSort.order = "desc";
      renderTable();
    });
  }

  // Type filter
  if (typeFilter) {
    typeFilter.addEventListener("change", (e) => {
      currentTypeFilter = e.target.value;
      currentPage = 0;
      renderTable();
    });
  }

  // Rank filter
  if (rankFilter) {
    rankFilter.addEventListener("change", (e) => {
      currentRankFilter = e.target.value;
      currentPage = 0;
      renderTable();
    });
  }

  // Status filter
  if (statusCircles) {
    statusCircles.forEach((circle) => {
      circle.addEventListener("click", () => {
        statusCircles.forEach((c) => c.classList.remove("active"));
        circle.classList.add("active");
        currentFilter = circle.dataset.status;
        currentPage = 0;
        renderTable();
      });
    });
  }

  // Close all dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".action-dropdown")) {
      document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  });
});

// Load rooms from backend (or from window.rooms initial payload)
function loadRooms() {
  fetch("/rooms/api")
    .then((res) => res.json())
    .then((data) => {
      rooms = data.map((r) => ({
        ...r,
        status: (r.status || "").toLowerCase(),
      }));
      currentPage = 0;
      renderTable();
    })
    .catch((error) => {
      console.error("Error loading rooms:", error);
      // fallback to window.rooms if present
      rooms = (window.rooms || []).map((r) => ({
        ...r,
        status: (r.status || "").toLowerCase(),
      }));
      currentPage = 0;
      renderTable();
    });
}

// Render table
function renderTable() {
  if (!tableBody) return;

  let roomsData = (rooms || []).map((r) => ({
    id: r.id,
    roomNumber: r.roomNumber,
    roomType: r.roomType,
    roomRank: r.roomRank,
    status: (r.status || "").toLowerCase(),
  }));

  // Apply filters
  let filteredRooms = roomsData.filter((room) => {
    if (currentFilter !== "all" && room.status !== currentFilter) {
      return false;
    }
    if (currentTypeFilter !== "all" && room.roomType !== currentTypeFilter) {
      return false;
    }
    if (currentRankFilter !== "all" && room.roomRank !== currentRankFilter) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (
        !room.roomNumber.toLowerCase().includes(q) &&
        !room.roomType.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  // Apply sorting
  filteredRooms.sort((a, b) => {
    let fieldA = a[currentSort.field] || "";
    let fieldB = b[currentSort.field] || "";

    if (typeof fieldA === "string") {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }

    if (fieldA < fieldB) return currentSort.order === "asc" ? -1 : 1;
    if (fieldA > fieldB) return currentSort.order === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRooms.length / itemsPerPage),
  );
  if (currentPage >= totalPages) currentPage = totalPages - 1;
  const startIndex = currentPage * itemsPerPage;
  const pageRooms = filteredRooms.slice(startIndex, startIndex + itemsPerPage);

  // Render table rows
  if (pageRooms.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; padding:40px;">No rooms found</td></tr>';
  } else {
    tableBody.innerHTML = pageRooms
      .map(
        (room) => `
            <tr>
                <td><strong>${escapeHtml(room.roomNumber)}</strong></td>
                <td>${escapeHtml(room.roomType)}</td>
                <td>
                    <span class="status-badge status-${escapeHtml(room.status)}">
                        ${formatStatus(room.status)}
                    </span>
                </td>
                <td>${escapeHtml(room.roomRank)}</td>
                <td>${renderActionDropdown(room)}</td>
            </tr>
        `,
      )
      .join("");
  }

  renderPagination(totalPages);
  initDropdowns();
}

// Render action dropdown theo role và status
function renderActionDropdown(room) {
  const role = (userRole || "").toLowerCase();
  const status = (room.status || "").toLowerCase().trim();

  const allowedStatuses = statusFlows[role]?.[status] || [];

  // ❌ No permission at all
  if (role === "admin") {
    return '<span class="no-action">—</span>';
  }

  let dropdownContent = "";

  // ✅ AVAILABLE → ONLY ASSIGN (NO STATUS OPTIONS)
  if (status === "available") {
    if (role === "receptionist" || role === "manager") {
      dropdownContent = `
                <div class="dropdown-item" style="padding: 8px 12px;">
                    <input type="text" placeholder="Customer ID"
                        class="customer-id-input"
                        id="customerId_${room.id}" style="width: 100%;">
                </div>
                <div class="dropdown-item"
                    onclick="assignRoomToCustomer(${room.id})">
                    <i class="fas fa-user-plus"></i> Assign to Customer
                </div>
            `;
    } else {
      return '<span class="no-action">—</span>';
    }
  }

  // ✅ OTHER STATUS → ONLY STATUS FLOW (NO ASSIGN)
  else {
    if (allowedStatuses.length === 0) {
      return '<span class="no-action">—</span>';
    }

    dropdownContent = allowedStatuses
      .map(
        (s) => `
            <div class="dropdown-item"
                onclick="changeRoomStatus(${room.id}, '${s}')">
                <i class="fas ${getStatusIcon(s)}"></i>
                ${formatStatus(s)}
            </div>
        `,
      )
      .join("");
  }

  return `
        <div class="action-dropdown">
            <button class="dropdown-btn">
                ${status === "available" ? "Assign" : "Actions"}
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="dropdown-menu">
                ${dropdownContent}
            </div>
        </div>
    `;
}

function resetDropdownPosition(menu) {
  menu.style.position = "";
  menu.style.top = "";
  menu.style.left = "";
  menu.style.right = "";
  menu.style.minWidth = "";
  menu.style.visibility = "";
}

function setDropdownPosition(menu, button) {
  const btnRect = button.getBoundingClientRect();

  menu.style.position = "fixed";
  menu.style.right = "auto";
  menu.style.minWidth = `${button.offsetWidth}px`;
  menu.style.visibility = "hidden";
  menu.classList.add("show");

  const menuRect = menu.getBoundingClientRect();
  let top = btnRect.bottom + 8;
  let left = btnRect.right - menuRect.width;

  if (left < 8) {
    left = 8;
  }
  if (top + menuRect.height > window.innerHeight - 8) {
    top = btnRect.top - menuRect.height - 8;
  }

  menu.style.top = `${top}px`;
  menu.style.left = `${left}px`;
  menu.style.visibility = "visible";
}

// Initialize dropdowns
function initDropdowns() {
  document.querySelectorAll(".action-dropdown").forEach((dropdown) => {
    const btn = dropdown.querySelector(".dropdown-btn");
    const menu = dropdown.querySelector(".dropdown-menu");

    if (btn && menu) {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        document.querySelectorAll(".dropdown-menu.show").forEach((m) => {
          if (m !== menu) {
            m.classList.remove("show");
            resetDropdownPosition(m);
          }
        });

        if (menu.classList.contains("show")) {
          menu.classList.remove("show");
          resetDropdownPosition(menu);
        } else {
          setDropdownPosition(menu, btn);
        }
      };
    }
  });
}

// Change room status
function changeRoomStatus(roomId, newStatus) {
  // Call API to update status
  fetch(`/api/rooms/${roomId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((response) => {
      if (response.ok) {
        // Show success message
        showNotification(
          `Room status changed to ${formatStatus(newStatus)}`,
          "success",
        );
        // Refresh data and table
        loadRooms();
      } else {
        showNotification("Failed to change room status", "error");
      }
    })
    .catch((error) => {
      console.error("Error changing room status:", error);
      showNotification("Error changing room status", "error");
    });
}

// Assign room to customer
function assignRoomToCustomer(roomId) {
  const input = document.getElementById(`customerId_${roomId}`);
  const customerId = input ? input.value.trim() : "";

  if (!customerId) {
    showNotification("Please enter Customer ID", "warning");
    return;
  }

  // Call API to assign room to customer
  fetch(`/rooms/api/${roomId}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customerId: customerId }),
  })
    .then(async (response) => {
      if (response.ok) {
        showNotification(`Room assigned to customer ${customerId}`, "success");
        if (input) input.value = "";
        loadRooms();
        fetchBookingsData();
      } else {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        showNotification(errorText || "Failed to assign room", "error");
      }
    })
    .catch((error) => {
      console.error("Error assigning room:", error);
      showNotification("Error assigning room", "error");
    });
}

// Fetch bookings data
function fetchBookingsData() {
  fetch("/api/customer-bookings/groups")
    .then((res) => res.json())
    .then((data) => {
      allBookings = data;
      populateBookingsTable(data);
    })
    .catch((error) => {
      console.error("Error fetching bookings:", error);
      // For demo, show empty state
      populateBookingsTable([]);
    });
}

// Populate bookings table
function populateBookingsTable(bookings) {
  if (!bookingsTableBody) return;

  bookingsTableBody.innerHTML = "";

  if (!bookings || bookings.length === 0) {
    const row = bookingsTableBody.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 4; // Booking ID, Customer ID, Status, Action
    cell.textContent = "No bookings found";
    cell.style.textAlign = "center";
    cell.style.padding = "40px";
    cell.style.color = "#6c757d";
    cell.style.fontSize = "14px";
    return;
  }

  bookings.forEach((booking) => {
    const row = bookingsTableBody.insertRow();
    row.className = "booking-row";
    row.style.cursor = "pointer";

    // Booking ID
    const cellBookingId = row.insertCell(0);
    cellBookingId.textContent = booking.bookingId || booking.booking_id || "N/A";

    // Customer ID
    const cellId = row.insertCell(1);
    cellId.textContent = booking.customerId || booking.customer_id || "N/A";

    // Payment + assign status
    const cellStatus = row.insertCell(2);
    cellStatus.textContent = booking.displayStatus || "UNPAID/UNASSIGNED";

    // View detail button
    const cellAction = row.insertCell(3);
    const viewBtn = document.createElement("button");
    viewBtn.className = "view-details-btn";
    viewBtn.innerHTML = '<i class="fas fa-eye"></i> View';
    viewBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.showBookingDetailsModal) {
        window.showBookingDetailsModal(booking);
      }
    };
    cellAction.appendChild(viewBtn);

    // Make row clickable
    row.addEventListener("click", (e) => {
      if (
        e.target.tagName !== "BUTTON" &&
        !e.target.closest(".view-details-btn")
      ) {
        if (window.showBookingDetailsModal) {
          window.showBookingDetailsModal(booking);
        }
      }
    });
  });
}

// Render pagination
function renderPagination(totalPages) {
  if (!pagination) return;

  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i + 1;
    btn.classList.add("page-btn");

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable();
    });

    pagination.appendChild(btn);
  }
}

// Helper function to escape HTML
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>"']/g, function (m) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m];
  });
}

// Format status
function formatStatus(status) {
  switch (status) {
    case "available":
      return "Available";
    case "reserved":
      return "Reserved";
    case "occupied":
      return "Occupied";
    case "checked-out":
      return "Checked Out";
    case "housekeeping":
      return "Housekeeping";
    default:
      return status;
  }
}

// Get status icon
function getStatusIcon(status) {
  switch (status) {
    case "available":
      return "fa-check-circle";
    case "reserved":
      return "fa-clock";
    case "occupied":
      return "fa-user";
    case "checked-out":
      return "fa-sign-out-alt";
    case "housekeeping":
      return "fa-broom";
    default:
      return "fa-circle";
  }
}

// Show notification
function showNotification(message, type = "info") {
  // You can implement a toast notification here
  alert(message); // Simple alert for now
}

// Make functions globally available
window.changeRoomStatus = changeRoomStatus;
window.assignRoomToCustomer = assignRoomToCustomer;

// Booking Details Modal Handler
document.addEventListener("DOMContentLoaded", function () {
  const bookingModal = document.getElementById("bookingDetailsModal");
  const bookingModalClose = bookingModal
    ? bookingModal.querySelector(".booking-modal-close")
    : null;
  const bookingModalOverlay = bookingModal
    ? bookingModal.querySelector(".booking-modal-overlay")
    : null;

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.style.display = "none";
      document.body.style.overflow = "";
    }
  }

  function openBookingModal() {
    if (bookingModal) {
      bookingModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  if (bookingModalClose) {
    bookingModalClose.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeBookingModal();
    });
  }

  if (bookingModalOverlay) {
    bookingModalOverlay.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeBookingModal();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      bookingModal &&
      bookingModal.style.display === "flex"
    ) {
      closeBookingModal();
    }
  });

  const modalContainer = bookingModal
    ? bookingModal.querySelector(".booking-modal-container")
    : null;
  if (modalContainer) {
    modalContainer.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  window.showBookingDetailsModal = function (booking) {
    const modalBody = document.getElementById("bookingDetailsBody");
    if (!modalBody) return;

    const detailsHtml = `
            <div class="booking-detail-item">
                <label>Booking ID</label>
                <div class="detail-value">${escapeHtml(booking.bookingId || "N/A")}</div>
            </div>
            <div class="booking-detail-item">
                <label>Customer ID</label>
                <div class="detail-value">${escapeHtml(booking.customerId || "N/A")}</div>
            </div>
            <div class="booking-detail-item">
                <label>Status</label>
                <div class="detail-value">
                    <span class="status-badge">${escapeHtml(booking.displayStatus || "UNPAID/UNASSIGNED")}</span>
                </div>
            </div>
            <div class="booking-detail-item">
                <label>Group Code</label>
                <div class="detail-value">${escapeHtml(booking.groupCode || "N/A")}</div>
            </div>
            <div class="booking-detail-item">
                <label>Booking Details</label>
                <div class="detail-value">${escapeHtml(booking.details || "N/A")}</div>
            </div>
            <div class="booking-detail-item">
                <label>Total Amount</label>
                <div class="detail-value">${booking.totalAmount != null ? Number(booking.totalAmount).toLocaleString("vi-VN") + " VND" : "N/A"}</div>
            </div>
        `;

    modalBody.innerHTML = detailsHtml;
    openBookingModal();
  };
});
