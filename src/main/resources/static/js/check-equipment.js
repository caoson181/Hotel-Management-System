// User role - change to 'manager' to test manager features
let userRole = "housekeeper";
let currentResolveRoom = null;

// Room data với đầy đủ type và rank
let rooms = [];

// Equipment by rank - đầy đủ cho các rank mới
const equipment = {
  Standard: {
    bedroom1: ["Single Bed", "Wardrobe", "Nightstand", "Lamp", "Desk", "Chair", "TV 32\"", "AC"],
    bathroom1: ["Towels (2)", "Soap", "Shampoo", "Toilet Paper", "Hairdryer"],
    bedroom2: [],
    bathroom2: [],
    living: [],
    kitchen: [],
    bar: [],
  },
  Superior: {
    bedroom1: ["Queen Bed", "Wardrobe", "Nightstand (2)", "Lamp (2)", "Desk", "Chair", "Vanity Mirror", "Smart TV 43\"", "AC", "Safe Box"],
    bathroom1: ["Towels (4)", "Soap", "Shampoo", "Conditioner", "Body Lotion", "Toilet Paper", "Hairdryer", "Bathrobe", "Slippers", "Rain Shower"],
    bedroom2: [],
    bathroom2: [],
    living: [],
    kitchen: [],
    bar: [],
  },
  Deluxe: {
    bedroom1: ["King Bed", "Wardrobe (2)", "Nightstand (2)", "Lamp (2)", "Desk", "Chair (2)", "Vanity Table", "Safe Box", "Smart TV 55\"", "AC", "Blackout Curtains"],
    bathroom1: ["Towels (4)", "Soap", "Shampoo", "Conditioner", "Body Lotion", "Toilet Paper", "Hairdryer", "Bathrobe (2)", "Slippers (2)", "Scale", "Rain Shower"],
    bedroom2: [],
    bathroom2: [],
    living: ["Sofa", "Armchair (2)", "Coffee Table", "Smart TV 55\"", "AC", "Mini Bar", "Welcome Drink"],
    kitchen: ["Water (4)", "Coffee Machine", "Tea Set", "Mini Fridge", "Microwave", "Kettle", "Glassware (4)"],
    bar: [],
  },
  Executive: {
    bedroom1: ["King Bed", "Wardrobe (2)", "Nightstand (2)", "Lamp (3)", "Executive Desk", "Ergonomic Chair", "Vanity Table", "Safe Box", "Workstation", "Smart TV 65\"", "AC", "Blackout Curtains", "Air Purifier"],
    bathroom1: ["Towels (6)", "Soap", "Shampoo", "Conditioner", "Body Lotion", "Toilet Paper", "Hairdryer", "Bathrobe (2)", "Slippers (2)", "Scale", "Jacuzzi", "Rain Shower", "Premium Toiletries"],
    bedroom2: [],
    bathroom2: [],
    living: ["L-Shaped Sofa", "Armchair (2)", "Coffee Table", "Smart TV 55\"", "AC", "Sound System", "Meeting Table", "Mini Bar", "Work Desk"],
    kitchen: ["Water (6)", "Premium Coffee Machine", "Tea Set", "Mini Fridge", "Microwave", "Dishwasher", "Wine Glasses (4)", "Kettle", "Snack Basket"],
    bar: ["Wine Glasses (4)", "Whiskey Glasses (4)", "Ice Bucket", "Cocktail Shaker", "Premium Spirits (4)", "Mini Bar", "Bar Counter"],
  },
  Suite: {
    bedroom1: ["King Bed", "Walk-in Closet", "Nightstand (2)", "Lamp (3)", "Desk", "Chair", "Vanity Table", "Safe Box", "Smart TV 65\"", "AC", "Blackout Curtains", "Air Purifier", "Butler Call Button"],
    bedroom2: ["Queen Bed", "Wardrobe", "Nightstand (2)", "Lamp (2)", "Desk", "Chair", "Vanity Table", "Smart TV 55\"", "AC"],
    bathroom1: ["Towels (8)", "Soap", "Shampoo", "Conditioner", "Body Lotion", "Toilet Paper", "Hairdryer", "Bathrobe (4)", "Slippers (4)", "Scale", "Jacuzzi", "Steam Shower", "Bidet", "Premium Toiletries", "Aromatherapy"],
    bathroom2: ["Towels (4)", "Soap", "Shampoo", "Conditioner", "Toilet Paper", "Hairdryer", "Bathrobe (2)", "Slippers (2)", "Rain Shower"],
    living: ["Grand Sofa", "Armchair (3)", "Coffee Table", "Smart TV 75\"", "AC", "Premium Sound System", "Dining Table (4 seats)", "Mini Bar", "Welcome Champagne", "Fresh Flowers"],
    kitchen: ["Water (8)", "Premium Coffee Machine", "Tea Set", "Full-size Fridge", "Microwave", "Dishwasher", "Oven", "Cookware Set", "Glassware (8)", "Kettle", "Snack Basket"],
    bar: ["Wine Glasses (6)", "Whiskey Glasses (6)", "Champagne Flutes (4)", "Ice Bucket", "Premium Cocktail Set", "Premium Spirits (8)", "Wine Cooler", "Bar Counter", "Bar Stools (2)", "Mini Bar"],
  },
};

let currentRoom = null;
let currentArea = null;
let tempItems = [];
let tempMissing = [];

// Set role display
document.getElementById("userRole").textContent =
  userRole === "manager" ? "Manager" : "Housekeeper";
if (userRole === "manager") {
  document.getElementById("roleBadge").style.background =
    "linear-gradient(135deg, #dc3545, #c82333)";
}

function renderTable() {
  const tbody = document.getElementById("tableBody");
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;

  let filtered = rooms.filter((r) => r.number.toString().includes(searchTerm));
  if (statusFilter === "issues") {
    filtered = filtered.filter((r) => r.status === "issues");
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '|<td colspan="9" class="empty-state">No rooms found</td>|';
    return;
  }

  tbody.innerHTML = filtered
    .map((room) => {
      let rowClass = "";
      if (room.status === "completed") rowClass = "completed";
      if (room.status === "issues") rowClass = "has-issues";

      return `
        <tr class="${rowClass}">
          <td style="text-align:left">
            <div class="room-number">${room.number}</div>
            <div class="room-type-badge">${room.type} - ${room.rank}</div>
           </td>
           <td>${renderButton(room, "bedroom1")}</td>
           <td>${renderButton(room, "bedroom2")}</td>
           <td>${renderButton(room, "bathroom1")}</td>
           <td>${renderButton(room, "bathroom2")}</td>
           <td>${renderButton(room, "living")}</td>
           <td>${renderButton(room, "kitchen")}</td>
           <td>${renderButton(room, "bar")}</td>
           <td>${renderAction(room)}</td>
        </tr>
      `;
    })
    .join("");

  updateStats();
}

function renderButton(room, area) {
  // Kiểm tra xem area này có trong equipment của rank không và có vật dụng không
  const areaExists = equipment[room.rank] && 
                     equipment[room.rank][area] && 
                     equipment[room.rank][area].length > 0;
  
  // Nếu area không tồn tại trong equipment, hiển thị dấu gạch ngang
  if (!areaExists) {
    return '<span style="color: #cbd5e1;">—</span>';
  }
  
  const data = room[area];
  if (!data) {
    return '<span style="color: #cbd5e1;">—</span>';
  }
  
  if (!data.checked) {
    return `<button class="check-btn" onclick="openModal(${room.id}, '${area}')">Check</button>`;
  } else if (data.missing.length > 0) {
    return `<button class="check-btn has-issues" onclick="openModal(${room.id}, '${area}')">${data.missing.length} Issue(s)</button>`;
  } else {
    return `<button class="check-btn completed" disabled>✓ Done</button>`;
  }
}

function renderAction(room) {
  // Lấy danh sách các area thực sự tồn tại trong equipment của rank này
  const existingAreas = Object.keys(equipment[room.rank] || {}).filter(
    area => equipment[room.rank][area] && equipment[room.rank][area].length > 0
  );
  
  // Kiểm tra tất cả các area tồn tại đã được check chưa
  const allChecked = existingAreas.every(area => room[area]?.checked === true);
  
  // Kiểm tra có issue ở bất kỳ area nào không
  const hasIssues = existingAreas.some(area => room[area]?.missing?.length > 0);

  if (!allChecked) {
    return `<button class="action-btn pending" disabled>⏳ In Progress</button>`;
  } else if (hasIssues) {
    return `<button class="action-btn has-issues" onclick="viewIssues(${room.id})">⚠️ View Issues</button>`;
  } else {
    return `<button class="action-btn completed" onclick="markComplete(${room.id})">✓ Clean & Complete</button>`;
  }
}

function openModal(roomId, area) {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;

  currentRoom = room;
  currentArea = area;

  const areaName = {
    bedroom1: "Bedroom 1",
    bedroom2: "Bedroom 2",
    bathroom1: "Bathroom 1",
    bathroom2: "Bathroom 2",
    living: "Living Room",
    kitchen: "Kitchen",
    bar: "Bar Area",
  }[area];

  const equipmentList = equipment[room.rank][area];
  const savedItems = room[area].items || [];
  const savedMissing = room[area].missing || [];

  tempItems = [...savedItems];
  tempMissing = [...savedMissing];

  document.getElementById("modalTitle").innerHTML =
    `Room ${room.number} - ${areaName}`;

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
        <div class="equipment-list" id="equipmentList">
            ${equipmentList
      .map((item) => {
        const isChecked = tempItems.includes(item);
        const isReported = tempMissing.includes(item);
        let itemClass = "";
        if (isReported) itemClass = "reported";
        else if (isChecked) itemClass = "checked";

        return `
                    <div class="equipment-item ${itemClass}" data-item="${item}">
                        <input type="checkbox" ${isChecked ? "checked" : ""} ${isReported ? "disabled" : ""}>
                        <label>${item}</label>
                        ${isReported ? '<i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i>' : ""}
                    </div>
                `;
      })
      .join("")}
        </div>
        <div class="issue-section">
            <h4>⚠️ Report Issues</h4>
            <div id="missingList">
                ${tempMissing.length > 0
      ? tempMissing
        .map(
          (item) => `
                    <div class="missing-item">
                        <span>${item}</span>
                        <button class="remove-issue" onclick="removeIssue('${item.replace(/'/g, "\\'")}')">✖</button>
                    </div>
                `,
        )
        .join("")
      : "<small>No issues reported</small>"
    }
            </div>
            <select id="issueSelect">
                <option value="">Select item to report...</option>
                ${equipmentList.map((item) => `<option value="${item}">${item}</option>`).join("")}
            </select>
            <button class="btn-secondary" onclick="addIssue()" style="margin-top: 10px; width: 100%;">+ Report Missing/Damaged</button>
        </div>
    `;

  // Add click handlers
  document.querySelectorAll(".equipment-item").forEach((el) => {
    el.onclick = (e) => {
      if (e.target.type !== "checkbox") {
        const checkbox = el.querySelector("input");
        if (checkbox && !checkbox.disabled) {
          const item = el.querySelector("label").textContent;
          checkbox.checked = !checkbox.checked;
          toggleItem(item);
        }
      }
    };

    const checkbox = el.querySelector("input");
    if (checkbox && !checkbox.disabled) {
      checkbox.onchange = (e) => {
        e.stopPropagation();
        const item = el.querySelector("label").textContent;
        toggleItem(item);
      };
    }
  });

  updateSaveButtonState(equipmentList);
  document.getElementById("equipmentModal").style.display = "flex";
}

function updateSaveButtonState(equipmentList) {
  const saveBtn = document.getElementById("saveBtn");
  if (!saveBtn) return;

  const allItemsHandled = equipmentList.every(
    (item) => tempItems.includes(item) || tempMissing.includes(item),
  );

  saveBtn.disabled = !allItemsHandled;
  saveBtn.style.opacity = allItemsHandled ? "1" : "0.5";
}

function toggleItem(item) {
  if (tempMissing.includes(item)) return;

  const index = tempItems.indexOf(item);
  if (index > -1) {
    tempItems.splice(index, 1);
  } else {
    tempItems.push(item);
  }

  const equipmentList = equipment[currentRoom.rank][currentArea];

  document.querySelectorAll(".equipment-item").forEach((el) => {
    const label = el.querySelector("label");
    if (label && label.textContent === item) {
      const checkbox = el.querySelector("input");
      if (tempMissing.includes(item)) {
        el.classList.remove("checked");
        el.classList.add("reported");
        checkbox.checked = false;
        checkbox.disabled = true;
      } else if (tempItems.includes(item)) {
        el.classList.remove("reported");
        el.classList.add("checked");
        checkbox.checked = true;
        checkbox.disabled = false;
      } else {
        el.classList.remove("checked", "reported");
        checkbox.checked = false;
        checkbox.disabled = false;
      }
    }
  });

  updateSaveButtonState(equipmentList);
}

function addIssue() {
  const select = document.getElementById("issueSelect");
  const item = select.value;
  if (!item) {
    alert("Please select an item");
    return;
  }

  if (!tempMissing.includes(item)) {
    tempMissing.push(item);

    const idx = tempItems.indexOf(item);
    if (idx > -1) tempItems.splice(idx, 1);

    const missingDiv = document.getElementById("missingList");
    missingDiv.innerHTML =
      tempMissing
        .map(
          (i) => `
            <div class="missing-item">
                <span>${i}</span>
                <button class="remove-issue" onclick="removeIssue('${i.replace(/'/g, "\\'")}')">✖</button>
            </div>
        `,
        )
        .join("") || "<small>No issues reported</small>";

    document.querySelectorAll(".equipment-item").forEach((el) => {
      const label = el.querySelector("label");
      if (label && label.textContent === item) {
        el.classList.remove("checked");
        el.classList.add("reported");
        const checkbox = el.querySelector("input");
        checkbox.checked = false;
        checkbox.disabled = true;
      }
    });

    select.value = "";

    const equipmentList = equipment[currentRoom.rank][currentArea];
    updateSaveButtonState(equipmentList);
  } else {
    alert("Already reported");
  }
}

function removeIssue(item) {
  const index = tempMissing.indexOf(item);
  if (index > -1) {
    tempMissing.splice(index, 1);

    const missingDiv = document.getElementById("missingList");
    missingDiv.innerHTML =
      tempMissing
        .map(
          (i) => `
            <div class="missing-item">
                <span>${i}</span>
                <button class="remove-issue" onclick="removeIssue('${i.replace(/'/g, "\\'")}')">✖</button>
            </div>
        `,
        )
        .join("") || "<small>No issues reported</small>";

    document.querySelectorAll(".equipment-item").forEach((el) => {
      const label = el.querySelector("label");
      if (label && label.textContent === item) {
        el.classList.remove("reported");
        const checkbox = el.querySelector("input");
        checkbox.disabled = false;
        if (tempItems.includes(item)) {
          el.classList.add("checked");
          checkbox.checked = true;
        } else {
          checkbox.checked = false;
        }
      }
    });

    const equipmentList = equipment[currentRoom.rank][currentArea];
    updateSaveButtonState(equipmentList);
  }
}

function saveCheck() {
  if (!currentRoom || !currentArea) {
    alert("No room selected");
    return;
  }

  const equipmentList = equipment[currentRoom.rank][currentArea];
  
  // Nếu equipmentList rỗng (area không tồn tại), không cần check
  if (!equipmentList || equipmentList.length === 0) {
    alert("This area is not available for this room type!");
    closeModal();
    return;
  }
  
  const allItemsHandled = equipmentList.every(
    (item) => tempItems.includes(item) || tempMissing.includes(item),
  );

  if (!allItemsHandled) {
    alert("Please check all items or report missing items before saving!");
    return;
  }

  currentRoom[currentArea].items = [...tempItems];
  currentRoom[currentArea].missing = [...tempMissing];
  currentRoom[currentArea].checked = true;

  // Lấy danh sách các area tồn tại
  const existingAreas = Object.keys(equipment[currentRoom.rank] || {}).filter(
    area => equipment[currentRoom.rank][area] && equipment[currentRoom.rank][area].length > 0
  );
  
  const allChecked = existingAreas.every(area => currentRoom[area]?.checked === true);
  const hasIssues = existingAreas.some(area => currentRoom[area]?.missing?.length > 0);

  if (!allChecked) {
    currentRoom.status = "pending";
  } else if (hasIssues) {
    currentRoom.status = "issues";
  } else {
    currentRoom.status = "completed";
  }

  closeModal();
  renderTable();

  const areaName = {
    bedroom1: "Bedroom 1",
    bedroom2: "Bedroom 2",
    bathroom1: "Bathroom 1",
    bathroom2: "Bathroom 2",
    living: "Living Room",
    kitchen: "Kitchen",
    bar: "Bar Area",
  }[currentArea];
  
  if (tempMissing.length > 0) {
    alert(`✓ ${areaName} checked! Found ${tempMissing.length} issue(s) that need attention.`);
  } else {
    alert(`✓ ${areaName} checked! All equipment is present.`);
  }
}

function markComplete(roomId) {
  const room = rooms.find((r) => r.id === roomId);
  if (room && confirm(`Mark Room ${room.number} as Clean & Complete?`)) {
    room.status = "completed";
    renderTable();
    alert(`Room ${room.number} marked as Clean & Complete!`);
  }
}

function viewIssues(roomId) {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;

  if (userRole !== "manager") {
    alert("Only manager can view and resolve issues!");
    return;
  }

  currentResolveRoom = room;

  let issues = [];
  
  // Chỉ thêm các area có missing items
  const areas = ['bedroom1', 'bedroom2', 'bathroom1', 'bathroom2', 'living', 'kitchen', 'bar'];
  const areaNames = {
    bedroom1: "Bedroom 1",
    bedroom2: "Bedroom 2", 
    bathroom1: "Bathroom 1",
    bathroom2: "Bathroom 2",
    living: "Living Room",
    kitchen: "Kitchen",
    bar: "Bar Area"
  };
  
  areas.forEach(area => {
    if (room[area]?.missing?.length > 0) {
      issues.push({ area: areaNames[area], items: [...room[area].missing] });
    }
  });

  const modalBody = document.getElementById("issueModalBody");
  document.getElementById("issueRoomNumber").textContent = room.number;

  if (issues.length === 0) {
    modalBody.innerHTML = '<p>No issues found in this room.</p>';
  } else {
    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="color: #dc3545; margin-bottom: 15px;">Missing/Damaged Items:</h4>
        ${issues.map((issue) => `
          <div style="margin-bottom: 20px;">
            <strong>📌 ${issue.area}:</strong>
            <div style="margin-top: 8px;">
              ${issue.items.map((item) => `<span class="missing-tag">${item}</span>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
      <div style="margin-top: 15px;">
        <label>Resolution Notes:</label>
        <textarea id="resolutionNotes" rows="3" placeholder="Describe what was done to resolve these issues..." style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; margin-top: 5px;"></textarea>
      </div>
    `;
  }

  document.getElementById("issueModal").style.display = "flex";
}

function resolveIssues() {
  if (!currentResolveRoom) return;

  const notes = document.getElementById("resolutionNotes")?.value || "";

  if (confirm(`Resolve all issues in Room ${currentResolveRoom.number}?\n\nNotes: ${notes || "No notes provided"}`)) {
    // Reset missing items cho tất cả các area
    const areas = ['bedroom1', 'bedroom2', 'bathroom1', 'bathroom2', 'living', 'kitchen', 'bar'];
    areas.forEach(area => {
      if (currentResolveRoom[area]) {
        currentResolveRoom[area].missing = [];
      }
    });
    currentResolveRoom.status = "completed";

    closeIssueModal();
    renderTable();
    alert(`Room ${currentResolveRoom.number} issues have been resolved!`);
    currentResolveRoom = null;
  }
}

function updateStats() {
  document.getElementById("totalRooms").textContent = rooms.length;
  document.getElementById("issueRooms").textContent = rooms.filter(
    (r) => r.status === "issues",
  ).length;
}

function closeModal() {
  document.getElementById("equipmentModal").style.display = "none";
  currentRoom = null;
  currentArea = null;
}

function closeIssueModal() {
  document.getElementById("issueModal").style.display = "none";
}

//Get list room status = Housekeeping
async function loadRooms() {
  try {
    const response = await fetch("/rooms/api?status=Housekeeping");
    const data = await response.json();

    // Map backend -> frontend structure với 7 khu vực
    rooms = data.map((r) => ({
      id: r.id,
      number: r.roomNumber,
      type: r.roomType,
      rank: r.roomRank, // Standard, Superior, Deluxe, Executive, Suite

      bedroom1: { checked: false, items: [], missing: [] },
      bedroom2: { checked: false, items: [], missing: [] },
      bathroom1: { checked: false, items: [], missing: [] },
      bathroom2: { checked: false, items: [], missing: [] },
      living: { checked: false, items: [], missing: [] },
      kitchen: { checked: false, items: [], missing: [] },
      bar: { checked: false, items: [], missing: [] },

      status: "pending",
    }));

    renderTable();
  } catch (error) {
    console.error("Error loading rooms:", error);
  }
}

// Event listeners
document
  .getElementById("searchInput")
  .addEventListener("input", () => renderTable());
document
  .getElementById("statusFilter")
  .addEventListener("change", () => renderTable());

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.onclick = () => {
    closeModal();
    closeIssueModal();
  };
});

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  loadRooms();
});

// Make functions global
window.openModal = openModal;
window.addIssue = addIssue;
window.removeIssue = removeIssue;
window.saveCheck = saveCheck;
window.markComplete = markComplete;
window.viewIssues = viewIssues;
window.closeModal = closeModal;
window.closeIssueModal = closeIssueModal;
window.resolveIssues = resolveIssues;
