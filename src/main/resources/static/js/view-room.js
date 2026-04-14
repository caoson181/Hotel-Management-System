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
let currentCheckInFilter = "";
let currentCheckOutFilter = "";
let selectedRoomId = null;
let selectedRoomNumber = "";
let selectedRoomTimeline = null;
let currentCalendarMonth = null;
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
let typeFilter, rankFilter, bookingsTableBody, dateCheckInInput, dateCheckOutInput;
let roomTimelineContainer, roomTimelineBody, roomTimelineSubtitle, timelineCloseBtn;

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
  dateCheckInInput = document.getElementById("dateCheckIn");
  dateCheckOutInput = document.getElementById("dateCheckOut");
  roomTimelineContainer = document.getElementById("roomTimelineContainer");
  roomTimelineBody = document.getElementById("roomTimelineBody");
  roomTimelineSubtitle = document.getElementById("roomTimelineSubtitle");
  timelineCloseBtn = document.getElementById("timelineCloseBtn");

  const today = new Date().toISOString().split("T")[0];
  if (dateCheckInInput) {
    dateCheckInInput.min = today;
  }
  if (dateCheckOutInput) {
    dateCheckOutInput.min = today;
  }

  // Set role indicator
  if (roleIndicator) {
    roleIndicator.textContent =
      userRole.charAt(0).toUpperCase() + userRole.slice(1);
  }

  if (timelineCloseBtn) {
    timelineCloseBtn.addEventListener("click", () => {
      clearSelectedTimeline();
    });
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
      loadRooms();
    });
  }

  // Rank filter
  if (rankFilter) {
    rankFilter.addEventListener("change", (e) => {
      currentRankFilter = e.target.value;
      currentPage = 0;
      loadRooms();
    });
  }

  if (dateCheckInInput) {
    dateCheckInInput.addEventListener("change", (e) => {
      currentCheckInFilter = e.target.value;
      if (dateCheckOutInput) {
        dateCheckOutInput.min = currentCheckInFilter || today;
      }
      currentPage = 0;
      loadRooms();
    });
  }

  if (dateCheckOutInput) {
    dateCheckOutInput.addEventListener("change", (e) => {
      currentCheckOutFilter = e.target.value;
      currentPage = 0;
      loadRooms();
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
  const params = new URLSearchParams();
  if (currentCheckInFilter) params.set("checkIn", currentCheckInFilter);
  if (currentCheckOutFilter) params.set("checkOut", currentCheckOutFilter);
  if (currentTypeFilter !== "all") params.set("type", currentTypeFilter);
  if (currentRankFilter !== "all") params.set("rank", currentRankFilter);

  fetch(`/api/rooms/availability-list?${params.toString()}`)
    .then((res) => res.json())
    .then((data) => {
      rooms = data.map((r) => ({
        ...r,
        status: (r.status || "").toLowerCase(),
        dateStatus: (r.dateStatus || "").toLowerCase(),
        hasActiveBookingToday: Boolean(r.hasActiveBookingToday),
        hasNoShowCandidateToday: Boolean(r.hasNoShowCandidateToday),
      }));
      currentPage = 0;
      renderTable();
      syncSelectedRoomState();
    })
    .catch((error) => {
      console.error("Error loading rooms:", error);
      rooms = [];
      currentPage = 0;
      renderTable();
      syncSelectedRoomState();
    });
}

// Render table
function renderTable() {
  if (!tableBody) return;

  const hasDateFilter = Boolean(currentCheckInFilter && currentCheckOutFilter);
  let roomsData = (rooms || []).map((r) => ({
    id: r.id,
    roomNumber: r.roomNumber,
    roomType: r.roomType,
    roomRank: r.roomRank,
    status: (r.status || "").toLowerCase(),
    dateStatus: (r.dateStatus || "").toLowerCase(),
    dateLabel: r.dateLabel || "",
    availableForRange: r.availableForRange !== false,
    hasActiveBookingToday: Boolean(r.hasActiveBookingToday),
    hasNoShowCandidateToday: Boolean(r.hasNoShowCandidateToday),
  }));

  // Apply filters
  let filteredRooms = roomsData.filter((room) => {
    const effectiveStatus = hasDateFilter
      ? (room.availableForRange ? "available" : "reserved")
      : room.status;
    if (currentFilter !== "all" && effectiveStatus !== currentFilter) {
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
                <td class="room-number-cell">
                    <button type="button"
                        class="room-number-btn ${selectedRoomId === room.id ? "active" : ""}"
                        onclick="toggleRoomTimeline(${room.id}, '${escapeJs(room.roomNumber)}')">
                        <strong>${escapeHtml(room.roomNumber)}</strong>
                    </button>
                </td>
                <td>${escapeHtml(room.roomType)}</td>
                <td>
                    <span class="status-badge status-${escapeHtml(
                      hasDateFilter
                        ? room.availableForRange
                          ? "available"
                          : "reserved"
                        : room.status,
                    )}">
                        ${escapeHtml(
                          hasDateFilter
                            ? room.dateLabel || (room.availableForRange ? "Available for selected dates" : "Booked in selected dates")
                            : formatStatus(room.status),
                        )}
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
  const hasDateFilter = Boolean(currentCheckInFilter && currentCheckOutFilter);
  const canAssignForSelectedDates = !hasDateFilter || room.availableForRange;
  const hasActiveBookingToday = Boolean(room.hasActiveBookingToday);
  const hasNoShowCandidateToday = Boolean(room.hasNoShowCandidateToday);

  const allowedStatuses = statusFlows[role]?.[status] || [];

  // ❌ No permission at all
  if (role === "admin") {
    return '<span class="no-action">—</span>';
  }

  let dropdownContent = "";
  if (status === "available" && !canAssignForSelectedDates) {
    return '<span class="no-action">—</span>';
  }


  // ✅ AVAILABLE → ASSIGN, plus occupied action if room has an active booking today
  if (status === "available" && canAssignForSelectedDates) {
    if (role === "receptionist" || role === "manager") {
      dropdownContent = `
                <div class="dropdown-item" style="padding: 8px 12px;">
                    <input type="text" placeholder="Customer ID"
                        class="customer-id-input"
                        id="customerId_${room.id}" style="width: 100%;">
                </div>
                <div class="dropdown-item" style="padding: 8px 12px;">
                    <input type="text" placeholder="Customer Booking ID"
                        class="customer-booking-id-input"
                        id="customerBookingId_${room.id}" style="width: 100%;">
                </div>
                <div class="dropdown-item"
                    onclick="assignRoomToCustomer(${room.id})">
                    <i class="fas fa-user-plus"></i> Assign to Customer
                </div>
            `;
      if (hasActiveBookingToday) {
        dropdownContent += `
                <div class="dropdown-divider"></div>
                <div class="dropdown-item"
                    onclick="changeRoomStatus(${room.id}, 'occupied')">
                    <i class="fas ${getStatusIcon("occupied")}"></i>
                    ${formatStatus("occupied")}
                </div>
            `;
      } else if (hasNoShowCandidateToday) {
        dropdownContent += `
                <div class="dropdown-divider"></div>
                <div class="dropdown-item"
                    onclick="markNoShow(${room.id})">
                    <i class="fas fa-user-slash"></i>
                    Mark No-show
                </div>
            `;
      }
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
                ${status === "available" && !hasActiveBookingToday ? "Assign" : "Actions"}
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
  fetch(`/api/rooms/${roomId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  })
    .then(async (response) => {
      if (response.ok) {
        showNotification(
          `Room status changed to ${formatStatus(newStatus)}`,
          "success",
        );
        loadRooms();
      } else {
        const errorText = await response.text();
        showNotification(extractErrorMessage(errorText) || "Failed to change room status", "error");
      }
    })
    .catch((error) => {
      console.error("Error changing room status:", error);
      showNotification("Error changing room status", "error");
    });
}

// Assign room to customer
function assignRoomToCustomer(roomId) {
  const customerInput = document.getElementById(`customerId_${roomId}`);
  const customerBookingInput = document.getElementById(
    `customerBookingId_${roomId}`,
  );
  const customerId = customerInput ? customerInput.value.trim() : "";
  const customerBookingId = customerBookingInput
    ? customerBookingInput.value.trim()
    : "";

  if (!customerId) {
    showNotification("Please enter Customer ID", "warning");
    return;
  }
  if (!customerBookingId) {
    showNotification("Please enter Customer Booking ID", "warning");
    return;
  }

  // Call API to assign room to customer
  fetch(`/rooms/api/${roomId}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerId: customerId,
      customerBookingId: customerBookingId,
    }),
  })
    .then(async (response) => {
      if (response.ok) {
        showNotification(
          `Room assigned to customer ${customerId} for booking ${customerBookingId}`,
          "success",
        );
        if (customerInput) customerInput.value = "";
        if (customerBookingInput) customerBookingInput.value = "";
        loadRooms();
        fetchBookingsData();
      } else {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        showNotification(extractErrorMessage(errorText) || "Failed to assign room", "error");
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
      const sortedBookings = sortBookingsByGroup(data);
      allBookings = sortedBookings;
      populateBookingsTable(sortedBookings);
    })
    .catch((error) => {
      console.error("Error fetching bookings:", error);
      // For demo, show empty state
      populateBookingsTable([]);
    });
}

function sortBookingsByGroup(bookings) {
  const groups = new Map();
  const groupOrder = new Map();

  bookings.forEach((booking) => {
    const groupKey = booking.groupCode || `__single__${booking.bookingId || booking.booking_id}`;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
      groupOrder.set(groupKey, Number(booking.bookingId || booking.booking_id || 0));
    }
    groups.get(groupKey).push(booking);
  });

  const unfinishedGroups = [];
  const completedRows = [];

  Array.from(groups.entries())
    .sort((a, b) => (groupOrder.get(a[0]) || 0) - (groupOrder.get(b[0]) || 0))
    .forEach(([, group]) => {
      const sortedGroup = [...group].sort((a, b) => {
        const idA = Number(a.bookingId || a.booking_id || 0);
        const idB = Number(b.bookingId || b.booking_id || 0);
        return idA - idB;
      });

      const activeRows = sortedGroup.filter((booking) => !booking.completed);
      const doneRows = sortedGroup.filter((booking) => booking.completed);

      if (activeRows.length > 0) {
        unfinishedGroups.push(activeRows);
      }
      completedRows.push(...doneRows);
    });

  completedRows.sort((a, b) => {
    const dateA = a.actualCheckOut || a.checkOut || "";
    const dateB = b.actualCheckOut || b.checkOut || "";
    if (dateA !== dateB) {
      return dateA.localeCompare(dateB);
    }
    const idA = Number(a.bookingId || a.booking_id || 0);
    const idB = Number(b.bookingId || b.booking_id || 0);
    return idA - idB;
  });

  return [...unfinishedGroups.flat(), ...completedRows];
}

// Populate bookings table
function populateBookingsTable(bookings) {
  if (!bookingsTableBody) return;

  bookingsTableBody.innerHTML = "";

  if (!bookings || bookings.length === 0) {
    const row = bookingsTableBody.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 5;
    cell.textContent = "No bookings found";
    cell.style.textAlign = "center";
    cell.style.padding = "40px";
    cell.style.color = "#6c757d";
    cell.style.fontSize = "14px";
    return;
  }

  bookings.forEach((booking, index) => {
    const previousBooking = index > 0 ? bookings[index - 1] : null;
    const nextBooking = index < bookings.length - 1 ? bookings[index + 1] : null;
    const sameGroupAsPrevious =
      previousBooking &&
      !previousBooking.completed &&
      !booking.completed &&
      previousBooking.groupCode &&
      booking.groupCode &&
      previousBooking.groupCode === booking.groupCode;
    const sameGroupAsNext =
      nextBooking &&
      !nextBooking.completed &&
      !booking.completed &&
      nextBooking.groupCode &&
      booking.groupCode &&
      nextBooking.groupCode === booking.groupCode;

    const row = bookingsTableBody.insertRow();
    row.className = "booking-row";
    row.style.cursor = "pointer";
    if (booking.completed) {
      row.classList.add("booking-row-completed");
    }
    if (sameGroupAsPrevious) {
      row.classList.add("booking-row-group-member");
    } else {
      row.classList.add("booking-row-group-start");
    }
    if (sameGroupAsNext) {
      row.classList.add("booking-row-no-divider");
    } else {
      row.classList.add("booking-row-group-end");
    }

    // Booking ID
    const cellBookingId = row.insertCell(0);
    cellBookingId.textContent = booking.bookingId || booking.booking_id || "N/A";

    // Customer ID
    const cellId = row.insertCell(1);
    cellId.textContent = booking.customerId || booking.customer_id || "N/A";

    // Assigned room number
    const cellRoomNumber = row.insertCell(2);
    cellRoomNumber.textContent = booking.roomNumber || "—";

    // Payment + assign status
    const cellStatus = row.insertCell(3);
    cellStatus.textContent = booking.displayStatus || "UNPAID/UNASSIGNED";

    // View detail button
    const cellAction = row.insertCell(4);
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
  alert(message);
}

function toggleRoomTimeline(roomId, roomNumber) {
  if (selectedRoomId === roomId) {
    clearSelectedTimeline();
    renderTable();
    return;
  }

  selectedRoomId = roomId;
  selectedRoomNumber = roomNumber || "";
  renderTable();
  renderTimelineLoading(roomNumber);

  fetch(`/api/rooms/${roomId}/timeline`)
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(extractErrorMessage(errorText) || "Failed to load room timeline");
      }
      return response.json();
    })
    .then((data) => {
      if (selectedRoomId !== roomId) {
        return;
      }
      renderRoomTimeline(data);
    })
    .catch((error) => {
      console.error("Error loading room timeline:", error);
      if (selectedRoomId !== roomId) {
        return;
      }
      renderTimelineError(roomNumber, error.message || "Failed to load room timeline");
    });
}

function clearSelectedTimeline() {
  selectedRoomId = null;
  selectedRoomNumber = "";
  selectedRoomTimeline = null;
  currentCalendarMonth = null;
  if (roomTimelineContainer) {
    roomTimelineContainer.classList.remove("active");
  }
  if (roomTimelineSubtitle) {
    roomTimelineSubtitle.textContent = "Click a room number in the table to view timeline.";
  }
  if (roomTimelineBody) {
    roomTimelineBody.innerHTML = `
      <div class="room-timeline-empty">
        <i class="fas fa-bed"></i>
        <span>No room selected.</span>
      </div>
    `;
  }
}

function syncSelectedRoomState() {
  if (!selectedRoomId) {
    return;
  }

  const selectedRoom = (rooms || []).find((room) => room.id === selectedRoomId);
  if (!selectedRoom) {
    clearSelectedTimeline();
  }
}

function renderTimelineLoading(roomNumber) {
  if (roomTimelineContainer) {
    roomTimelineContainer.classList.add("active");
  }
  if (roomTimelineSubtitle) {
    roomTimelineSubtitle.textContent = `Loading timeline for room ${roomNumber || selectedRoomNumber}...`;
  }
  if (roomTimelineBody) {
    roomTimelineBody.innerHTML = `
      <div class="room-timeline-empty">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Loading timeline...</span>
      </div>
    `;
  }
}

function renderTimelineError(roomNumber, message) {
  if (roomTimelineContainer) {
    roomTimelineContainer.classList.add("active");
  }
  if (roomTimelineSubtitle) {
    roomTimelineSubtitle.textContent = `Timeline for room ${roomNumber || selectedRoomNumber}`;
  }
  if (roomTimelineBody) {
    roomTimelineBody.innerHTML = `
      <div class="room-timeline-empty room-timeline-error">
        <i class="fas fa-circle-exclamation"></i>
        <span>${escapeHtml(message)}</span>
      </div>
    `;
  }
}

function renderRoomTimeline(payload) {
  if (!roomTimelineContainer || !roomTimelineBody || !roomTimelineSubtitle) {
    return;
  }

  roomTimelineContainer.classList.add("active");
  roomTimelineSubtitle.textContent = `${escapeText(payload.roomNumber)} - ${escapeText(payload.roomType)} - ${escapeText(payload.roomRank)}`;

  const events = Array.isArray(payload.events) ? payload.events : [];
  if (events.length === 0) {
    selectedRoomTimeline = null;
    currentCalendarMonth = null;
    roomTimelineBody.innerHTML = `
      <div class="room-timeline-empty">
        <i class="fas fa-calendar-xmark"></i>
        <span>No booking history for room ${escapeHtml(payload.roomNumber || "")}.</span>
      </div>
    `;
    return;
  }

  selectedRoomTimeline = payload;
  currentCalendarMonth = resolveInitialCalendarMonth(events);
  renderRoomCalendar();
}

function renderRoomCalendar() {
  if (!roomTimelineBody || !selectedRoomTimeline || !currentCalendarMonth) {
    return;
  }

  const monthStart = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1);
  const monthDays = buildCalendarDays(monthStart, selectedRoomTimeline.events || []);
  const eventsHtml = (selectedRoomTimeline.events || [])
    .map(
      (event) => `
        <div class="calendar-booking-item">
          <div class="calendar-booking-item-top">
            <strong>Booking #${escapeHtml(event.bookingId ?? "N/A")}</strong>
            <span class="status-badge status-${escapeHtml(normalizeTimelineStatus(event.bookingStatus || event.status))}">
              ${escapeHtml(formatTimelineStatus(event.bookingStatus || event.status))}
            </span>
          </div>
          <div class="calendar-booking-item-meta">
            Customer ${escapeHtml(event.customerId ?? "N/A")} | ${escapeHtml(formatDateRange(event.checkIn, event.checkOut))}
          </div>
        </div>
      `,
    )
    .join("");

  roomTimelineBody.innerHTML = `
    <div class="calendar-shell">
      <div class="calendar-toolbar">
        <button type="button" class="calendar-nav-btn" onclick="changeRoomCalendarMonth(-1)">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="calendar-toolbar-title">
          <strong>${escapeHtml(formatMonthYear(monthStart))}</strong>
          <span>${escapeHtml(buildCalendarSummary(monthDays))}</span>
        </div>
        <button type="button" class="calendar-nav-btn" onclick="changeRoomCalendarMonth(1)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="calendar-legend">
        <span><i class="fas fa-square legend-booked"></i> Booked day</span>
        <span><i class="fas fa-square legend-checkin"></i> Check-in</span>
        <span><i class="fas fa-square legend-checkout"></i> Check-out</span>
        <span><i class="fas fa-square legend-today"></i> Today</span>
      </div>

      <div class="calendar-weekdays">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      <div class="calendar-grid">
        ${monthDays.map((day) => renderCalendarDay(day)).join("")}
      </div>
    </div>

    <div class="calendar-booking-list">
      <div class="calendar-booking-list-header">
        <h4>Booked Stays</h4>
        <span>${escapeHtml(String((selectedRoomTimeline.events || []).length))} bookings</span>
      </div>
      ${eventsHtml}
    </div>
  `;
}

function buildCalendarDays(monthStart, events) {
  const todayKey = formatDateKey(new Date());
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leadingDays = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - leadingDays);
  const totalCells = 42;
  const days = [];

  for (let i = 0; i < totalCells; i += 1) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    const dateKey = formatDateKey(date);
    const matchedEvents = events.filter((event) => isDateBookedByEvent(date, event));
    const isCheckIn = events.some((event) => formatDateKey(parseLocalDate(event.checkIn)) === dateKey);
    const isCheckOut = events.some((event) => {
      const checkoutDate = getEventCheckoutDate(event);
      return checkoutDate && formatDateKey(checkoutDate) === dateKey;
    });

    days.push({
      date,
      dateKey,
      inMonth: date.getMonth() === month,
      isToday: dateKey === todayKey,
      isBooked: matchedEvents.length > 0,
      isCheckIn,
      isCheckOut,
      bookingCount: matchedEvents.length,
      events: matchedEvents,
    });
  }

  return days;
}

function renderCalendarDay(day) {
  const classes = ["calendar-day"];
  if (!day.inMonth) classes.push("is-outside");
  if (day.isBooked) classes.push("is-booked");
  if (day.isToday) classes.push("is-today");
  if (day.isCheckIn) classes.push("is-checkin");
  if (day.isCheckOut) classes.push("is-checkout");

  const note = day.bookingCount > 0
    ? `${day.bookingCount} booking${day.bookingCount > 1 ? "s" : ""}`
    : "&nbsp;";

  return `
    <div class="${classes.join(" ")}" title="${escapeHtml(buildCalendarDayTitle(day))}">
      <span class="calendar-day-number">${day.date.getDate()}</span>
      <span class="calendar-day-note">${note}</span>
    </div>
  `;
}

function buildCalendarDayTitle(day) {
  if (!day.events.length) {
    return `${formatSingleDate(day.date)}: Available`;
  }

  return `${formatSingleDate(day.date)}: ${day.events
    .map((event) => `Booking #${event.bookingId} (${formatSingleDate(event.checkIn)} -> ${formatSingleDate(event.checkOut)})`)
    .join(", ")}`;
}

function buildCalendarSummary(days) {
  const bookedDays = days.filter((day) => day.inMonth && day.isBooked).length;
  return `${bookedDays} booked day${bookedDays === 1 ? "" : "s"} in this month`;
}

function resolveInitialCalendarMonth(events) {
  const today = new Date();
  const activeEvent = events.find((event) => {
    const start = parseLocalDate(event.checkIn);
    const end = getEventCheckoutDate(event);
    return start && end && start <= today && today < end;
  });

  if (activeEvent) {
    const activeStart = parseLocalDate(activeEvent.checkIn);
    return new Date(activeStart.getFullYear(), activeStart.getMonth(), 1);
  }

  const firstEvent = [...events]
    .map((event) => parseLocalDate(event.checkIn))
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  if (firstEvent) {
    return new Date(firstEvent.getFullYear(), firstEvent.getMonth(), 1);
  }

  return new Date(today.getFullYear(), today.getMonth(), 1);
}

function changeRoomCalendarMonth(offset) {
  if (!currentCalendarMonth) {
    return;
  }

  currentCalendarMonth = new Date(
    currentCalendarMonth.getFullYear(),
    currentCalendarMonth.getMonth() + offset,
    1,
  );
  renderRoomCalendar();
}

function isDateBookedByEvent(date, event) {
  const start = parseLocalDate(event.checkIn);
  const end = getEventCheckoutDate(event);
  if (!start || !end) {
    return false;
  }

  return date >= start && date < end;
}

function getEventCheckoutDate(event) {
  return parseLocalDate(event.actualCheckOut || event.checkOut);
}

function parseLocalDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const text = String(value);
  const parts = text.split("-");
  if (parts.length !== 3) {
    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function formatDateKey(value) {
  const date = value instanceof Date ? value : parseLocalDate(value);
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthYear(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function normalizeTimelineStatus(status) {
  const value = String(status || "").trim().toLowerCase();
  if (value.includes("checked")) return "checked-out";
  if (value.includes("occup")) return "occupied";
  if (value.includes("reserv") || value.includes("assign")) return "reserved";
  if (value.includes("house")) return "housekeeping";
  if (value.includes("cancel")) return "checked-out";
  return "available";
}

function formatTimelineStatus(status) {
  const value = String(status || "").trim();
  if (!value) return "N/A";
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDateRange(checkIn, checkOut) {
  return `${formatSingleDate(checkIn)} -> ${formatSingleDate(checkOut)}`;
}

function formatSingleDate(value) {
  if (!value) {
    return "N/A";
  }

  const date = value instanceof Date ? value : parseLocalDate(value);
  if (!date || Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("vi-VN");
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return String(value);
  }
  return `${amount.toLocaleString("vi-VN")} VND`;
}

function escapeText(value) {
  return value == null ? "" : String(value);
}

function escapeJs(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function extractErrorMessage(rawText) {
  if (!rawText) {
    return "";
  }

  try {
    const parsed = JSON.parse(rawText);
    return parsed.message || parsed.error || "";
  } catch (error) {
    return rawText;
  }
}

function markNoShow(roomId) {
  fetch(`/api/rooms/${roomId}/mark-no-show`, {
    method: "POST",
  })
    .then(async (response) => {
      if (response.ok) {
        showNotification("Booking marked as no-show", "success");
        loadRooms();
        fetchBookingsData();
      } else {
        const errorText = await response.text();
        showNotification(extractErrorMessage(errorText) || "Failed to mark no-show", "error");
      }
    })
    .catch((error) => {
      console.error("Error marking no-show:", error);
      showNotification("Error marking no-show", "error");
    });
}

// Make functions globally available
window.changeRoomStatus = changeRoomStatus;
window.assignRoomToCustomer = assignRoomToCustomer;
window.markNoShow = markNoShow;
window.toggleRoomTimeline = toggleRoomTimeline;
window.changeRoomCalendarMonth = changeRoomCalendarMonth;

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
                <label>Customer Booking ID</label>
                <div class="detail-value">${escapeHtml(booking.bookingId || "N/A")}</div>
            </div>
            <div class="booking-detail-item">
                <label>Customer ID</label>
                <div class="detail-value">${escapeHtml(booking.customerId || "N/A")}</div>
            </div>
            <div class="booking-detail-item">
                <label>Assigned Room</label>
                <div class="detail-value">${escapeHtml(booking.roomNumber || "Not assigned yet")}</div>
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
                <label>Date Range</label>
                <div class="detail-value">${escapeHtml(booking.checkIn || "N/A")} -> ${escapeHtml(booking.checkOut || "N/A")}</div>
            </div>
            <div class="booking-detail-item">
                <label>Total Amount</label>
                <div class="detail-value">${booking.totalAmount != null ? Number(booking.totalAmount).toLocaleString("vi-VN") + " VND" : "N/A"}</div>
            </div>
            <div class="booking-detail-item">
                <label>Action</label>
                <div class="detail-value">
                    ${
                      (userRole === "receptionist" || userRole === "manager") && !booking.cancelled && !booking.completed
                        ? `<button id="assignBookingBtn" class="view-details-btn" ${
                            booking.assigned ? "disabled" : ""
                          }>
                        <i class="fas fa-check"></i> Assign
                    </button>`
                        : '<span class="modal-no-action">No actions available</span>'
                    }
                </div>
            </div>
        `;

    modalBody.innerHTML = detailsHtml;
    const assignBtn = document.getElementById("assignBookingBtn");
    if (assignBtn && !booking.assigned) {
      assignBtn.onclick = () => {
        if (!booking.groupCode) {
          alert("Missing booking group");
          return;
        }
        assignBtn.disabled = true;
        fetch(`/api/customer-bookings/groups/${booking.groupCode}/assign`, {
          method: "POST",
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(errorText || "Assign failed");
            }
            return response.json();
          })
          .then(() => {
            showNotification("Assigned successfully", "success");
            closeBookingModal();
            loadRooms();
            fetchBookingsData();
          })
          .catch((error) => {
            console.error("Assign error:", error);
            showNotification(error.message || "Assign failed", "error");
            assignBtn.disabled = false;
          });
      };
    }
    openBookingModal();
  };
});
