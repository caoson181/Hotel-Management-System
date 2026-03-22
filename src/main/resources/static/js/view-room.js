// View Room JavaScript - Cho Receptionist và Housekeeping

// Sample data
let rooms = window.rooms || [];

let userRole = '';

// Status flow theo role
const statusFlows = {
    receptionist: {
        available: ['reserved', 'occupied'],
        reserved: ['occupied'],
        occupied: ['checked-out'],
        'checked-out': [],
        housekeeping: []
    },
    manager: {
        available: ['reserved', 'occupied'],
        reserved: ['occupied'],
        occupied: ['checked-out'],
        'checked-out': [],
        housekeeping: []
    },
    housekeeping: {
        'checked-out': ['housekeeping'],
        housekeeping: ['available'],
        available: [],
        reserved: [],
        occupied: []
    }
};

// State
let currentFilter = 'all';
let currentSort = {
    field: 'roomNumber',
    order: 'asc'
};
let searchTerm = '';
let currentPage = 0;
const itemsPerPage = 20;



// DOM Elements
let tableBody, searchInput, sortSelect, sortAsc, sortDesc, statusCircles, pagination, roleIndicator;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    userRole = (window.userRoleFromServer || 'receptionist')
        .replace('ROLE_', '')
        .toLowerCase();

    if (userRole === 'housekeeper') {
        userRole = 'housekeeping';
    }
    console.log('View Room JS loaded - Role:', userRole);

    // Get DOM elements
    tableBody = document.getElementById('tableBody');
    searchInput = document.getElementById('searchInput');
    sortSelect = document.getElementById('sortSelect');
    sortAsc = document.getElementById('sortAsc');
    sortDesc = document.getElementById('sortDesc');
    statusCircles = document.querySelectorAll('.status-circle');
    pagination = document.getElementById('pagination');
    roleIndicator = document.getElementById('userRole');

    // Set role indicator
    if (roleIndicator) {
        roleIndicator.textContent =
            userRole.charAt(0).toUpperCase() + userRole.slice(1);
    }
    // Initial render
    renderTable();

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            currentPage = 0;
            renderTable();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort.field = e.target.value;
            renderTable();
        });
    }

    if (sortAsc) {
        sortAsc.addEventListener('click', () => {
            sortAsc.classList.add('active');
            if (sortDesc) sortDesc.classList.remove('active');
            currentSort.order = 'asc';
            renderTable();
        });
    }

    if (sortDesc) {
        sortDesc.addEventListener('click', () => {
            sortDesc.classList.add('active');
            if (sortAsc) sortAsc.classList.remove('active');
            currentSort.order = 'desc';
            renderTable();
        });
    }

    // Status filter
    if (statusCircles) {
        statusCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                statusCircles.forEach(c => c.classList.remove('active'));
                circle.classList.add('active');
                currentFilter = circle.dataset.status;
                currentPage = 0;
                renderTable();
            });
        });
    }

    // Close all dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
});

// Render table
function renderTable() {
    if (!tableBody) return;

    fetch(`/api/rooms/search?keyword=${searchTerm}&page=${Math.max(0, currentPage - 0)}
    &size=${itemsPerPage}
    &sortField=${currentSort.field}
    &sortDir=${currentSort.order}`

    )
        .then(res => res.json())
        .then(data => {

            let rooms = data.rooms.map(r => ({
                id: r.id,
                roomNumber: r.roomNumber,
                roomType: r.roomType,
                roomRank: r.roomRank,
                status: (r.status || '').toLowerCase()
            }));

            // ✅ Filter
            let filteredRooms = rooms.filter(room => {
                if (currentFilter !== 'all' && room.status !== currentFilter) {
                    return false;
                }


                return true;
            });

            // ✅ Sort

            filteredRooms.sort((a, b) => {
                let fieldA = a[currentSort.field]|| '';
                let fieldB = b[currentSort.field]|| '';

                // xử lý string
                if (typeof fieldA === 'string') {
                    fieldA = fieldA.toLowerCase();
                    fieldB = fieldB.toLowerCase();
                }

                if (fieldA < fieldB) return currentSort.order === 'asc' ? -1 : 1;
                if (fieldA > fieldB) return currentSort.order === 'asc' ? 1 : -1;
                return 0;
            });
            // ✅ Render
            tableBody.innerHTML = filteredRooms.map(room => `
                <tr>
                    <td><strong>${room.roomNumber}</strong></td>
                    <td>${room.roomType}</td>
                    <td>
                        <span class="status-badge status-${room.status}">
                            ${formatStatus(room.status)}
                        </span>
                    </td>
                    <td>${room.roomRank}</td>
                    <td>${renderActionDropdown(room)}</td>
                </tr>
            `).join('');

            // ✅ Pagination dùng từ server
            renderPagination(data.totalPages);
        });
}

// Render action dropdown theo role và status
function renderActionDropdown(room) {
    const role = (userRole || '').toLowerCase();
    const status = (room.status || '').toLowerCase().trim();

    const allowedStatuses = statusFlows[role]?.[status] || [];

    if (allowedStatuses.length === 0) {
        return '<span class="no-action">—</span>';
    }

    return `
        <div class="action-dropdown">
            <button class="dropdown-btn" onclick="toggleDropdown(event, ${room.id})">
                Change Status <i class="fas fa-chevron-down"></i>
            </button>
            <div class="dropdown-menu" id="dropdown-${room.id}">
                ${allowedStatuses.map(s => `
                    <div class="dropdown-item" onclick="changeRoomStatus(${room.id}, '${s}')">
                        <i class="fas ${getStatusIcon(s)}"></i>
                        ${formatStatus(s)}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
// Toggle dropdown
function toggleDropdown(event, roomId) {
    event.stopPropagation();

    // Close all other dropdowns
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        if (menu.id !== `dropdown-${roomId}`) {
            menu.classList.remove('show');
        }
    });

    // Toggle current dropdown
    const dropdown = document.getElementById(`dropdown-${roomId}`);
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Change room status
function changeRoomStatus(roomId, newStatus) {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    // Kiểm tra quyền
    const allowedStatuses = statusFlows[userRole]?.[room.status] || [];
    if (!allowedStatuses.includes(newStatus)) {
        alert('You do not have permission to change to this status');
        return;
    }

    // Update status
    room.status = newStatus;

    // Close dropdown
    const dropdown = document.getElementById(`dropdown-${roomId}`);
    if (dropdown) {
        dropdown.classList.remove('show');
    }

    // Show success message
    alert(`Room ${room.room_number} status changed to ${formatStatus(newStatus)}`);

    // Re-render table
renderTable();
}

// Render pagination
function renderPagination(totalPages) {
    pagination.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i + 1;

        if (i === currentPage) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            currentPage = i;   // ✅ QUAN TRỌNG
            renderTable();     // ✅ gọi lại API
        });

        pagination.appendChild(btn);
    }
}
// Go to page
function goToPage(page) {
    currentPage = page;
    renderTable();
}

// Format status
function formatStatus(status) {
    switch(status) {
        case 'available': return 'Available';
        case 'reserved': return 'Reserved';
        case 'occupied': return 'Occupied';
        case 'checked-out': return 'Checked Out';
        case 'housekeeping': return 'Housekeeping';
        default: return status;
    }
}

// Get status icon
function getStatusIcon(status) {
    switch(status) {
        case 'available': return 'fa-check-circle';
        case 'reserved': return 'fa-clock';
        case 'occupied': return 'fa-user';
        case 'checked-out': return 'fa-sign-out-alt';
        case 'housekeeping': return 'fa-broom';
        default: return 'fa-circle';
    }
}

// Make functions globally available
window.toggleDropdown = toggleDropdown;
window.changeRoomStatus = changeRoomStatus;
window.goToPage = goToPage;

// Function to set user role (có thể gọi từ login)
function setUserRole(role) {
    if (role === 'receptionist' || role === 'housekeeping') {
        userRole = role;
        if (roleIndicator) {
            roleIndicator.textContent = role === 'receptionist' ? 'Receptionist' : 'Housekeeping';
        }
        renderTable();
    }
}
function changeRoomStatus(roomId, status) {
    fetch(`/api/rooms/${roomId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    })
        .then(() => renderTable()); // reload lại

}
