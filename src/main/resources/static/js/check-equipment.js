// User role - change to 'manager' to test manager features
let userRole = 'housekeeper';
let currentResolveRoom = null;

// Room data với đầy đủ type và rank
let rooms = [
    // Single rooms
    { id: 101, number: '101', type: 'Single', rank: 'Standard', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 102, number: '102', type: 'Single', rank: 'Superior', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 103, number: '103', type: 'Single', rank: 'Deluxe', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    
    // Double rooms
    { id: 201, number: '201', type: 'Double', rank: 'Standard', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 202, number: '202', type: 'Double', rank: 'Superior', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 203, number: '203', type: 'Double', rank: 'Executive', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    
    // Twin rooms
    { id: 301, number: '301', type: 'Twin', rank: 'Standard', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 302, number: '302', type: 'Twin', rank: 'Superior', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 303, number: '303', type: 'Twin', rank: 'Deluxe', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    
    // Triple rooms
    { id: 401, number: '401', type: 'Triple', rank: 'Standard', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 402, number: '402', type: 'Triple', rank: 'Superior', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 403, number: '403', type: 'Triple', rank: 'Executive', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    
    // Family rooms
    { id: 501, number: '501', type: 'Family', rank: 'Standard', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 502, number: '502', type: 'Family', rank: 'Superior', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' },
    { id: 503, number: '503', type: 'Family', rank: 'Suite', bedroom: { checked: false, items: [], missing: [] }, bathroom: { checked: false, items: [], missing: [] }, living: { checked: false, items: [], missing: [] }, kitchen: { checked: false, items: [], missing: [] }, status: 'pending' }
];

// Equipment by rank - đầy đủ cho các rank mới
const equipment = {
    Standard: {
        bedroom: ['Single Bed', 'Wardrobe', 'Nightstand', 'Lamp', 'Desk', 'Chair'],
        bathroom: ['Towels (2)', 'Soap', 'Shampoo', 'Toilet Paper', 'Hairdryer'],
        living: ['TV', 'AC', 'Sofa', 'Coffee Table'],
        kitchen: ['Water (2)', 'Coffee Set', 'Mini Fridge']
    },
    Superior: {
        bedroom: ['Queen Bed', 'Wardrobe', 'Nightstand (2)', 'Lamp (2)', 'Desk', 'Chair', 'Vanity Mirror'],
        bathroom: ['Towels (4)', 'Soap', 'Shampoo', 'Conditioner', 'Toilet Paper', 'Hairdryer', 'Bathrobe'],
        living: ['TV (2)', 'AC', 'Sofa', 'Armchair', 'Coffee Table'],
        kitchen: ['Water (4)', 'Coffee Set', 'Tea Set', 'Mini Fridge']
    },
    Deluxe: {
        bedroom: ['King Bed', 'Wardrobe (2)', 'Nightstand (2)', 'Lamp (2)', 'Desk', 'Chair (2)', 'Vanity Table', 'Safe Box'],
        bathroom: ['Towels (4)', 'Soap', 'Shampoo', 'Conditioner', 'Body Lotion', 'Toilet Paper', 'Hairdryer', 'Bathrobe (2)', 'Slippers'],
        living: ['TV (2)', 'AC', 'Sofa', 'Armchair (2)', 'Coffee Table', 'Mini Bar'],
        kitchen: ['Water (4)', 'Coffee Set', 'Tea Set', 'Mini Fridge', 'Microwave']
    },
    Executive: {
        bedroom: ['King Bed (2)', 'Wardrobe (2)', 'Nightstand (2)', 'Lamp (3)', 'Desk', 'Chair (2)', 'Vanity Table', 'Safe Box', 'Workstation'],
        bathroom: ['Towels (6)', 'Soap', 'Shampoo', 'Conditioner', 'Body Lotion', 'Toilet Paper', 'Hairdryer', 'Bathrobe (2)', 'Slippers', 'Scale'],
        living: ['TV (2)', 'AC', 'Sofa', 'Armchair (2)', 'Coffee Table', 'Mini Bar', 'Sound System', 'Meeting Table'],
        kitchen: ['Water (6)', 'Coffee Set', 'Tea Set', 'Mini Fridge', 'Microwave', 'Dishwasher']
    },
    Suite: {
        bedroom: ['King Bed (2)', 'Wardrobe (3)', 'Nightstand (2)', 'Lamp (4)', 'Desk', 'Chair (2)', 'Vanity Table', 'Safe Box', 'Walk-in Closet'],
        bathroom: ['Towels (8)', 'Soap', 'Shampoo', 'Conditioner', 'Body Lotion', 'Toilet Paper', 'Hairdryer', 'Bathrobe (2)', 'Slippers', 'Scale', 'Jacuzzi'],
        living: ['TV (3)', 'AC', 'Sofa', 'Armchair (3)', 'Coffee Table', 'Mini Bar', 'Sound System', 'Dining Table', 'Piano'],
        kitchen: ['Water (8)', 'Coffee Set', 'Tea Set', 'Mini Fridge', 'Microwave', 'Dishwasher', 'Oven', 'Wine Cooler']
    }
};

let currentRoom = null;
let currentArea = null;
let tempItems = [];
let tempMissing = [];

// Set role display
document.getElementById('userRole').textContent = userRole === 'manager' ? 'Manager' : 'Housekeeper';
if (userRole === 'manager') {
    document.getElementById('roleBadge').style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = rooms.filter(r => r.number.toString().includes(searchTerm));
    if (statusFilter === 'issues') {
        filtered = filtered.filter(r => r.status === 'issues');
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No rooms found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(room => {
        let rowClass = '';
        if (room.status === 'completed') rowClass = 'completed';
        if (room.status === 'issues') rowClass = 'has-issues';
        
        return `
            <tr class="${rowClass}">
                <td style="text-align:left">
                    <div class="room-number">${room.number}</div>
                    <div class="room-type-badge">${room.type} - ${room.rank}</div>
                </td>
                <td>${renderButton(room, 'bedroom')}</td>
                <td>${renderButton(room, 'bathroom')}</td>
                <td>${renderButton(room, 'living')}</td>
                <td>${renderButton(room, 'kitchen')}</td>
                <td>${renderAction(room)}</td>
            </tr>
        `;
    }).join('');
    
    updateStats();
}

function renderButton(room, area) {
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
    const allChecked = room.bedroom.checked && room.bathroom.checked && room.living.checked && room.kitchen.checked;
    const hasIssues = room.bedroom.missing.length > 0 || room.bathroom.missing.length > 0 || room.living.missing.length > 0 || room.kitchen.missing.length > 0;
    
    if (!allChecked) {
        return `<button class="action-btn pending" disabled>⏳ In Progress</button>`;
    } else if (hasIssues) {
        return `<button class="action-btn has-issues" onclick="viewIssues(${room.id})">⚠️ View Issues</button>`;
    } else {
        return `<button class="action-btn completed" onclick="markComplete(${room.id})">✓ Clean & Complete</button>`;
    }
}

function openModal(roomId, area) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    currentRoom = room;
    currentArea = area;
    
    const areaName = { bedroom: 'Bedroom', bathroom: 'Bathroom', living: 'Living Room', kitchen: 'Kitchen' }[area];
    const equipmentList = equipment[room.rank][area];
    const savedItems = room[area].items || [];
    const savedMissing = room[area].missing || [];
    
    tempItems = [...savedItems];
    tempMissing = [...savedMissing];
    
    document.getElementById('modalTitle').innerHTML = `Room ${room.number} - ${areaName}`;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="equipment-list" id="equipmentList">
            ${equipmentList.map(item => {
                const isChecked = tempItems.includes(item);
                const isReported = tempMissing.includes(item);
                let itemClass = '';
                if (isReported) itemClass = 'reported';
                else if (isChecked) itemClass = 'checked';
                
                return `
                    <div class="equipment-item ${itemClass}" data-item="${item}">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} ${isReported ? 'disabled' : ''}>
                        <label>${item}</label>
                        ${isReported ? '<i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
        <div class="issue-section">
            <h4>⚠️ Report Issues</h4>
            <div id="missingList">
                ${tempMissing.length > 0 ? tempMissing.map(item => `
                    <div class="missing-item">
                        <span>${item}</span>
                        <button class="remove-issue" onclick="removeIssue('${item.replace(/'/g, "\\'")}')">✖</button>
                    </div>
                `).join('') : '<small>No issues reported</small>'}
            </div>
            <select id="issueSelect">
                <option value="">Select item to report...</option>
                ${equipmentList.map(item => `<option value="${item}">${item}</option>`).join('')}
            </select>
            <button class="btn-secondary" onclick="addIssue()" style="margin-top: 10px; width: 100%;">+ Report Missing/Damaged</button>
        </div>
    `;
    
    // Add click handlers
    document.querySelectorAll('.equipment-item').forEach(el => {
        el.onclick = (e) => {
            if (e.target.type !== 'checkbox') {
                const checkbox = el.querySelector('input');
                if (checkbox && !checkbox.disabled) {
                    const item = el.querySelector('label').textContent;
                    checkbox.checked = !checkbox.checked;
                    toggleItem(item);
                }
            }
        };
        
        const checkbox = el.querySelector('input');
        if (checkbox && !checkbox.disabled) {
            checkbox.onchange = (e) => {
                e.stopPropagation();
                const item = el.querySelector('label').textContent;
                toggleItem(item);
            };
        }
    });
    
    updateSaveButtonState(equipmentList);
    document.getElementById('equipmentModal').style.display = 'flex';
}

function updateSaveButtonState(equipmentList) {
    const saveBtn = document.getElementById('saveBtn');
    if (!saveBtn) return;
    
    const allItemsHandled = equipmentList.every(item => 
        tempItems.includes(item) || tempMissing.includes(item)
    );
    
    saveBtn.disabled = !allItemsHandled;
    saveBtn.style.opacity = allItemsHandled ? '1' : '0.5';
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
    
    document.querySelectorAll('.equipment-item').forEach(el => {
        const label = el.querySelector('label');
        if (label && label.textContent === item) {
            const checkbox = el.querySelector('input');
            if (tempMissing.includes(item)) {
                el.classList.remove('checked');
                el.classList.add('reported');
                checkbox.checked = false;
                checkbox.disabled = true;
            } else if (tempItems.includes(item)) {
                el.classList.remove('reported');
                el.classList.add('checked');
                checkbox.checked = true;
                checkbox.disabled = false;
            } else {
                el.classList.remove('checked', 'reported');
                checkbox.checked = false;
                checkbox.disabled = false;
            }
        }
    });
    
    updateSaveButtonState(equipmentList);
}

function addIssue() {
    const select = document.getElementById('issueSelect');
    const item = select.value;
    if (!item) {
        alert('Please select an item');
        return;
    }
    
    if (!tempMissing.includes(item)) {
        tempMissing.push(item);
        
        const idx = tempItems.indexOf(item);
        if (idx > -1) tempItems.splice(idx, 1);
        
        const missingDiv = document.getElementById('missingList');
        missingDiv.innerHTML = tempMissing.map(i => `
            <div class="missing-item">
                <span>${i}</span>
                <button class="remove-issue" onclick="removeIssue('${i.replace(/'/g, "\\'")}')">✖</button>
            </div>
        `).join('') || '<small>No issues reported</small>';
        
        document.querySelectorAll('.equipment-item').forEach(el => {
            const label = el.querySelector('label');
            if (label && label.textContent === item) {
                el.classList.remove('checked');
                el.classList.add('reported');
                const checkbox = el.querySelector('input');
                checkbox.checked = false;
                checkbox.disabled = true;
            }
        });
        
        select.value = '';
        
        const equipmentList = equipment[currentRoom.rank][currentArea];
        updateSaveButtonState(equipmentList);
    } else {
        alert('Already reported');
    }
}

function removeIssue(item) {
    const index = tempMissing.indexOf(item);
    if (index > -1) {
        tempMissing.splice(index, 1);
        
        const missingDiv = document.getElementById('missingList');
        missingDiv.innerHTML = tempMissing.map(i => `
            <div class="missing-item">
                <span>${i}</span>
                <button class="remove-issue" onclick="removeIssue('${i.replace(/'/g, "\\'")}')">✖</button>
            </div>
        `).join('') || '<small>No issues reported</small>';
        
        document.querySelectorAll('.equipment-item').forEach(el => {
            const label = el.querySelector('label');
            if (label && label.textContent === item) {
                el.classList.remove('reported');
                const checkbox = el.querySelector('input');
                checkbox.disabled = false;
                if (tempItems.includes(item)) {
                    el.classList.add('checked');
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
        alert('No room selected');
        return;
    }
    
    const equipmentList = equipment[currentRoom.rank][currentArea];
    const allItemsHandled = equipmentList.every(item => 
        tempItems.includes(item) || tempMissing.includes(item)
    );
    
    if (!allItemsHandled) {
        alert('Please check all items or report missing items before saving!');
        return;
    }
    
    currentRoom[currentArea].items = [...tempItems];
    currentRoom[currentArea].missing = [...tempMissing];
    currentRoom[currentArea].checked = true;
    
    const allChecked = currentRoom.bedroom.checked && currentRoom.bathroom.checked && currentRoom.living.checked && currentRoom.kitchen.checked;
    const hasIssues = currentRoom.bedroom.missing.length > 0 || currentRoom.bathroom.missing.length > 0 || currentRoom.living.missing.length > 0 || currentRoom.kitchen.missing.length > 0;
    
    if (!allChecked) {
        currentRoom.status = 'pending';
    } else if (hasIssues) {
        currentRoom.status = 'issues';
    } else {
        currentRoom.status = 'completed';
    }
    
    closeModal();
    renderTable();
    
    const areaName = { bedroom: 'Bedroom', bathroom: 'Bathroom', living: 'Living Room', kitchen: 'Kitchen' }[currentArea];
    if (tempMissing.length > 0) {
        alert(`✓ ${areaName} checked! Found ${tempMissing.length} issue(s) that need attention.`);
    } else {
        alert(`✓ ${areaName} checked! All equipment is present.`);
    }
}

function markComplete(roomId) {
    const room = rooms.find(r => r.id === roomId);
    if (room && confirm(`Mark Room ${room.number} as Clean & Complete?`)) {
        room.status = 'completed';
        renderTable();
        alert(`Room ${room.number} marked as Clean & Complete!`);
    }
}

function viewIssues(roomId) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    if (userRole !== 'manager') {
        alert('Only manager can view and resolve issues!');
        return;
    }
    
    currentResolveRoom = room;
    
    let issues = [];
    if (room.bedroom.missing.length) issues.push({ area: 'Bedroom', items: [...room.bedroom.missing] });
    if (room.bathroom.missing.length) issues.push({ area: 'Bathroom', items: [...room.bathroom.missing] });
    if (room.living.missing.length) issues.push({ area: 'Living Room', items: [...room.living.missing] });
    if (room.kitchen.missing.length) issues.push({ area: 'Kitchen', items: [...room.kitchen.missing] });
    
    const modalBody = document.getElementById('issueModalBody');
    document.getElementById('issueRoomNumber').textContent = room.number;
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="color: #dc3545; margin-bottom: 15px;">Missing/Damaged Items:</h4>
            ${issues.map(issue => `
                <div style="margin-bottom: 20px;">
                    <strong>📌 ${issue.area}:</strong>
                    <div style="margin-top: 8px;">
                        ${issue.items.map(item => `<span class="missing-tag">${item}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 15px;">
            <label>Resolution Notes:</label>
            <textarea id="resolutionNotes" rows="3" placeholder="Describe what was done to resolve these issues..." style="width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; margin-top: 5px;"></textarea>
        </div>
    `;
    
    document.getElementById('issueModal').style.display = 'flex';
}

function resolveIssues() {
    if (!currentResolveRoom) return;
    
    const notes = document.getElementById('resolutionNotes')?.value || '';
    
    if (confirm(`Resolve all issues in Room ${currentResolveRoom.number}?\n\nNotes: ${notes || 'No notes provided'}`)) {
        currentResolveRoom.bedroom.missing = [];
        currentResolveRoom.bathroom.missing = [];
        currentResolveRoom.living.missing = [];
        currentResolveRoom.kitchen.missing = [];
        currentResolveRoom.status = 'completed';
        
        closeIssueModal();
        renderTable();
        alert(`Room ${currentResolveRoom.number} issues have been resolved!`);
        currentResolveRoom = null;
    }
}

function updateStats() {
    document.getElementById('totalRooms').textContent = rooms.length;
    document.getElementById('issueRooms').textContent = rooms.filter(r => r.status === 'issues').length;
}

function closeModal() {
    document.getElementById('equipmentModal').style.display = 'none';
    currentRoom = null;
    currentArea = null;
}

function closeIssueModal() {
    document.getElementById('issueModal').style.display = 'none';
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', () => renderTable());
document.getElementById('statusFilter').addEventListener('change', () => renderTable());

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.onclick = () => {
        closeModal();
        closeIssueModal();
    };
});

// Initial render
renderTable();

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