// User role - change to 'manager' to test manager features
let currentResolveRoom = null;
let currentEquipmentList = [];
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
// 1. Get the element and the data-role attribute from Thymeleaf
const roleElement = document.getElementById("userRole");
const userRole = roleElement ? roleElement.dataset.role : "housekeeper";

// 2. Check the element exists before trying to modify it
if (roleElement && roleElement.textContent.trim() !== "") {
  // Role already set by Thymeleaf → do nothing
} else if (roleElement) {
  // fallback if Thymeleaf fails for some reason
  roleElement.textContent = "Housekeeper";
}

// 3. Apply the Manager-specific styling
if (userRole === "manager") {
  const badge = document.getElementById("roleBadge");
  if (badge) {
    badge.style.background = "linear-gradient(135deg, #dc3545, #c82333)";
  }
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
  // CHECK FROM DATABASE (equipmentMap)
  const areaExists = room.equipmentMap && room.equipmentMap[area];

  if (!areaExists) {
    return '<span style="color: #cbd5e1;">—</span>';
  }

  const data = room[area];

  if (!data.checked) {
    return `<button class="check-btn" onclick="openModal(${room.id}, '${area}')">Check</button>`;
  } else if (data.missing.length > 0) {
    return `<button class="check-btn has-issues" onclick="openModal(${room.id}, '${area}')">${data.missing.length} Issue(s)</button>`;
  } else {
    return `<button class="check-btn completed" disabled>✓ Done</button>`;
  }
}

function renderAction(room) {
  const areas = Object.keys(room.equipmentMap || {});

  const allChecked = areas.every(area => room[area]?.checked === true);
  const hasIssues = areas.some(area => room[area]?.missing?.length > 0);

  if (areas.length === 0) {
    return `<span style="color:#cbd5e1;">—</span>`;
  }

  if (!allChecked) {
    return `<button class="action-btn pending" disabled>⏳ In Progress</button>`;
  } else if (hasIssues) {
    return `<button class="action-btn has-issues" onclick="viewIssues(${room.id})">⚠️ View Issues</button>`;
  } else {
    return `<button class="action-btn completed" onclick="markComplete(${room.id})">✓ Clean & Complete</button>`;
  }
}

async function openModal(roomId, area) {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;

  currentRoom = room;
  currentArea = area;

  const response = await fetch(`/api/equipment/${roomId}`);
  const data = await response.json();

  currentEquipmentList = data[area] || [];

  if (currentEquipmentList.length === 0) {
    alert("No equipment for this area!");
    return;
  }

  const equipmentNames = currentEquipmentList.map(e => e.name);

  tempItems = currentEquipmentList
    .filter(e => e.checked)
    .map(e => e.name);

  tempMissing = currentEquipmentList
    .filter(e => e.missing)
    .map(e => e.name);

  const areaName = {
    bedroom1: "Bedroom 1",
    bedroom2: "Bedroom 2",
    bathroom1: "Bathroom 1",
    bathroom2: "Bathroom 2",
    living: "Living Room",
    kitchen: "Kitchen",
    bar: "Bar Area",
  }[area];

  document.getElementById("modalTitle").innerHTML =
    `Room ${room.number} - ${areaName}`;

  const modalBody = document.getElementById("modalBody");

    modalBody.innerHTML = `
      <div class="equipment-list">
        ${equipmentNames.map(item => {
          const isChecked = tempItems.includes(item);
          const isReported = tempMissing.includes(item);

          let itemClass = "";
          if (isReported) itemClass = "reported";
          else if (isChecked) itemClass = "checked";

          return `
            <div class="equipment-item ${itemClass}">
              <input type="checkbox" ${isChecked ? "checked" : ""} ${isReported ? "disabled" : ""}>
              <label>${item}</label>
            </div>
          `;
        }).join("")}
      </div>
      <div class="issue-section">
        <h4>⚠️ Report Issues</h4>

        <div id="missingList">
          ${
            tempMissing.length > 0
              ? tempMissing.map(item => `
                <div class="missing-item">
                  <span>${item}</span>
                  <button onclick="removeIssue('${item.replace(/'/g, "\\'")}')">✖</button>
                </div>
              `).join("")
              : "<small>No issues reported</small>"
          }
        </div>

        <select id="issueSelect">
          <option value="">Select item...</option>
          ${equipmentNames.map(item => `<option value="${item}">${item}</option>`).join("")}
        </select>

        <button class="btn-secondary" onclick="addIssue()" style="margin-top:10px; width:100%;">
          + Report Missing/Damaged
        </button>
      </div>
    `;

  document.getElementById("equipmentModal").style.display = "flex";
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
}

function updateSaveButtonState() {
  const saveBtn = document.getElementById("saveBtn");
  if (!saveBtn) return;

  const equipmentNames = currentEquipmentList.map(e => e.name);

  const allItemsHandled = equipmentNames.every(
    item => tempItems.includes(item) || tempMissing.includes(item)
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

  updateSaveButtonState();

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

  updateSaveButtonState();
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

    updateSaveButtonState();
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

    updateSaveButtonState();
  }
}

async function saveCheck() {
  if (!currentRoom || !currentArea) {
    alert("No room selected");
    return;
  }

  let data = {};
  try {
    const response = await fetch(`/api/equipment/${currentRoom.id}`);
    if (!response.ok) throw new Error();
    data = await response.json();
  } catch (e) {
    alert("Failed to load equipment!");
    return;
  }
  const equipmentList = data[currentArea] || [];

  if (currentEquipmentList.length === 0) {
    alert("This area is not available for this room type!");
    closeModal();
    return;
  }

  // Extract only names
  const equipmentNames = equipmentList.map(e => e.name);

  const allItemsHandled = equipmentNames.every(
    (item) => tempItems.includes(item) || tempMissing.includes(item)
  );

  if (!allItemsHandled) {
    alert("Please check all items or report missing items before saving!");
    return;
  }

  // CALL BACKEND API
  try {
    const res = await fetch("/api/equipment/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        roomId: currentRoom.id,
        area: currentArea,
        checkedItems: tempItems,
        missingItems: tempMissing
      })
    });

    if (!res.ok) {
      throw new Error("Failed to save");
    }

  } catch (error) {
    console.error(error);
    alert("Error saving data!");
    return;
  }

  // UPDATE UI (keep logic)
  currentRoom[currentArea].items = [...tempItems];
  currentRoom[currentArea].missing = [...tempMissing];
  currentRoom[currentArea].checked = true;

  // IMPORTANT: We can’t use old equipment object anymore
  const existingAreas = Object.keys(currentRoom).filter(
    key =>
      ["bedroom1","bedroom2","bathroom1","bathroom2","living","kitchen","bar"].includes(key)
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
    alert(`✓ ${areaName} checked! Found ${tempMissing.length} issue(s).`);
  } else {
    alert(`✓ ${areaName} checked! All equipment is present.`);
  }
}

async function markComplete(roomId) {
  try {
    const response = await fetch(`/api/equipment/${roomId}/complete`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Failed to complete cleaning");
    }

    alert("Room cleaned & data cleared!");
    await loadRooms(); // reload fresh data

  } catch (error) {
    console.error(error);
    alert("Update failed!");
  }
}

async function viewIssues(roomId) {
    if (userRole !== "manager") {
        alert("Access Denied: Only managers can resolve issues.");
        return;
    }

    // 1. Find the room from our local array
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    // 2. Fetch the latest equipment data from the server
    const response = await fetch(`/api/equipment/${roomId}`);
    const equipmentMap = await response.json();

    const modalBody = document.getElementById("issueModalBody");
    document.getElementById("issueRoomNumber").textContent = room.number;

    let issueHtml = "";
    let hasIssues = false;

    // 3. Loop through each area to find missing items
    for (const [area, items] of Object.entries(equipmentMap)) {
        const missingItems = items.filter(item => item.missing === true);

        if (missingItems.length > 0) {
            hasIssues = true;
            issueHtml += `
                <div class="issue-group" style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <h4 style="color: #dc3545; text-transform: capitalize; margin-bottom: 10px;">
                        <i class="fas fa-map-marker-alt"></i> ${area.replace(/([A-Z])/g, ' $1')}
                    </h4>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        ${missingItems.map(item => `
                            <div style="display: flex; justify-content: space-between; align-items: center; background: #fff5f5; padding: 10px; border-radius: 6px;">
                                <span><strong>${item.name}</strong> (Missing/Damaged)</span>
                                <button class="btn-danger" style="padding: 5px 15px; font-size: 0.85rem;"
                                        onclick="resolveSingleItem(${roomId}, '${area}', '${item.name.replace(/'/g, "\\'")}')">
                                    Resolve
                                </button>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        }
    }

    // 4. Inject content and show the modal
    modalBody.innerHTML = hasIssues ? issueHtml : "<p style='text-align:center; padding: 20px;'>All issues have been resolved!</p>";
    document.getElementById("issueModal").style.display = "flex";
}

async function resolveSingleItem(roomId, area, itemName) {
    if (!confirm(`Are you sure you want to resolve "${itemName}" in ${area}?`)) return;

    try {
        // Calling the endpoint we discussed for the Controller
        const response = await fetch(`/api/equipment/resolve-specific?roomId=${roomId}&area=${area}&name=${encodeURIComponent(itemName)}`, {
            method: 'POST'
        });

        if (response.ok) {
            // Refresh the specific modal view to show remaining issues
            await viewIssues(roomId);
            // Refresh the main table in the background
            await loadRooms();
        } else {
            alert("Failed to resolve issue. Please check the server logs.");
        }
    } catch (error) {
        console.error("Resolution error:", error);
    }
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

    // We use Promise.all to fetch equipment for all rooms in parallel
    rooms = await Promise.all(data.map(async (r) => {
      // 1. Fetch the specific equipment status from your EquipmentController
      const res = await fetch(`/api/equipment/${r.id}`);
      const equipmentMap = await res.json();

      const roomObj = {
        id: r.id,
        number: r.roomNumber,
        type: r.roomType,
        rank: r.roomRank,
        equipmentMap: equipmentMap, // Store the raw map from DB
        status: "pending"
      };

      // 2. Define the areas we need to check
      const areas = ['bedroom1', 'bedroom2', 'bathroom1', 'bathroom2', 'living', 'kitchen', 'bar'];

      areas.forEach(area => {
        const areaData = equipmentMap[area] || [];

        // Logic: An area is "checked" if it HAS items and ALL items are handled
        // (either marked as checked OR marked as missing)
        const hasItems = areaData.length > 0;
        const allHandled = hasItems && areaData.every(item => item.checked || item.missing);

        const missingList = areaData.filter(item => item.missing).map(item => item.name);

        // This replaces the "empty" default state with the real DB state
        roomObj[area] = {
          checked: allHandled,
          items: areaData.filter(item => item.checked).map(item => item.name),
          missing: missingList
        };
      });

      // 3. Determine the overall room status for the Action column
      const hasAnyIssues = areas.some(a => roomObj[a].missing.length > 0);
      const allDone = areas.every(a => {
          // If the area exists in the template, it must be 'checked'
          return (equipmentMap[a] && equipmentMap[a].length > 0) ? roomObj[a].checked : true;
      });

      if (hasAnyIssues) {
          roomObj.status = "issues";
      } else if (allDone) {
          roomObj.status = "completed";
      }

      return roomObj;
    }));

    renderTable(); // Update the UI with the loaded data
  } catch (error) {
    console.error("Error loading rooms:", error);
  }
}

// Load missing equipment issues
async function loadIssues() {
  try {
    const response = await fetch("/api/equipment/issues");
    const issues = await response.json();

    const issueBox = document.getElementById("issue-box");
    const issueList = document.getElementById("issue-list");

    issueList.innerHTML = "";

    if (issues.length === 0) {
      issueBox.style.display = "none";
      return;
    }

    issueBox.style.display = "block";

    issues.forEach(issue => {
      const li = document.createElement("li");
      li.innerHTML = `
        Room ${issue.roomId} - ${issue.area}: ${issue.equipmentName}
        <button onclick="resolveIssue(${issue.id})">Resolve</button>
      `;
      issueList.appendChild(li);
    });

  } catch (error) {
    console.error(error);
    alert("Failed to load issues!");
  }
}

// Resolve single issue
async function resolveIssue(issueId) {
  try {
    const response = await fetch(`/api/equipment/issues/${issueId}/resolve`, {
      method: "POST"
    });
    if (!response.ok) throw new Error("Failed to resolve issue");

    alert("Issue resolved!");
    loadIssues();
  } catch (error) {
    console.error(error);
    alert("Failed to resolve issue!");
  }
}
// Call this after page load if user is manager
// loadIssues();

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