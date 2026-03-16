// View Room Status JavaScript

// Sample data
// Sample data với room_rank là string
let rooms = [
    {
        id: 1,
        room_number: '101',
        room_type: 'Single',
        status: 'available',
        base_price: 500000,
        price: 500000,
        room_rank: 'Standard',  // Đổi từ 3 thành 'Standard'
        description: 'Standard room with city view',
        picture: 'https://via.placeholder.com/300x200'
    },
    {
        id: 2,
        room_number: '102',
        room_type: 'Double',
        status: 'reserved',
        base_price: 800000,
        price: 750000,
        room_rank: 'Superior',  // Đổi từ 4 thành 'Superior'
        description: 'Deluxe room reserved for VIP',
        picture: 'https://via.placeholder.com/300x200'
    },
    {
        id: 3,
        room_number: '103',
        room_type: 'Twin',
        status: 'occupied',
        base_price: 1200000,
        price: 1100000,
        room_rank: 'Deluxe',  // Đổi từ 5 thành 'Deluxe'
        description: 'Suite with guests',
        picture: 'https://via.placeholder.com/300x200'
    },
    {
        id: 4,
        room_number: '104',
        room_type: 'Triple',
        status: 'checked-out',
        base_price: 900000,
        price: 850000,
        room_rank: 'Executive',  // Đổi từ 4 thành 'Executive'
        description: 'Family room ready for cleaning',
        picture: 'https://via.placeholder.com/300x200'
    },
    {
        id: 5,
        room_number: '105',
        room_type: 'Family',
        status: 'housekeeping',
        base_price: 1500000,
        price: 1400000,
        room_rank: 'Suite',  // Đổi từ 5 thành 'Suite'
        description: 'VIP room being cleaned',
        picture: 'https://via.placeholder.com/300x200'
    }
];

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
let tableBody, searchInput, sortSelect, sortAsc, sortDesc, statusCircles, pagination;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('View Room Status JS loaded');

    // Get DOM elements
    tableBody = document.getElementById('tableBody');
    searchInput = document.getElementById('searchInput');
    sortSelect = document.getElementById('sortSelect');
    sortAsc = document.getElementById('sortAsc');
    sortDesc = document.getElementById('sortDesc');
    statusCircles = document.querySelectorAll('.status-circle');
    pagination = document.getElementById('pagination');

    // Check if elements exist
    if (!tableBody) {
        console.error('Table body not found');
        return;
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

    // Form submit
    const roomForm = document.getElementById('roomForm');
    if (roomForm) {
        roomForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveRoom();
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
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

        if (currentSort.field === 'base_price' || currentSort.field === 'price') {
            aVal = Number(aVal);
            bVal = Number(bVal);
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
                    ${room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
            </td>
            <td>${formatCurrency(room.base_price)}</td>
            <td>${formatCurrency(room.price)}</td>
            <td>${room.room_rank}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon" onclick="viewDetails(${room.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editRoom(${room.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteRoom(${room.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Render pagination
    renderPagination(totalPages);
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

// Format currency (VND)
function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
}

// View details
function viewDetails(id) {
    console.log('Viewing details for room:', id);
    const room = rooms.find(r => r.id === id);
    if (!room) return;

    const modalBody = document.getElementById('detailModalBody');
    if (!modalBody) {
        console.error('Detail modal body not found');
        return;
    }

    modalBody.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Room Number:</div>
            <div class="detail-value"><strong>${room.room_number}</strong></div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Room Type:</div>
            <div class="detail-value">${room.room_type}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Status:</div>
            <div class="detail-value">
                <span class="status-badge status-${room.status}">
                    ${room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Base Price:</div>
            <div class="detail-value">${formatCurrency(room.base_price)}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Current Price:</div>
            <div class="detail-value">${formatCurrency(room.price)}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Room Rank:</div>
            <div class="detail-value">${room.room_rank}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Description:</div>
            <div class="detail-value">${room.description || 'No description available'}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Image:</div>
            <div class="detail-value">
                ${room.picture ? `<img src="${room.picture}" alt="Room ${room.room_number}" class="room-image">` : 'No image available'}
            </div>
        </div>
    `;

    openModal('detailModal');
}

// Open add modal
function openAddModal() {
    console.log('Opening add modal');
    const modalTitle = document.getElementById('modalTitle');
    const roomForm = document.getElementById('roomForm');
    const roomId = document.getElementById('roomId');

    if (modalTitle) modalTitle.textContent = 'Add New Room';
    if (roomForm) roomForm.reset();
    if (roomId) roomId.value = '';

    openModal('formModal');
}

// Edit room
function editRoom(id) {
    console.log('Editing room:', id);
    const room = rooms.find(r => r.id === id);
    if (!room) return;

    const modalTitle = document.getElementById('modalTitle');
    const roomId = document.getElementById('roomId');
    const roomNumber = document.getElementById('room_number');
    const roomType = document.getElementById('room_type');
    const status = document.getElementById('status');
    const basePrice = document.getElementById('base_price');
    const price = document.getElementById('price');
    const roomRank = document.getElementById('room_rank');
    const description = document.getElementById('description');
    const picture = document.getElementById('picture');

    if (modalTitle) modalTitle.textContent = 'Edit Room';
    if (roomId) roomId.value = room.id;
    if (roomNumber) roomNumber.value = room.room_number;
    if (roomType) roomType.value = room.room_type;
    if (status) status.value = room.status;
    if (basePrice) basePrice.value = room.base_price;
    if (price) price.value = room.price;
    if (roomRank) roomRank.value = room.room_rank;
    if (description) description.value = room.description || '';
    if (picture) picture.value = room.picture || '';

    openModal('formModal');
}

// Save room
function saveRoom() {
    console.log('Saving room');
    const roomId = document.getElementById('roomId');
    const roomNumber = document.getElementById('room_number');
    const roomType = document.getElementById('room_type');
    const status = document.getElementById('status');
    const basePrice = document.getElementById('base_price');
    const price = document.getElementById('price');
    const roomRank = document.getElementById('room_rank');
    const description = document.getElementById('description');
    const picture = document.getElementById('picture');

    if (!roomNumber || !roomType || !status || !basePrice || !price || !roomRank) {
        console.error('Required fields missing');
        alert('Please fill in all required fields');
        return;
    }

    if (!roomNumber.value || !roomType.value || !status.value || !basePrice.value || !price.value || !roomRank.value) {
        alert('Please fill in all required fields');
        return;
    }

    const roomData = {
        room_number: roomNumber.value,
        room_type: roomType.value,
        status: status.value,
        base_price: Number(basePrice.value),
        price: Number(price.value),
        room_rank: roomRank.value,  // Bỏ Number()
        description: description ? description.value : '',
        picture: picture ? picture.value : ''
    };

    if (roomId && roomId.value) {
        // Update existing room
        const index = rooms.findIndex(r => r.id === Number(roomId.value));
        if (index !== -1) {
            rooms[index] = { ...rooms[index], ...roomData };
            console.log('Room updated:', rooms[index]);
            alert('Room updated successfully!');
        }
    } else {
        // Add new room
        const newId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
        rooms.push({ id: newId, ...roomData });
        console.log('New room added:', { id: newId, ...roomData });
        alert('New room added successfully!');
    }

    closeModal('formModal');
    renderTable();
}

// Delete room
function deleteRoom(id) {
    console.log('Deleting room:', id);
    if (confirm('Are you sure you want to delete this room?')) {
        rooms = rooms.filter(r => r.id !== id);
        if (rooms.length > 0) {
            const totalPages = Math.ceil(rooms.length / itemsPerPage);
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }
        } else {
            currentPage = 1;
        }
        renderTable();
        console.log('Room deleted');
        alert('Room deleted successfully!');
    }
}

// Modal functions
function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
    } else {
        console.error('Modal not found:', modalId);
    }
}

function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

// Make functions globally available
window.viewDetails = viewDetails;
window.editRoom = editRoom;
window.deleteRoom = deleteRoom;
window.openAddModal = openAddModal;
window.closeModal = closeModal;
window.goToPage = goToPage;