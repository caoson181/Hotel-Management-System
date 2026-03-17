// View Room JavaScript - Cho Receptionist và Housekeeping

// Sample data
let rooms = [
    {
        id: 1,
        room_number: '101',
        room_type: 'Single',
        status: 'available',
        room_rank: 'Standard',
        description: 'Standard room with city view'
    },
    {
        id: 2,
        room_number: '102',
        room_type: 'Double',
        status: 'reserved',
        room_rank: 'Superior',
        description: 'Deluxe room reserved for VIP'
    },
    {
        id: 3,
        room_number: '103',
        room_type: 'Twin',
        status: 'occupied',
        room_rank: 'Deluxe',
        description: 'Suite with guests'
    },
    {
        id: 4,
        room_number: '104',
        room_type: 'Triple',
        status: 'checked-out',
        room_rank: 'Executive',
        description: 'Family room ready for cleaning'
    },
    {
        id: 5,
        room_number: '105',
        room_type: 'Family',
        status: 'housekeeping',
        room_rank: 'Suite',
        description: 'VIP room being cleaned'
    }
];

// User role - Có thể lấy từ session/login
// Thay đổi giá trị này để test: 'receptionist' hoặc 'housekeeping'
let userRole = 'receptionist'; // Mặc định là receptionist

// Status flow theo role
const statusFlows = {
    receptionist: {
        available: ['reserved', 'occupied'],
        reserved: ['occupied', 'available'],
        occupied: ['checked-out'],
        'checked-out': [],
        housekeeping: [] // Receptionist không thể thay đổi status housekeeping
    },
    housekeeping: {
        'checked-out': ['housekeeping'],
        housekeeping: ['available'],
        available: [], // Housekeeping không thể thay đổi available
        reserved: [],
        occupied: []
    }
};

// State
let currentFilter = 'all';
let currentSort = {
    field: 'room_number',
    order: 'asc'
};
let searchTerm = '';
let currentPage = 1;
const itemsPerPage = 5;

// DOM Elements
let tableBody, searchInput, sortSelect, sortAsc, sortDesc, statusCircles, pagination, roleIndicator;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
        roleIndicator.textContent = userRole === 'receptionist' ? 'Receptionist' : 'Housekeeping';
    }

    // Initial render
    renderTable();

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            currentPage = 1;
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
                currentPage = 1;
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

    // Filter
    let filteredRooms = rooms.filter(room => {
        // Status filter
        if (currentFilter !== 'all' && room.status !== currentFilter) {
            return false;
        }

        // Housekeeping chỉ thấy phòng checked-out
        if (userRole === 'housekeeping' && room.status !== 'checked-out' && room.status !== 'housekeeping' && currentFilter === 'all') {
            return false;
        }

        // Search filter
        if (searchTerm) {
            return room.room_number.toLowerCase().includes(searchTerm) ||
                   room.room_type.toLowerCase().includes(searchTerm) ||
                   (room.description && room.description.toLowerCase().includes(searchTerm));
        }

        return true;
    });

    // Sort
    filteredRooms.sort((a, b) => {
        let aVal = a[currentSort.field];
        let bVal = b[currentSort.field];

        if (currentSort.field === 'room_number') {
            aVal = parseInt(aVal);
            bVal = parseInt(bVal);
        }

        if (currentSort.order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    // Pagination
    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedRooms = filteredRooms.slice(start, start + itemsPerPage);

    // Render table rows
    tableBody.innerHTML = paginatedRooms.map(room => `
        <tr>
            <td><strong>${room.room_number}</strong></td>
            <td>${room.room_type}</td>
            <td>
                <span class="status-badge status-${room.status}">
                    ${formatStatus(room.status)}
                </span>
            </td>
            <td>${room.room_rank}</td>
            <td>
                ${renderActionDropdown(room)}
            </td>
        </tr>
    `).join('');

    // Render pagination
    renderPagination(totalPages);
}

// Render action dropdown theo role và status
function renderActionDropdown(room) {
    const allowedStatuses = statusFlows[userRole]?.[room.status] || [];

    if (allowedStatuses.length === 0) {
        return '<span class="no-action">—</span>';
    }

    return `
        <div class="action-dropdown">
            <button class="dropdown-btn" onclick="toggleDropdown(event, ${room.id})">
                Change Status <i class="fas fa-chevron-down"></i>
            </button>
            <div class="dropdown-menu" id="dropdown-${room.id}">
                ${allowedStatuses.map(status => `
                    <div class="dropdown-item" onclick="changeRoomStatus(${room.id}, '${status}')">
                        <i class="fas ${getStatusIcon(status)}"></i>
                        ${formatStatus(status)}
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
    if (!pagination) return;

    let paginationHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `
            <button class="page-btn ${currentPage === i ? 'active' : ''}"
                    onclick="goToPage(${i})">${i}</button>
        `;
    }
    pagination.innerHTML = paginationHtml;
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