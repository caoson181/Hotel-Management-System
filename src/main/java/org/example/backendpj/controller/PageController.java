package org.example.backendpj.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Entity.CustomerBooking;
import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.BookingDetailRepository;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.CustomerBookingRepository;
import org.example.backendpj.Repository.WalletRepository;
import org.example.backendpj.Service.BookingLifecycleService;
import org.example.backendpj.Service.CustomerTierService;
import org.example.backendpj.Service.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.security.core.Authentication;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Entity.UserAvatar;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.Repository.RoomRepository;
import org.example.backendpj.Repository.UserAvatarRepository;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Locale;

@Controller
public class PageController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final RoomRepository roomRepository;
    private final CustomerTierService customerTierService;
    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final CustomerBookingRepository customerBookingRepository;
    private final WalletRepository walletRepository;
    private final BookingLifecycleService bookingLifecycleService;

    public PageController(UserRepository userRepository,
                          UserService userService,
                          RoomRepository roomRepository,
                          CustomerTierService customerTierService,
                          BookingRepository bookingRepository,
                          BookingDetailRepository bookingDetailRepository,
                          CustomerBookingRepository customerBookingRepository,
                          WalletRepository walletRepository,
                          BookingLifecycleService bookingLifecycleService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.roomRepository = roomRepository;
        this.customerTierService = customerTierService;
        this.bookingRepository = bookingRepository;
        this.bookingDetailRepository = bookingDetailRepository;
        this.customerBookingRepository = customerBookingRepository;
        this.walletRepository = walletRepository;
        this.bookingLifecycleService = bookingLifecycleService;
    }

    // ================= ADMIN HOME =================

    @GetMapping("/index")
    public String index(Model model, Principal principal) {

        if (principal != null) {
            String username = principal.getName();
            User user = userService.findByUsername(username);
            model.addAttribute("currentUser", user);
        }

        return "index";
    }
    // ================= AUTH =================

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/forgot-password")
    public String forgotPassword() {
        return "forgot-password";
    }

    @GetMapping("/reset-password")
    public String resetPassword() {
        return "reset-password";
    }

    // ================= ROOMS =================

    @GetMapping("/rooms/check-equipment")
    public String checkEquipment() {
        return "pages/rooms/check-equipment";
    }

    @GetMapping("/rooms/view-room")
    public String viewRoom(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword,
            Model model) {

        int pageSize = 20;

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("roomNumber").ascending());

        Page<Room> roomPage;

        if (keyword != null && !keyword.isEmpty()) {
            roomPage = roomRepository
                    .findByRoomNumberContainingIgnoreCaseOrRoomTypeContainingIgnoreCase(
                            keyword, keyword, pageable);
        } else {
            roomPage = roomRepository.findAll(pageable);
        }

        model.addAttribute("rooms", roomPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", roomPage.getTotalPages());
        model.addAttribute("keyword", keyword);

        return "pages/rooms/view-room";
    }

    @GetMapping("/rooms/check-in-out")
    public String checkInOut() {
        return "pages/rooms/check-in-out";
    }

    // ================= STAFF =================

    @GetMapping("/staff/manage-staff")
    public String manageStaff() {
        return "pages/staff/manage-staff";
    }

    @GetMapping("/staff/view-staff")
    public String viewStaff() {
        return "pages/staff/view-staff";
    }

    // ================= USERS =================

    @GetMapping("/users/manage-users")
    public String manageUsers() {
        return "pages/users/manage-users";
    }

    @GetMapping("/profile")
    public String profile(Model model, Authentication authentication) {

        String login = null;

        if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User userDetails) {
            login = userDetails.getUsername();
        } else if (authentication.getPrincipal() instanceof org.springframework.security.oauth2.core.user.OAuth2User oauthUser) {
            login = oauthUser.getAttribute("email");
        }

        User user = userRepository
                .findByUsernameOrEmail(login, login)
                .orElse(null);

        // 🔥 tránh crash
        if (user == null) {
            return "redirect:/login";
        }

        UserAvatar avatar = avatarRepo
                .findByUser_IdAndIsCurrentTrue(user.getId())
                .orElse(null);

        List<UserAvatar> avatars = avatarRepo.findByUserId(user.getId());

        // ================= HISTORY =================
        List<Map<String, Object>> history = List.of();

        if (user.getCustomer() != null) {
            history = bookingRepository.findAllByCustomerOrderByIdDesc(user.getCustomer()).stream()
                    .map(this::toBookingHistoryItem)
                    .toList();
        }

        long bookingCount = history.size();
        long pendingBookingCount = history.stream()
                .filter(item -> hasBookingStatus(item, "PENDING"))
                .count();
        long cancelledBookingCount = history.stream()
                .filter(item -> hasBookingStatus(item, "CANCELLATION"))
                .count();
        long completedBookingCount = history.stream()
                .filter(item -> hasBookingStatus(item, "COMPLETED"))
                .count();
        long refundRecordCount = history.stream()
                .filter(item -> toBigDecimal(item.get("refundAmount")).compareTo(BigDecimal.ZERO) > 0)
                .count();

        var wallet = walletRepository.findByUser(user).orElse(null);

        // ================= MODEL =================
        model.addAttribute("avatar", avatar);
        model.addAttribute("avatars", avatars);
        model.addAttribute("user", user);
        model.addAttribute("wallet", wallet);

        model.addAttribute("bookingHistory", history);
        model.addAttribute("bookingCount", bookingCount);
        model.addAttribute("pendingBookingCount", pendingBookingCount);
        model.addAttribute("cancelledBookingCount", cancelledBookingCount);
        model.addAttribute("completedHistoryCount", completedBookingCount);
        model.addAttribute("refundRecordCount", refundRecordCount);
        if (user.getCustomer() != null) {
            CustomerTierService.TierUpdateResult tierResult = customerTierService.refreshTier(user.getCustomer());
            model.addAttribute("member", tierResult.memberLevel());
            model.addAttribute("rank", tierResult.customerRank());
            model.addAttribute("memberLevel", tierResult.memberLevel());
            model.addAttribute("customerRank", tierResult.customerRank());
            model.addAttribute("totalSpent", tierResult.totalCompletedAmount());
            model.addAttribute("completedBookingCount", tierResult.completedBookingCount());
        } else {
            model.addAttribute("member", "Bronze");
            model.addAttribute("rank", "Normal");
            model.addAttribute("memberLevel", "Bronze");
            model.addAttribute("customerRank", "Normal");
            model.addAttribute("totalSpent", java.math.BigDecimal.ZERO);
            model.addAttribute("completedBookingCount", 0L);
        }

        return "homepage/profile";
    }

    private Map<String, Object> toBookingHistoryItem(Booking booking) {
        List<Map<String, Object>> details;
        if (booking.getGroupCode() != null && !booking.getGroupCode().isBlank()) {
            details = customerBookingRepository.findAllByGroupCodeOrderByIdAsc(booking.getGroupCode()).stream()
                    .map(customerBooking -> toBookingHistoryDetailItem(booking, customerBooking))
                    .toList();
        } else {
            details = bookingDetailRepository.findAllByBooking(booking).stream()
                    .map(this::toBookingDetailHistoryItem)
                    .toList();
        }

        Map<String, Object> cancellationPreview = bookingLifecycleService.buildCancellationPreview(booking, LocalDate.now());
        String bookingStatus = booking.getStatus() == null ? "" : booking.getStatus().toUpperCase(Locale.ROOT);
        boolean canCancel = canCancelBooking(booking, bookingStatus);

        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", booking.getId());
        item.put("groupCode", booking.getGroupCode());
        item.put("status", booking.getStatus());
        item.put("checkIn", booking.getCheckInDate());
        item.put("checkOut", booking.getCheckOutDate());
        item.put("totalAmount", booking.getTotalAmount() == null ? BigDecimal.ZERO : booking.getTotalAmount());
        item.put("paymentMode", booking.getPaymentMode() == null ? "PAY_LATER" : booking.getPaymentMode());
        item.put("refundAmount", booking.getRefundAmount() == null ? BigDecimal.ZERO : booking.getRefundAmount());
        item.put("cancellationFee", booking.getCancellationFee() == null ? BigDecimal.ZERO : booking.getCancellationFee());
        item.put("canCancel", canCancel);
        item.put("refundRate", cancellationPreview.get("refundRate"));
        item.put("previewRefundAmount", cancellationPreview.get("refundAmount"));
        item.put("previewCancellationFee", cancellationPreview.get("cancellationFee"));
        item.put("daysBeforeCheckIn", cancellationPreview.get("daysBeforeCheckIn"));
        item.put("details", details);
        return item;
    }

    private Map<String, Object> toBookingHistoryDetailItem(Booking booking, CustomerBooking customerBooking) {
        if (customerBooking == null) {
            return Map.of();
        }

        Room assignedRoom = customerBooking.getAssignedRoom();
        if (assignedRoom != null) {
            BookingDetail linkedDetail = bookingDetailRepository.findTopByBookingAndRoomAndCheckInDateAndCheckOutDateOrderByIdDesc(
                            booking,
                            assignedRoom,
                            customerBooking.getCheckIn(),
                            customerBooking.getCheckOut())
                    .orElse(null);
            if (linkedDetail != null) {
                return toBookingDetailHistoryItem(linkedDetail);
            }
        }

        return toPendingBookingHistoryItem(customerBooking);
    }

    private Map<String, Object> toBookingDetailHistoryItem(BookingDetail detail) {
        Room room = detail.getRoom();
        Map<String, Object> cancellationPreview = bookingLifecycleService.buildDetailCancellationPreview(detail, LocalDate.now());
        String detailStatus = detail.getStatus() == null ? "" : detail.getStatus().toUpperCase(Locale.ROOT);
        boolean canCancel = canCancelDetail(detail, detailStatus);
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", detail.getId());
        item.put("roomNumber", room != null ? room.getRoomNumber() : "N/A");
        item.put("roomType", room != null ? room.getRoomType() : "");
        item.put("roomRank", room != null ? room.getRoomRank() : "");
        item.put("price", detail.getPrice() == null ? BigDecimal.ZERO : detail.getPrice());
        item.put("finalAmount", detail.getFinalAmount() == null ? BigDecimal.ZERO : detail.getFinalAmount());
        item.put("checkIn", detail.getCheckInDate());
        item.put("checkOut", detail.getCheckOutDate());
        item.put("actualCheckOut", detail.getActualCheckOutDate());
        item.put("status", detail.getStatus() == null ? "" : detail.getStatus());
        item.put("canCancel", canCancel);
        item.put("cancelTargetType", "detail");
        item.put("previewRefundAmount", cancellationPreview.get("refundAmount"));
        item.put("previewCancellationFee", cancellationPreview.get("cancellationFee"));
        return item;
    }

    private Map<String, Object> toPendingBookingHistoryItem(CustomerBooking detail) {
        Map<String, Object> cancellationPreview = bookingLifecycleService
                .buildPendingCustomerBookingCancellationPreview(detail, LocalDate.now());
        boolean canCancel = canCancelPendingCustomerBooking(detail);
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", detail.getId());
        item.put("roomNumber", detail.getAssignedRoom() != null ? detail.getAssignedRoom().getRoomNumber() : "Pending assignment");
        item.put("roomType", detail.getRoomType());
        item.put("roomRank", detail.getRoomRank());
        item.put("price", detail.getPrice() == null ? BigDecimal.ZERO : detail.getPrice());
        item.put("finalAmount", detail.getPrice() == null ? BigDecimal.ZERO : detail.getPrice());
        item.put("checkIn", detail.getCheckIn());
        item.put("checkOut", detail.getCheckOut());
        item.put("actualCheckOut", null);
        item.put("status", detail.getStatus() != null && detail.getStatus().toUpperCase(Locale.ROOT).contains("CANCELLATION")
                ? "CANCELLATION"
                : (detail.isAssigned() ? "ASSIGNED" : "PENDING"));
        item.put("canCancel", canCancel);
        item.put("cancelTargetType", "pending");
        item.put("previewRefundAmount", cancellationPreview.getOrDefault("refundAmount", BigDecimal.ZERO));
        item.put("previewCancellationFee", cancellationPreview.getOrDefault("cancellationFee", BigDecimal.ZERO));
        return item;
    }

    private boolean hasBookingStatus(Map<String, Object> item, String... expectedStatuses) {
        String status = String.valueOf(item.getOrDefault("status", "")).toUpperCase(Locale.ROOT);
        for (String expectedStatus : expectedStatuses) {
            if (status.contains(expectedStatus)) {
                return true;
            }
        }
        return false;
    }

    private boolean canCancelBooking(Booking booking, String bookingStatus) {
        if (bookingStatus.contains("COMPLETED")
                || bookingStatus.contains("NO_SHOW")
                || bookingStatus.contains("CANCELLATION")
                || booking.getCheckInDate() == null
                || LocalDate.now().isAfter(booking.getCheckInDate())) {
            return false;
        }

        for (BookingDetail detail : bookingDetailRepository.findAllByBooking(booking)) {
            if (!canCancelDetail(detail, detail.getStatus() == null ? "" : detail.getStatus().toUpperCase(Locale.ROOT))) {
                return false;
            }
        }

        return true;
    }

    private boolean canCancelDetail(BookingDetail detail, String detailStatus) {
        if (detailStatus.contains("NO_SHOW")
                || detailStatus.contains("CANCELLATION")
                || detail.getActualCheckOutDate() != null
                || detail.getCheckInDate() == null
                || LocalDate.now().isAfter(detail.getCheckInDate())) {
            return false;
        }

        String roomStatus = detail.getRoom() != null && detail.getRoom().getStatus() != null
                ? detail.getRoom().getStatus().trim().toUpperCase(Locale.ROOT)
                : "";
        return !roomStatus.equals("OCCUPIED")
                && !roomStatus.equals("CHECKED-OUT")
                && !roomStatus.equals("HOUSEKEEPING");
    }

    private boolean canCancelPendingCustomerBooking(CustomerBooking detail) {
        return !detail.isAssigned()
                && detail.getCheckIn() != null
                && !LocalDate.now().isAfter(detail.getCheckIn())
                && (detail.getStatus() == null || !detail.getStatus().toUpperCase(Locale.ROOT).contains("CANCELLATION"));
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        return BigDecimal.ZERO;
    }

    @Autowired
    private UserAvatarRepository avatarRepo;

    @GetMapping("/staff/profile")
    public String staffProfile(Model model, Principal principal) {

        User user = userService.findByUsername(principal.getName());

        UserAvatar avatar = avatarRepo
                .findByUser_IdAndIsCurrentTrue(user.getId())
                .orElse(null);

        List<UserAvatar> avatars = avatarRepo.findByUserId(user.getId());

        model.addAttribute("user", user);
        model.addAttribute("avatars", avatars);
        model.addAttribute("avatar", avatar);

        return "pages/staff/profile";
    }

    // ================= REVENUE =================

    @GetMapping("/revenue/view-revenue")
    public String viewRevenue() {
        return "pages/revenue/view-revenue";
    }

    // ================= REPORTS =================

    // @GetMapping("/reports/view-reports")
    // public String viewReports(){
    // return "pages/reports/view-reports";
    // }

    @GetMapping("/checkout/payment")
    public String paymentPage() {
        return "homepage/fake-payment";
    }
}
