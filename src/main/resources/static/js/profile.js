const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const profileEditForm = document.getElementById("profileEditForm");
const breadcrumb = document.getElementById("profileBreadcrumb");
const panels = Array.from(document.querySelectorAll(".profile-panel"));
const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
const themeButtons = Array.from(document.querySelectorAll("[data-theme-value]"));
const PROFILE_THEME_STORAGE_KEY = "customerTheme";
const membershipMeta = document.querySelector(".profile-membership-meta");
const rankCouponList = document.getElementById("rankCouponList");
const levelServicePolicyList = document.getElementById("levelServicePolicyList");
const rankPrivilegeTitle = document.getElementById("rankPrivilegeTitle");
const levelPrivilegeTitle = document.getElementById("levelPrivilegeTitle");
const membershipHeroTitle = document.getElementById("membershipHeroTitle");
const membershipHeroText = document.getElementById("membershipHeroText");
const membershipHeroBadge = document.getElementById("membershipHeroBadge");
const membershipProgressTitle = document.getElementById("membershipProgressTitle");
const membershipProgressCopy = document.getElementById("membershipProgressCopy");
const membershipProgressFill = document.getElementById("membershipProgressFill");
const membershipProgressCurrent = document.getElementById("membershipProgressCurrent");
const membershipProgressTarget = document.getElementById("membershipProgressTarget");
const membershipLevelValue = document.getElementById("membershipLevelValue");
const membershipRankValue = document.getElementById("membershipRankValue");
const membershipSpentValue = document.getElementById("membershipSpentValue");
const membershipCouponCount = document.getElementById("membershipCouponCount");
const membershipNextTitle = document.getElementById("membershipNextTitle");
const membershipNextCopy = document.getElementById("membershipNextCopy");
const membershipNextPills = document.getElementById("membershipNextPills");
const PROFILE_LOCALE = document.documentElement.lang === "vi" ? "vi" : "en";
const isVietnamese = PROFILE_LOCALE === "vi";

const LEVEL_LABELS = {
  vi: { bronze: "Đồng", silver: "Bạc", gold: "Vàng", platinum: "Bạch kim" },
  en: { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" },
};

const RANK_LABELS = {
  vi: { normal: "Thường", vip: "VIP", vvip: "VVIP" },
  en: { normal: "Normal", vip: "VIP", vvip: "VVIP" },
};

const ROLE_LABELS = {
  vi: { customer: "Khách hàng", admin: "Quản trị viên", manager: "Quản lý", receptionist: "Lễ tân", staff: "Nhân viên" },
  en: { customer: "Customer", admin: "Administrator", manager: "Manager", receptionist: "Receptionist", staff: "Staff" },
};

const GENDER_LABELS = {
  vi: { male: "Nam", female: "Nữ", other: "Khác" },
  en: { male: "Male", female: "Female", other: "Other" },
};

const STATUS_LABELS = {
  vi: {
    pending: "Đang chờ",
    assigned: "Đã xếp phòng",
    confirmed: "Đã xác nhận",
    completed: "Hoàn tất",
    cancelled: "Đã hủy",
    cancellation: "Đã hủy",
    refund: "Hoàn tiền",
    refunded: "Đã hoàn tiền",
    pay_now: "Thanh toán ngay",
    pay_later: "Thanh toán tại quầy",
  },
  en: {
    pending: "Pending",
    assigned: "Assigned",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    cancellation: "Cancelled",
    refund: "Refund",
    refunded: "Refunded",
    pay_now: "Pay now",
    pay_later: "Pay later",
  },
};

const PROFILE_TEXT = {
  vi: {
    title: "Hồ sơ của tôi - Gravity Hotel",
    heroTitle: "Hồ sơ của tôi",
    heroText: "Quản lý thông tin tài khoản, ví, đặt phòng và các tùy chọn cá nhân.",
    guest: "Khách",
    memberBenefitsTitle: "Quyền lợi thành viên",
    memberBenefitsText: "Các quyền lợi thành viên đang được áp dụng cho tài khoản của bạn.",
    level: "Cấp độ",
    rank: "Hạng",
    upgradePlan: "Nâng hạng thành viên",
    panelTitles: {
      overview: "Tài khoản",
      profile: "Tài khoản > Hồ sơ",
      wallet: "Tài khoản > Ví & giao dịch",
      membership: "Tài khoản > Trung tâm thành viên",
      coupons: "Tài khoản > Mã ưu đãi của tôi",
      bookings: "Tài khoản > Đặt phòng & hoàn tiền",
      settings: "Tài khoản > Cài đặt chung",
      security: "Tài khoản > Bảo mật",
    },
    labels: {
      notSet: "Chưa cập nhật",
      account: "Tài khoản",
      profile: "Hồ sơ",
      open: "Mở",
      walletTransactions: "Ví & giao dịch",
      walletAvailableSuffix: "VND khả dụng",
      transactions: "giao dịch",
      bookingsRefunds: "Đặt phòng & hoàn tiền",
      pending: "đang chờ",
      cancelled: "đã hủy",
      bookings: "đơn đặt phòng",
      membershipCenter: "Trung tâm thành viên",
      membershipCenterText: "Xem cấp độ, hạng, tiến trình và các quyền lợi dịch vụ hiện tại của bạn.",
      myCoupons: "Mã ưu đãi của tôi",
      myCouponsText: "Xem các ưu đãi hiện đang được mở khóa theo hạng thành viên của bạn.",
      securitySettings: "Bảo mật & cài đặt",
      securitySettingsShort: "Email, mật khẩu và tùy chọn hồ sơ",
      generalSettings: "Cài đặt chung",
      security: "Bảo mật",
      accountDetails: "Chi tiết tài khoản",
      accountDetailsText: "Quản lý thông tin cá nhân & bảo mật",
      edit: "Chỉnh sửa",
      name: "Họ tên",
      phone: "Số điện thoại",
      gender: "Giới tính",
      username: "Tên đăng nhập",
      role: "Vai trò",
      membership: "Thành viên",
      saveChanges: "Lưu thay đổi",
      cancel: "Hủy",
      walletText: "Xem số dư ví, mã thanh toán và hoạt động gần đây.",
      walletBalance: "Số dư ví",
      walletBalanceText: "Chỉ ghi nhận cho thanh toán trực tuyến và hoàn tiền trong hệ thống.",
      vnpayCode: "Mã VNPay",
      momoCode: "Mã MoMo",
      unavailable: "Chưa có",
      totalTransactions: "Tổng giao dịch",
      refundRecords: "Lượt hoàn tiền",
      noTransactionHistory: "Chưa có lịch sử giao dịch.",
      bookingNumber: "Đơn đặt #",
      noGroupCode: "Không có mã nhóm",
      membershipPreviewText: "Xem trước cấp độ thành viên, tiến trình thăng hạng và quyền lợi dịch vụ của bạn.",
      preview: "Bản xem trước",
      membershipOverview: "Tổng quan thành viên",
      membershipOverviewText: "Xem trước cấp độ hiện tại, hạng và các quyền lợi sắp mở khóa.",
      upgradeProgress: "Tiến trình nâng hạng",
      progressToNextTier: "Tiến độ đến mốc tiếp theo",
      currentStatus: "Trạng thái hiện tại",
      membershipSnapshot: "Tóm tắt thành viên",
      totalSpent: "Tổng chi tiêu",
      unlockedCoupons: "Mã ưu đãi đã mở",
      levelServices: "Dịch vụ theo cấp độ",
      servicePoliciesByLevel: "Chính sách dịch vụ theo cấp độ",
      nextUnlock: "Mốc kế tiếp",
      nextMilestone: "Mốc thành viên tiếp theo",
      couponsPreviewText: "Xem trước các mã ưu đãi được mở khóa theo hạng hiện tại của bạn.",
      rankCoupons: "Ưu đãi theo hạng",
      couponsByRank: "Mã ưu đãi theo hạng",
      bookingHistory: "Lịch sử đặt phòng",
      bookingHistoryText: "Xem lại các đơn đặt, khoản hoàn tiền và thao tác hủy.",
      groupPrefix: "Nhóm: ",
      missingGroup: "Chưa có",
      cancelBooking: "Hủy đơn đặt",
      refunded: "Đã hoàn: ",
      cancellationFee: "Phí hủy: ",
      room: "Phòng ",
      pricePerNight: "Giá/đêm: ",
      finalAmount: "Thành tiền: ",
      stay: "Thời gian lưu trú",
      actualCheckout: "Ngày trả phòng thực tế",
      status: "Trạng thái",
      defaultAssigned: "Đã xếp phòng",
      cancelThisRoom: "Hủy phòng này",
      noBookingHistory: "Chưa có lịch sử đặt phòng.",
      settingsText: "Quản lý bảo mật tài khoản và cá nhân hóa cách hiển thị của trang hồ sơ.",
      settingsBadge: "Cài đặt",
      customizeExperience: "Tùy chỉnh trải nghiệm của bạn",
      customizeExperienceText: "Điều chỉnh ngôn ngữ và chọn giữa chế độ sáng hoặc tối.",
      language: "Ngôn ngữ",
      languageText: "Chọn ngôn ngữ hiển thị cho phiên hiện tại.",
      english: "Tiếng Anh",
      vietnamese: "Tiếng Việt",
      appearance: "Giao diện",
      appearanceText: "Chuyển đổi giữa giao diện sáng và không gian hồ sơ tối.",
      light: "Sáng",
      dark: "Tối",
      securityBadge: "Bảo mật",
      protectAccount: "Bảo vệ tài khoản của bạn",
      protectAccountText: "Các thao tác về mật khẩu và tùy chọn quan trọng liên quan đến tài khoản.",
      passwordSecurity: "Mật khẩu & bảo mật",
      passwordSecurityText: "Đổi mật khẩu hiện tại và giữ an toàn cho tài khoản của bạn.",
      emailPreferences: "Tùy chọn email",
      emailPreferencesText: "Thông báo xác nhận đặt phòng, cập nhật hoàn tiền và thông tin thành viên đang được bật.",
      enabled: "Đã bật",
      contactPreferences: "Tùy chọn liên hệ",
      contactPreferencesText: "Số điện thoại hiện tại của bạn được dùng để xác thực thanh toán và hỗ trợ đặt phòng.",
      passwordModalBadge: "Bảo mật",
      changePassword: "Đổi mật khẩu",
      changePasswordText: "Sử dụng mật khẩu mạnh gồm chữ cái và số để bảo vệ tài khoản của bạn.",
      currentPassword: "Mật khẩu hiện tại",
      newPassword: "Mật khẩu mới",
      confirmNewPassword: "Xác nhận mật khẩu mới",
      updatePassword: "Cập nhật mật khẩu",
      yourSpendingProgress: "Tiến độ chi tiêu của bạn để đạt mốc thành viên tiếp theo.",
      bookingCancellationPolicy: "Chính sách hủy đặt phòng",
      cancel3Days: "Hủy trước ngày nhận phòng 3 ngày",
      cancel2Days: "Hủy trước ngày nhận phòng 2 ngày",
      cancel1Day: "Hủy trước ngày nhận phòng 1 ngày",
      refund100: "Hoàn 100%",
      refund50: "Hoàn 50%",
      refund0: "Hoàn 0%",
      bookingTotal: "Tổng đơn đặt",
      refund: "Hoàn tiền",
      agreeCancellation: "Tôi đã đọc và đồng ý với chính sách hủy.",
      close: "Đóng",
      confirmCancel: "Xác nhận hủy",
      passwordMismatch: "Mật khẩu xác nhận không khớp!",
      passwordRule: "Mật khẩu phải có ít nhất 8 ký tự và bao gồm cả chữ lẫn số",
      strongPassword: "Mật khẩu mạnh",
      passwordMatch: "Mật khẩu khớp",
      roomCancellationPolicy: "Chính sách hủy phòng",
      roomTotal: "Tổng tiền phòng",
      prepaidRefundNoteRoom: "Hoàn tiền chỉ áp dụng cho phòng đã thanh toán trước. Số tiền trên sẽ được hoàn về ví của bạn.",
      prepaidRefundNoteBooking: "Hoàn tiền chỉ áp dụng cho đơn đặt đã thanh toán trước. Số tiền trên sẽ được hoàn về ví của bạn.",
      payLaterNoteRoom: "Phòng này thanh toán sau, nên sẽ không được hoàn tiền. Phí hủy vẫn được ghi nhận theo chính sách.",
      payLaterNoteBooking: "Đơn đặt này thanh toán sau, nên sẽ không được hoàn tiền. Phí hủy vẫn được ghi nhận theo chính sách.",
      pleaseConfirmCancellation: "Vui lòng xác nhận chính sách hủy trước khi tiếp tục.",
      cancellationFailed: "Hủy không thành công",
      upgradeToLabel: "Chi tiêu thêm {amount} để nâng lên {label}.",
      topTierReached: "Đã đạt hạng cao nhất",
      topTierText: "Bạn đã ở hạng thành viên cao nhất. Hãy tận hưởng toàn bộ đặc quyền cao cấp.",
      highestTier: "Hạng cao nhất",
      memberJourney: "Hành trình thành viên {level}",
      heroMembershipCopy: "Bạn hiện đang ở cấp độ {level} với các quyền lợi hạng {rank} đã được mở cho tài khoản.",
      rankCouponsTitle: "Mã ưu đãi hạng {rank}",
      progressToTier: "Tiến độ đến {level} / {rank}",
      unlockTierCopy: "Chi tiêu thêm {amount} để mở khóa cấp độ {level} và quyền lợi hạng {rank}.",
      previewHighestTier: "Bạn đã mở khóa hạng thành viên cao nhất trong phần xem trước này.",
      nextMilestoneTitle: "Mốc tiếp theo: {level} / {rank}",
      allBenefitsUnlocked: "Đã mở toàn bộ quyền lợi",
      nextMilestoneCopy: "Ở mốc tiếp theo, tài khoản của bạn có thể mở khóa ưu đãi tốt hơn và chính sách dịch vụ cao hơn.",
      noHigherMilestone: "Không còn mốc cao hơn. Bạn đang ở mức cao nhất của phần xem trước.",
      nextBenefitCoupons: "Mã ưu đãi {rank}",
      nextBenefitServices: "Chính sách dịch vụ linh hoạt hơn",
      nextBenefitPriority: "Ưu tiên đặt phòng cao hơn",
    },
  },
  en: {
    title: "My Profile - Gravity Hotel",
    heroTitle: "My Profile",
    heroText: "Manage your account information, wallet, bookings, and preferences.",
    guest: "Guest",
    memberBenefitsTitle: "Member Benefits",
    memberBenefitsText: "Member benefits are active for your account.",
    level: "Level",
    rank: "Rank",
    upgradePlan: "Upgrade Plan",
    panelTitles: {
      overview: "Account",
      profile: "Account > Profile",
      wallet: "Account > Wallet & Transactions",
      membership: "Account > Membership Center",
      coupons: "Account > My Coupons",
      bookings: "Account > Booking & Refunds",
      settings: "Account > General Settings",
      security: "Account > Security",
    },
    labels: {
      notSet: "Not set",
      account: "Account",
      profile: "Profile",
      open: "Open",
      walletTransactions: "Wallet & Transactions",
      walletAvailableSuffix: "VND available",
      transactions: "transactions",
      bookingsRefunds: "Booking & Refunds",
      pending: "pending",
      cancelled: "cancelled",
      bookings: "bookings",
      membershipCenter: "Membership Center",
      membershipCenterText: "View your level, rank, progress, and current service privileges.",
      myCoupons: "My Coupons",
      myCouponsText: "Browse frontend coupon perks currently unlocked by your rank.",
      securitySettings: "Security & Settings",
      securitySettingsShort: "Email, password, and profile preferences",
      generalSettings: "General Settings",
      security: "Security",
      accountDetails: "Account Details",
      accountDetailsText: "Manage personal info & security",
      edit: "Edit",
      name: "Name",
      phone: "Phone",
      gender: "Gender",
      username: "Username",
      role: "Role",
      membership: "Membership",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      walletText: "View your wallet balance, payment codes, and recent activity.",
      walletBalance: "Wallet Balance",
      walletBalanceText: "Tracked only for online payments and refunds in the system.",
      vnpayCode: "VNPay Code",
      momoCode: "MoMo Code",
      unavailable: "N/A",
      totalTransactions: "Total Transactions",
      refundRecords: "Refund Records",
      noTransactionHistory: "No transaction history yet.",
      bookingNumber: "Booking #",
      noGroupCode: "No group code",
      membershipPreviewText: "Frontend preview of your membership level, rank progress, and service privileges.",
      preview: "Frontend Preview",
      membershipOverview: "Membership Overview",
      membershipOverviewText: "Preview your current level, rank, and upcoming benefits.",
      upgradeProgress: "Upgrade Progress",
      progressToNextTier: "Progress to next tier",
      currentStatus: "Current Status",
      membershipSnapshot: "Membership Snapshot",
      totalSpent: "Total Spent",
      unlockedCoupons: "Unlocked Coupons",
      levelServices: "Level Services",
      servicePoliciesByLevel: "Service policies by level",
      nextUnlock: "Next Unlock",
      nextMilestone: "Next membership milestone",
      couponsPreviewText: "Frontend preview of coupon perks unlocked based on your current rank.",
      rankCoupons: "Rank Coupons",
      couponsByRank: "Coupons by rank",
      bookingHistory: "Booking History",
      bookingHistoryText: "Review reservations, refunds, and cancellation actions.",
      groupPrefix: "Group: ",
      missingGroup: "N/A",
      cancelBooking: "Cancel Booking",
      refunded: "Refunded: ",
      cancellationFee: "Cancellation fee: ",
      room: "Room ",
      pricePerNight: "Price/night: ",
      finalAmount: "Final: ",
      stay: "Stay",
      actualCheckout: "Actual Check-out",
      status: "Status",
      defaultAssigned: "ASSIGNED",
      cancelThisRoom: "Cancel This Room",
      noBookingHistory: "No booking history yet.",
      settingsText: "Manage account protection and personalize how this profile page looks and behaves.",
      settingsBadge: "Settings",
      customizeExperience: "Customize your experience",
      customizeExperienceText: "Adjust language and choose between light mode or dark mode.",
      language: "Language",
      languageText: "Choose the display language for your current session.",
      english: "English",
      vietnamese: "Tiếng Việt",
      appearance: "Appearance",
      appearanceText: "Switch between a bright interface and a dark profile workspace.",
      light: "Light",
      dark: "Dark",
      securityBadge: "Security",
      protectAccount: "Protect your account",
      protectAccountText: "Password actions and important account-related preferences.",
      passwordSecurity: "Password & Security",
      passwordSecurityText: "Change your current password and keep your account protected.",
      emailPreferences: "Email Preferences",
      emailPreferencesText: "Booking confirmations, refund updates, and membership notices are enabled.",
      enabled: "Enabled",
      contactPreferences: "Contact Preferences",
      contactPreferencesText: "Your current phone number is used for payment verification and booking support.",
      passwordModalBadge: "Security",
      changePassword: "Change Password",
      changePasswordText: "Use a strong password with letters and numbers to keep your account protected.",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      updatePassword: "Update Password",
      yourSpendingProgress: "Your spending progress toward the next membership tier.",
      bookingCancellationPolicy: "Booking Cancellation Policy",
      cancel3Days: "Cancel 3 days before check-in",
      cancel2Days: "Cancel 2 days before check-in",
      cancel1Day: "Cancel 1 day before check-in",
      refund100: "100% refund",
      refund50: "50% refund",
      refund0: "0% refund",
      bookingTotal: "Booking total",
      refund: "Refund",
      agreeCancellation: "I have read and agree with the cancellation policy.",
      close: "Close",
      confirmCancel: "Confirm Cancel",
      passwordMismatch: "Passwords do not match!",
      passwordRule: "Password must be at least 8 characters and include letters + numbers",
      strongPassword: "Strong password",
      passwordMatch: "Passwords match",
      roomCancellationPolicy: "Room Cancellation Policy",
      roomTotal: "Room total",
      prepaidRefundNoteRoom: "Refund only applies to prepaid rooms. The amount above will be credited back to your wallet.",
      prepaidRefundNoteBooking: "Refund only applies to prepaid bookings. The amount above will be credited back to your wallet.",
      payLaterNoteRoom: "This room is pay-later, so no refund will be credited. Cancellation fee is still recorded based on policy.",
      payLaterNoteBooking: "This booking is pay-later, so no refund will be credited. Cancellation fee is still recorded based on policy.",
      pleaseConfirmCancellation: "Please confirm the cancellation policy before continuing.",
      cancellationFailed: "Cancellation failed",
      upgradeToLabel: "Spend {amount} more to upgrade to {label}.",
      topTierReached: "Top tier reached",
      topTierText: "You are already at the highest membership tier. Enjoy all premium privileges.",
      highestTier: "Top tier",
      memberJourney: "{level} member journey",
      heroMembershipCopy: "You are currently in {level} level with {rank} rank perks unlocked for your account.",
      rankCouponsTitle: "{rank} rank coupons",
      progressToTier: "Progress to {level} / {rank}",
      unlockTierCopy: "Spend {amount} more to unlock {level} level and {rank} rank benefits.",
      previewHighestTier: "You already unlocked the highest membership tier in this frontend preview.",
      nextMilestoneTitle: "Next milestone: {level} / {rank}",
      allBenefitsUnlocked: "All milestone benefits unlocked",
      nextMilestoneCopy: "At the next milestone, your account can unlock stronger coupons and upgraded service handling policies.",
      noHigherMilestone: "No higher milestone remains. You are already at the top of the preview ladder.",
      nextBenefitCoupons: "{rank} coupons",
      nextBenefitServices: "More flexible service policies",
      nextBenefitPriority: "Higher booking priority",
    },
  },
};

const COPY = PROFILE_TEXT[PROFILE_LOCALE];
const T = COPY.labels;
const panelTitles = COPY.panelTitles;

const RANK_COUPON_CATALOG = isVietnamese
  ? {
      normal: [
        { value: "5%", name: "Ưu đãi chào mừng", code: "NORMAL05", meta: "Giảm 5% giá phòng cho các đơn đặt vào ngày trong tuần." },
        { value: "10%", name: "Phiếu cafe", code: "CAFE10", meta: "Giảm 10% đồ uống và bánh ngọt tại quán cafe của khách sạn." },
      ],
      vip: [
        { value: "10%", name: "Kỳ nghỉ đặc quyền", code: "VIP10", meta: "Giảm 10% khi đặt phòng cao cấp và nâng hạng suite." },
        { value: "15%", name: "Ưu đãi spa", code: "SPA15", meta: "Giảm 15% dịch vụ spa và chăm sóc sức khỏe trong thời gian lưu trú." },
        { value: "20%", name: "Ưu đãi ẩm thực", code: "DINE20", meta: "Giảm 20% cho một hóa đơn ăn uống nội khu trong mỗi đơn đặt." },
      ],
      vvip: [
        { value: "15%", name: "Kỳ nghỉ tinh hoa", code: "VVIP15", meta: "Giảm 15% cho các đơn đặt trực tiếp ở mọi hạng phòng." },
        { value: "25%", name: "Phòng chờ riêng", code: "LOUNGE25", meta: "Giảm 25% cho executive lounge và gói trà chiều." },
        { value: "30%", name: "Quà tặng kỷ niệm", code: "GIFT30", meta: "Giảm 30% cho một số gói trang trí dịp đặc biệt và quà trong phòng." },
      ],
    }
  : {
      normal: [
        { value: "5%", name: "Welcome Saver", code: "NORMAL05", meta: "5% off room rate on weekday bookings." },
        { value: "10%", name: "Cafe Voucher", code: "CAFE10", meta: "10% off drinks and pastries at the hotel cafe." },
      ],
      vip: [
        { value: "10%", name: "Signature Stay", code: "VIP10", meta: "10% off premium room bookings and suite upgrades." },
        { value: "15%", name: "Spa Credit", code: "SPA15", meta: "15% off spa and wellness treatments during your stay." },
        { value: "20%", name: "Dining Select", code: "DINE20", meta: "20% off one in-house dining bill per booking." },
      ],
      vvip: [
        { value: "15%", name: "Elite Escape", code: "VVIP15", meta: "15% off direct bookings across all room categories." },
        { value: "25%", name: "Private Lounge", code: "LOUNGE25", meta: "25% off executive lounge and afternoon tea packages." },
        { value: "30%", name: "Celebration Gift", code: "GIFT30", meta: "30% off selected occasion setup and in-room gifts." },
      ],
    };

const LEVEL_SERVICE_POLICY_CATALOG = isVietnamese
  ? {
      bronze: {
        title: "Chính sách dịch vụ hạng Đồng",
        description: "Quyền lợi cơ bản giúp trải nghiệm đặt phòng và nhận phòng thuận tiện hơn.",
        benefits: ["Hỗ trợ đặt phòng ưu tiên", "Thông báo khuyến mãi sớm", "Ưu đãi sinh nhật cơ bản"],
      },
      silver: {
        title: "Chính sách dịch vụ hạng Bạc",
        description: "Dịch vụ linh hoạt hơn cho khách quay lại với nhiều tiện lợi hơn trong kỳ lưu trú.",
        benefits: ["Ưu tiên trả phòng muộn", "Linh hoạt ghi chú sở thích phòng", "Hỗ trợ phản hồi nhanh hơn"],
      },
      gold: {
        title: "Chính sách dịch vụ hạng Vàng",
        description: "Dịch vụ cao cấp với mức độ cá nhân hóa và linh hoạt cao hơn khi lưu trú.",
        benefits: ["Ưu tiên sắp xếp phòng", "Quà chào mừng miễn phí", "Ưu tiên hỗ trợ xử lý sự cố"],
      },
      platinum: {
        title: "Chính sách dịch vụ hạng Bạch kim",
        description: "Dịch vụ cao nhất với mức ưu tiên hàng đầu ở mọi điểm chạm hỗ trợ khách hàng.",
        benefits: ["Mức ưu tiên hỗ trợ cao nhất", "Ưu tiên xét nâng hạng phòng", "Hỗ trợ nhận phòng cao cấp riêng"],
      },
    }
  : {
      bronze: {
        title: "Bronze service policies",
        description: "Entry member benefits for a smoother booking and check-in experience.",
        benefits: ["Priority booking support", "Early promotion alerts", "Basic birthday offer"],
      },
      silver: {
        title: "Silver service policies",
        description: "More flexible services for returning guests with better convenience during the stay.",
        benefits: ["Late check-out priority", "Flexible room preference note", "Faster support response"],
      },
      gold: {
        title: "Gold service policies",
        description: "Premium service handling with more personalized support and stay flexibility.",
        benefits: ["Priority room assignment", "Complimentary welcome amenity", "Service recovery priority"],
      },
      platinum: {
        title: "Platinum service policies",
        description: "Top-tier service treatment with the highest priority across guest support touchpoints.",
        benefits: ["Highest support priority", "Preferred upgrade consideration", "Dedicated premium check-in handling"],
      },
    };

const MEMBERSHIP_TIER_FLOW = isVietnamese
  ? {
      bronze: { baseline: 0, target: 50000000, nextLevel: "Bạc", nextRank: "VIP" },
      silver: { baseline: 50000000, target: 100000000, nextLevel: "Vàng", nextRank: "VIP" },
      gold: { baseline: 100000000, target: 200000000, nextLevel: "Bạch kim", nextRank: "VVIP" },
      platinum: { baseline: 200000000, target: 200000000, nextLevel: null, nextRank: null },
    }
  : {
      bronze: { baseline: 0, target: 50000000, nextLevel: "Silver", nextRank: "VIP" },
      silver: { baseline: 50000000, target: 100000000, nextLevel: "Gold", nextRank: "VIP" },
      gold: { baseline: 100000000, target: 200000000, nextLevel: "Platinum", nextRank: "VVIP" },
      platinum: { baseline: 200000000, target: 200000000, nextLevel: null, nextRank: null },
    };

const HISTORY_ROOM_IMAGE_CATALOG = {
  standard: {
    single: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800",
    double: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    twin: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  superior: {
    single: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    double: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    twin: "https://www.royalgardenhotel.co.uk/_img/videos/deluxe-twin.png",
    triple: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  deluxe: {
    double: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    twin: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    family: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  executive: {
    double: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    twin: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  suite: {
    double: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    family: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  },
};

function applyHistoryRoomImages() {
  document.querySelectorAll(".history-detail-image img[data-rank][data-type]").forEach((img) => {
    const rank = String(img.dataset.rank || "").toLowerCase();
    const type = String(img.dataset.type || "").toLowerCase();
    const imageUrl = HISTORY_ROOM_IMAGE_CATALOG?.[rank]?.[type];

    if (imageUrl) {
      img.src = imageUrl;
      img.alt = `${translateRank(rank)} ${type}`;
    }
  });
}

function translateLevel(value) {
  return LEVEL_LABELS[PROFILE_LOCALE][String(value || "").toLowerCase()] || String(value || "");
}

function translateRank(value) {
  return RANK_LABELS[PROFILE_LOCALE][String(value || "").toLowerCase()] || String(value || "");
}

function translateRole(value) {
  return ROLE_LABELS[PROFILE_LOCALE][String(value || "").toLowerCase()] || String(value || "");
}

function translateGender(value) {
  return GENDER_LABELS[PROFILE_LOCALE][String(value || "").toLowerCase()] || String(value || "");
}

function translateStatus(value) {
  return STATUS_LABELS[PROFILE_LOCALE][String(value || "").toLowerCase()] || String(value || "");
}

function fillTemplate(template, values = {}) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = text;
  }
}

function setAllText(selector, text) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = text;
  });
}

function applyStaticTranslations() {
  document.title = COPY.title;
  setText(".profile-hero .title-anim", COPY.heroTitle);
  setText(".profile-hero p", COPY.heroText);
  setText("#memberBenefitTitle", COPY.memberBenefitsTitle);
  setText("#memberBenefitText", COPY.memberBenefitsText);
  setText("#memberLevelLabel", COPY.level);
  setText("#memberRankLabel", COPY.rank);
  setText("#upgradePlanBtn", COPY.upgradePlan);
  setText('[data-tab-target="profile"] h3', T.profile);
  setText('[data-tab-target="profile"] p', ""); 
  const profileCard = document.querySelector('[data-tab-target="profile"]');
  if (profileCard) {
    profileCard.querySelector("h3").textContent = T.profile;
    profileCard.querySelector("p").textContent = isVietnamese
      ? "Mở thông tin cá nhân, thành viên và tổng quan tài khoản của bạn."
      : "Open your personal details, membership, and account overview.";
    profileCard.querySelector(".account-nav-card__meta").textContent = T.open;
  }

  const walletCard = document.querySelector('[data-tab-target="wallet"]');
  if (walletCard) {
    walletCard.querySelector("h3").textContent = T.walletTransactions;
    const amountText = walletCard.querySelector("p")?.textContent || "";
    const amountMatch = amountText.match(/[\d.,]+/);
    walletCard.querySelector("p").textContent = `${amountMatch ? amountMatch[0] : "0"} ${T.walletAvailableSuffix}`;
    const metaNumber = walletCard.querySelector(".account-nav-card__meta")?.textContent?.match(/\d+/)?.[0] || "0";
    walletCard.querySelector(".account-nav-card__meta").textContent = `${metaNumber} ${T.transactions}`;
  }

  const bookingCard = document.querySelector('[data-tab-target="bookings"]');
  if (bookingCard) {
    bookingCard.querySelector("h3").textContent = T.bookingsRefunds;
    const counts = bookingCard.querySelector("p")?.textContent?.match(/\d+/g) || ["0", "0"];
    bookingCard.querySelector("p").textContent = `${counts[0] || "0"} ${T.pending} · ${counts[1] || "0"} ${T.cancelled}`;
    const metaNumber = bookingCard.querySelector(".account-nav-card__meta")?.textContent?.match(/\d+/)?.[0] || "0";
    bookingCard.querySelector(".account-nav-card__meta").textContent = `${metaNumber} ${T.bookings}`;
  }

  const membershipCard = document.querySelector('[data-tab-target="membership"]');
  if (membershipCard) {
    membershipCard.querySelector("h3").textContent = T.membershipCenter;
    membershipCard.querySelector("p").textContent = T.membershipCenterText;
    membershipCard.querySelector(".account-nav-card__meta").textContent = T.open;
  }

  const couponsCard = document.querySelector('[data-tab-target="coupons"]');
  if (couponsCard) {
    couponsCard.querySelector("h3").textContent = T.myCoupons;
    couponsCard.querySelector("p").textContent = T.myCouponsText;
    couponsCard.querySelector(".account-nav-card__meta").textContent = T.open;
  }

  setText(".settings-summary-copy h3", T.securitySettings);
  setText(".settings-summary-copy p", T.securitySettingsShort);
  const settingsButtons = document.querySelectorAll(".settings-link-card span");
  if (settingsButtons[0]) settingsButtons[0].textContent = T.generalSettings;
  if (settingsButtons[1]) settingsButtons[1].textContent = T.security;

  setText('[data-panel="profile"] .panel-header h3', T.accountDetails);
  setText('[data-panel="profile"] .panel-header p', T.accountDetailsText);
  setText("#editBtn", T.edit);
  setText("#saveBtn", T.saveChanges);
  setText("#cancelEditBtn", T.cancel);

  document.querySelectorAll(".profile-table .row").forEach((row, index) => {
    const labels = [T.name, "Email", T.phone, T.gender, T.username, T.role, T.membership];
    if (labels[index]) {
      row.firstElementChild.textContent = labels[index];
    }
  });

  setText('[data-panel="wallet"] .panel-header h3', T.walletTransactions);
  setText('[data-panel="wallet"] .panel-header p', T.walletText);
  const walletStatLabels = document.querySelectorAll('[data-panel="wallet"] .info-stat-card__label');
  if (walletStatLabels[0]) walletStatLabels[0].textContent = T.walletBalance;
  if (walletStatLabels[1]) walletStatLabels[1].textContent = T.vnpayCode;
  if (walletStatLabels[2]) walletStatLabels[2].textContent = T.momoCode;
  if (walletStatLabels[3]) walletStatLabels[3].textContent = T.totalTransactions;
  if (walletStatLabels[4]) walletStatLabels[4].textContent = T.refundRecords;
  const walletCardWide = document.querySelector('[data-panel="wallet"] .info-stat-card--wide p');
  if (walletCardWide) walletCardWide.textContent = T.walletBalanceText;
  setText('[data-panel="wallet"] .empty-state-box', T.noTransactionHistory);

  document.querySelectorAll('[data-panel="wallet"] .compact-history-item').forEach((item) => {
    const title = item.querySelector("h4");
    const id = title?.textContent?.match(/\d+/)?.[0] || "0";
    if (title) title.textContent = `${T.bookingNumber}${id}`;
    const code = item.querySelector("p");
    if (code && code.textContent.trim() === "Không có mã nhóm") {
      code.textContent = T.noGroupCode;
    }
  });

  setText('[data-panel="membership"] .panel-header h3', T.membershipCenter);
  setText('[data-panel="membership"] .panel-header p', T.membershipPreviewText);
  setText(".profile-privileges-label", document.querySelector('[data-panel="membership"] .profile-privileges-label') ? T.preview : document.querySelector(".profile-privileges-label")?.textContent);
  const privilegeLabels = document.querySelectorAll('[data-panel="membership"] .profile-privileges-label');
  if (privilegeLabels[0]) privilegeLabels[0].textContent = T.preview;
  if (privilegeLabels[1]) privilegeLabels[1].textContent = T.levelServices;
  setText("#membershipHeroTitle", T.membershipOverview);
  setText("#membershipHeroText", T.membershipOverviewText);
  setText('[data-panel="membership"] .privilege-kicker', T.upgradeProgress);
  const membershipKickers = document.querySelectorAll('[data-panel="membership"] .privilege-kicker');
  if (membershipKickers[0]) membershipKickers[0].textContent = T.upgradeProgress;
  if (membershipKickers[1]) membershipKickers[1].textContent = T.currentStatus;
  if (membershipKickers[2]) membershipKickers[2].textContent = T.nextUnlock;
  const membershipStrongs = document.querySelectorAll('[data-panel="membership"] .privilege-title-row strong');
  if (membershipStrongs[0]) membershipStrongs[0].textContent = T.progressToNextTier;
  if (membershipStrongs[1]) membershipStrongs[1].textContent = T.membershipSnapshot;
  const statLabels = document.querySelectorAll('[data-panel="membership"] .membership-stat-box label');
  if (statLabels[0]) statLabels[0].textContent = T.level;
  if (statLabels[1]) statLabels[1].textContent = T.rank;
  if (statLabels[2]) statLabels[2].textContent = T.totalSpent;
  if (statLabels[3]) statLabels[3].textContent = T.unlockedCoupons;
  setText("#levelPrivilegeTitle", T.servicePoliciesByLevel);
  setText("#membershipNextTitle", T.nextMilestone);

  setText('[data-panel="coupons"] .panel-header h3', T.myCoupons);
  setText('[data-panel="coupons"] .panel-header p', T.couponsPreviewText);
  const couponsPrivilegeLabel = document.querySelector('[data-panel="coupons"] .profile-privileges-label');
  if (couponsPrivilegeLabel) couponsPrivilegeLabel.textContent = T.rankCoupons;
  setText("#rankPrivilegeTitle", T.couponsByRank);

  setText('[data-panel="bookings"] .panel-header h3', T.bookingHistory);
  setText('[data-panel="bookings"] .panel-header p', T.bookingHistoryText);
  setText('[data-panel="bookings"] .empty-state-box', T.noBookingHistory);
  document.querySelectorAll('[data-panel="bookings"] .history-booking-card, #historyModal .history-booking-card').forEach((card) => {
    const title = card.querySelector(".history-booking-header h4");
    const bookingId = title?.textContent?.match(/\d+/)?.[0] || "0";
    if (title) title.textContent = `${T.bookingNumber}${bookingId}`;
    const group = card.querySelector(".history-booking-header p");
    const currentGroup = group?.textContent?.split(":").slice(1).join(":").trim() || T.missingGroup;
    if (group) group.textContent = `${T.groupPrefix}${currentGroup}`;
    card.querySelectorAll(".booking-cancel-btn").forEach((button) => {
      button.textContent = button.dataset.targetType === "detail" ? T.cancelThisRoom : T.cancelBooking;
    });
    card.querySelectorAll(".history-booking-finance span").forEach((span) => {
      if (span.textContent.includes(":")) {
        const [label, amount] = span.textContent.split(":");
        span.textContent = `${label.toLowerCase().includes("refund") || label.toLowerCase().includes("hoàn") ? T.refunded : T.cancellationFee}${amount.trim()}`;
      }
    });
    card.querySelectorAll(".history-detail-room").forEach((roomEl) => {
      const num = roomEl.textContent.match(/\d+/)?.[0] || "";
      roomEl.textContent = `${T.room}${num}`;
    });
    card.querySelectorAll(".history-detail-meta").forEach((meta) => {
      const spans = meta.querySelectorAll("span");
      const firstAmount = spans[0]?.textContent?.match(/[\d.,]+.*VND|[\d.,]+/i)?.[0] || "0 VND";
      const secondAmount = spans[1]?.textContent?.match(/[\d.,]+.*VND|[\d.,]+/i)?.[0] || "0 VND";
      if (spans[0]) spans[0].textContent = `${T.pricePerNight}${firstAmount}`;
      if (spans[1]) spans[1].textContent = `${T.finalAmount}${secondAmount}`;
    });
    card.querySelectorAll(".history-detail-dates").forEach((dates) => {
      const labels = dates.querySelectorAll("label");
      if (labels[0]) labels[0].textContent = T.stay;
      if (labels[1]) labels[1].textContent = T.actualCheckout;
      if (labels[2]) labels[2].textContent = T.status;
      const statusStrong = labels[2]?.nextElementSibling;
      if (statusStrong && statusStrong.textContent === "ĐÃ XẾP PHÒNG") {
        statusStrong.textContent = T.defaultAssigned;
      }
    });
  });

  setText('[data-panel="settings"] .panel-header h3', T.securitySettings);
  setText('[data-panel="settings"] .panel-header p', T.settingsText);
  const settingsCard = document.querySelector('[data-panel="settings"] .settings-detail-card');
  if (settingsCard) {
    settingsCard.querySelector(".settings-badge").textContent = T.settingsBadge;
    settingsCard.querySelector("h4").textContent = T.customizeExperience;
    settingsCard.querySelector(":scope > p").textContent = T.customizeExperienceText;
    const optionBoxes = settingsCard.querySelectorAll(".settings-option-box");
    if (optionBoxes[0]) {
      optionBoxes[0].querySelector("h5").textContent = T.language;
      optionBoxes[0].querySelector("p").textContent = T.languageText;
      const langButtons = optionBoxes[0].querySelectorAll(".settings-pill span:last-child");
      if (langButtons[0]) langButtons[0].textContent = T.english;
      if (langButtons[1]) langButtons[1].textContent = T.vietnamese;
    }
    if (optionBoxes[1]) {
      optionBoxes[1].querySelector("h5").textContent = T.appearance;
      optionBoxes[1].querySelector("p").textContent = T.appearanceText;
      const themePills = optionBoxes[1].querySelectorAll(".settings-pill");
      if (themePills[0]) themePills[0].textContent = T.light;
      if (themePills[1]) themePills[1].textContent = T.dark;
    }
  }

  setText('[data-panel="security"] .panel-header h3', T.securitySettings);
  setText('[data-panel="security"] .panel-header p', T.settingsText);
  const securityCard = document.querySelector('[data-panel="security"] .settings-detail-card');
  if (securityCard) {
    securityCard.querySelector(".settings-badge").textContent = T.securityBadge;
    securityCard.querySelector("h4").textContent = T.protectAccount;
    securityCard.querySelector(":scope > p").textContent = T.protectAccountText;
    const rows = securityCard.querySelectorAll(".security-row-card");
    if (rows[0]) {
      rows[0].querySelector("h5").textContent = T.passwordSecurity;
      rows[0].querySelector("p").textContent = T.passwordSecurityText;
      rows[0].querySelector("span").textContent = T.open;
    }
    if (rows[1]) {
      rows[1].querySelector("h5").textContent = T.emailPreferences;
      rows[1].querySelector("p").textContent = T.emailPreferencesText;
      rows[1].querySelector("span").textContent = T.enabled;
    }
    if (rows[2]) {
      rows[2].querySelector("h5").textContent = T.contactPreferences;
      rows[2].querySelector("p").textContent = T.contactPreferencesText;
    }
  }

  const passwordModal = document.getElementById("changePasswordModal");
  if (passwordModal) {
    passwordModal.querySelector(".profile-password-badge").textContent = T.passwordModalBadge;
    passwordModal.querySelector("h3").textContent = T.changePassword;
    passwordModal.querySelector(".profile-password-head p").textContent = T.changePasswordText;
    document.getElementById("currentPassword").placeholder = T.currentPassword;
    document.getElementById("newPassword").placeholder = T.newPassword;
    document.getElementById("confirmPassword").placeholder = T.confirmNewPassword;
    passwordModal.querySelector(".profile-password-submit").textContent = T.updatePassword;
  }

  setText("#historyModal h3", T.bookingHistory);
  setText("#upgradePlanModal h3", T.upgradeProgress);
  setText("#upgradePlanText", T.yourSpendingProgress);
  setText(".upgrade-amount-row span", T.totalSpent);
  setText("#cancelBookingTitle", T.bookingCancellationPolicy);
  const policyItems = document.querySelectorAll(".cancel-policy-item");
  if (policyItems[0]) {
    policyItems[0].querySelector("span").textContent = T.cancel3Days;
    policyItems[0].querySelector("strong").textContent = T.refund100;
  }
  if (policyItems[1]) {
    policyItems[1].querySelector("span").textContent = T.cancel2Days;
    policyItems[1].querySelector("strong").textContent = T.refund50;
  }
  if (policyItems[2]) {
    policyItems[2].querySelector("span").textContent = T.cancel1Day;
    policyItems[2].querySelector("strong").textContent = T.refund0;
  }
  setText("#cancelBookingAmountLabel", T.bookingTotal);
  const cancelRows = document.querySelectorAll(".cancel-preview-row span");
  if (cancelRows[1]) cancelRows[1].textContent = T.refund;
  if (cancelRows[2]) cancelRows[2].textContent = T.cancellationFee.replace(": ", "");
  setText(".cancel-confirm-box span", T.agreeCancellation);
  setText("#cancelBookingDismiss", T.close);
  setText("#confirmCancelBooking", T.confirmCancel);

  document.querySelectorAll(".profile-chip, .upgrade-tier-badge, #membershipHeroBadge").forEach((element) => {
    const text = String(element.textContent || "").trim();
    if (!text.includes("/")) {
      return;
    }
    const [level, rank] = text.split("/").map((item) => item.trim());
    element.textContent = `${translateLevel(level)} / ${translateRank(rank)}`;
  });

  document.querySelectorAll(".tier-stat-card.level-card span").forEach((element) => {
    element.textContent = translateLevel(element.textContent);
  });

  document.querySelectorAll(".tier-stat-card.rank-card span").forEach((element) => {
    element.textContent = translateRank(element.textContent);
  });

  document.querySelectorAll(".profile-table .row").forEach((row) => {
    const label = row.firstElementChild?.textContent?.trim();
    const valueNode = row.lastElementChild;
    const valueSpan = valueNode?.querySelector(".view-mode") || valueNode;
    if (!valueSpan) {
      return;
    }

    const currentText = String(valueSpan.textContent || "").trim();
    if (label === T.gender) {
      valueSpan.textContent = currentText === T.notSet ? currentText : translateGender(currentText);
    } else if (label === T.role) {
      valueSpan.textContent = translateRole(currentText);
    } else if (label === T.membership && currentText.includes("/")) {
      const [level, rank] = currentText.split("/").map((item) => item.trim());
      valueSpan.textContent = `${translateLevel(level)} / ${translateRank(rank)}`;
    }
  });

  document.querySelectorAll(".history-status").forEach((element) => {
    element.textContent = translateStatus(element.textContent);
  });

  document.querySelectorAll(".history-detail-dates strong").forEach((element) => {
    const previousLabel = element.previousElementSibling?.textContent?.trim();
    if (previousLabel === T.status) {
      element.textContent = translateStatus(element.textContent);
    }
  });
}

function renderMembershipPrivileges() {
  if (!membershipMeta || !rankCouponList || !levelServicePolicyList) {
    return;
  }

  const customerRank = String(membershipMeta.dataset.customerRank || "Normal").toLowerCase();
  const memberLevel = String(membershipMeta.dataset.memberLevel || "Bronze").toLowerCase();
  const totalSpent = Number(document.querySelector(".upgrade-plan-summary")?.dataset.totalSpent || 0);

  const coupons = RANK_COUPON_CATALOG[customerRank] || RANK_COUPON_CATALOG.normal;
  const servicePolicy = LEVEL_SERVICE_POLICY_CATALOG[memberLevel] || LEVEL_SERVICE_POLICY_CATALOG.bronze;
  const tierFlow = MEMBERSHIP_TIER_FLOW[memberLevel] || MEMBERSHIP_TIER_FLOW.bronze;

  if (rankPrivilegeTitle) {
    rankPrivilegeTitle.textContent = fillTemplate(T.rankCouponsTitle, {
      rank: translateRank(customerRank),
    });
  }

  if (levelPrivilegeTitle) {
    levelPrivilegeTitle.textContent = servicePolicy.title;
  }

  rankCouponList.innerHTML = coupons
    .map(
      (coupon) => `
        <article class="coupon-card">
          <div class="coupon-card__top">
            <div>
              <div class="coupon-card__value">${escapeHtml(coupon.value)}</div>
              <div class="coupon-card__name">${escapeHtml(coupon.name)}</div>
            </div>
            <span class="coupon-card__code">${escapeHtml(coupon.code)}</span>
          </div>
          <div class="coupon-card__meta">${escapeHtml(coupon.meta)}</div>
        </article>
      `,
    )
    .join("");

  levelServicePolicyList.innerHTML = `
    <article class="service-policy-card">
      <div class="service-policy-card__top">
        <div>
          <div class="service-policy-card__badge">${escapeHtml(translateLevel(memberLevel))}</div>
          <div class="service-policy-card__name">${escapeHtml(servicePolicy.title)}</div>
        </div>
      </div>
      <div class="service-policy-card__desc">${escapeHtml(servicePolicy.description)}</div>
      <div class="service-policy-card__benefits">
        ${servicePolicy.benefits
          .map((benefit) => `<span class="service-policy-pill"><i class="fas fa-check"></i>${escapeHtml(benefit)}</span>`)
          .join("")}
      </div>
    </article>
  `;

  renderMembershipCenter({
    customerRank,
    memberLevel,
    totalSpent,
    coupons,
    servicePolicy,
    tierFlow,
  });
}

function renderMembershipCenter({ customerRank, memberLevel, totalSpent, coupons, servicePolicy, tierFlow }) {
  if (membershipHeroBadge) {
    membershipHeroBadge.textContent = `${translateLevel(memberLevel)} / ${translateRank(customerRank)}`;
  }

  if (membershipHeroTitle) {
    membershipHeroTitle.textContent = fillTemplate(T.memberJourney, {
      level: translateLevel(memberLevel),
    });
  }

  if (membershipHeroText) {
    membershipHeroText.textContent = fillTemplate(T.heroMembershipCopy, {
      level: translateLevel(memberLevel),
      rank: translateRank(customerRank),
    });
  }

  if (membershipLevelValue) {
    membershipLevelValue.textContent = translateLevel(memberLevel);
  }

  if (membershipRankValue) {
    membershipRankValue.textContent = translateRank(customerRank);
  }

  if (membershipSpentValue) {
    membershipSpentValue.textContent = formatMoney(totalSpent);
  }

  if (membershipCouponCount) {
    membershipCouponCount.textContent = String(coupons.length);
  }

  if (membershipProgressTitle) {
    membershipProgressTitle.textContent = tierFlow.nextLevel
      ? fillTemplate(T.progressToTier, { level: tierFlow.nextLevel, rank: tierFlow.nextRank })
      : T.topTierReached;
  }

  const progress = tierFlow.target === tierFlow.baseline
    ? 100
    : Math.max(0, Math.min(100, ((totalSpent - tierFlow.baseline) / (tierFlow.target - tierFlow.baseline)) * 100));

  if (membershipProgressFill) {
    membershipProgressFill.style.width = `${progress}%`;
  }

  if (membershipProgressCurrent) {
    membershipProgressCurrent.textContent = formatMoney(totalSpent);
  }

  if (membershipProgressTarget) {
    membershipProgressTarget.textContent = tierFlow.nextLevel ? formatMoney(tierFlow.target) : T.highestTier;
  }

  if (membershipProgressCopy) {
    membershipProgressCopy.textContent = tierFlow.nextLevel
      ? fillTemplate(T.unlockTierCopy, {
          amount: formatMoney(Math.max(0, tierFlow.target - totalSpent)),
          level: tierFlow.nextLevel,
          rank: tierFlow.nextRank,
        })
      : T.previewHighestTier;
  }

  if (membershipNextTitle) {
    membershipNextTitle.textContent = tierFlow.nextLevel
      ? fillTemplate(T.nextMilestoneTitle, { level: tierFlow.nextLevel, rank: tierFlow.nextRank })
      : T.allBenefitsUnlocked;
  }

  if (membershipNextCopy) {
    membershipNextCopy.textContent = tierFlow.nextLevel
      ? T.nextMilestoneCopy
      : T.noHigherMilestone;
  }

  if (membershipNextPills) {
    const nextBenefits = tierFlow.nextLevel
      ? [
          fillTemplate(T.nextBenefitCoupons, { rank: tierFlow.nextRank }),
          T.nextBenefitServices,
          T.nextBenefitPriority,
        ]
      : [...servicePolicy.benefits];

    membershipNextPills.innerHTML = nextBenefits
      .map((benefit) => `<span class="membership-next-pill"><i class="fas fa-star"></i>${escapeHtml(benefit)}</span>`)
      .join("");
  }
}

function capitalize(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function activatePanel(panelName) {
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === panelName);
  });

  if (breadcrumb) {
    breadcrumb.textContent = panelTitles[panelName] || panelTitles.overview;
    breadcrumb.classList.toggle("is-link", panelName !== "overview");
  }

  if (panelName === "bookings") {
    applyHistoryRoomImages();
  }

  const url = new URL(window.location.href);
  url.searchParams.set("panel", panelName);
  window.history.replaceState({}, "", url.toString());
}

if (tabButtons.length) {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activatePanel(button.dataset.tabTarget || "overview");
    });
  });
}

if (breadcrumb) {
  breadcrumb.addEventListener("click", () => {
    if (breadcrumb.classList.contains("is-link")) {
      activatePanel("overview");
    }
  });
}

function resetEditMode() {
  document.querySelectorAll(".view-mode").forEach((el) => {
    el.style.display = "";
  });

  document.querySelectorAll(".edit-mode").forEach((el) => {
    el.hidden = true;
    el.style.display = "none";
  });

  if (profileEditForm) {
    profileEditForm.reset();
  }

  if (editBtn) {
    editBtn.style.display = "inline-flex";
  }

  if (saveBtn) {
    saveBtn.hidden = true;
    saveBtn.style.display = "none";
  }

  if (cancelEditBtn) {
    cancelEditBtn.hidden = true;
    cancelEditBtn.style.display = "none";
  }
}

if (editBtn && saveBtn && cancelEditBtn) {
  editBtn.addEventListener("click", () => {
    document.querySelectorAll(".view-mode").forEach((el) => {
      el.style.display = "none";
    });

    document.querySelectorAll(".edit-mode").forEach((el) => {
      el.hidden = false;
      el.style.display = "inline-block";
    });

    editBtn.style.display = "none";
    saveBtn.hidden = false;
    saveBtn.style.display = "inline-flex";
    cancelEditBtn.hidden = false;
    cancelEditBtn.style.display = "inline-flex";
  });

  cancelEditBtn.addEventListener("click", resetEditMode);
}

const modal = document.getElementById("changePasswordModal");
const openBtn = document.getElementById("ChangePasswordBtn");
const securityPasswordBtn = document.getElementById("securityPasswordBtn");
const closeBtn = document.getElementById("closeModal");

function openPasswordModal() {
  if (modal) {
    modal.style.display = "block";
  }
}

if (openBtn) {
  openBtn.addEventListener("click", openPasswordModal);
}

if (securityPasswordBtn) {
  securityPasswordBtn.addEventListener("click", openPasswordModal);
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

function submitChangePassword() {
  const current = document.getElementById("currentPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (newPass !== confirm) {
    alert(T.passwordMismatch);
    return;
  }

  fetch("/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      currentPassword: current,
      newPassword: newPass,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      }
      return res.text();
    })
    .then((msg) => {
      alert(msg);
      document.getElementById("changePasswordModal").style.display = "none";
    })
    .catch((err) => {
      alert(err.message);
    });
}

window.submitChangePassword = submitChangePassword;

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const passwordHint = document.getElementById("passwordHint");
const confirmHint = document.getElementById("confirmHint");

function validatePassword(pw) {
  const hasLength = pw.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  return hasLength && hasLetter && hasNumber;
}

if (newPassword && passwordHint) {
  newPassword.addEventListener("input", () => {
    const pw = newPassword.value;

    if (!pw) {
      passwordHint.innerText = "";
      return;
    }

    if (!validatePassword(pw)) {
      passwordHint.innerText = T.passwordRule;
      passwordHint.className = "hint error";
    } else {
      passwordHint.innerText = T.strongPassword;
      passwordHint.className = "hint success";
    }
  });
}

if (confirmPassword && confirmHint) {
  confirmPassword.addEventListener("input", () => {
    if (!confirmPassword.value) {
      confirmHint.innerText = "";
      return;
    }

    if (confirmPassword.value !== newPassword.value) {
      confirmHint.innerText = T.passwordMismatch.replace("!", "");
      confirmHint.className = "hint error";
    } else {
      confirmHint.innerText = T.passwordMatch;
      confirmHint.className = "hint success";
    }
  });
}

document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const inputId = icon.getAttribute("data-target");
    const input = document.getElementById(inputId);

    if (!input) {
      return;
    }

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

const avatarBtn = document.getElementById("openAvatarModal");
const avatarModal = document.getElementById("avatarModal");

if (avatarBtn && avatarModal) {
  avatarBtn.onclick = (e) => {
    e.stopPropagation();
    avatarModal.classList.toggle("active");
  };

  avatarModal.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    avatarModal.classList.remove("active");
  });
}

const historyBtn = document.getElementById("historyBtn");
const historyModal = document.getElementById("historyModal");
const closeHistory = document.getElementById("closeHistory");
const upgradePlanBtn = document.getElementById("upgradePlanBtn");
const upgradePlanModal = document.getElementById("upgradePlanModal");
const closeUpgradePlan = document.getElementById("closeUpgradePlan");
const cancelBookingModal = document.getElementById("cancelBookingModal");
const closeCancelBooking = document.getElementById("closeCancelBooking");
const cancelBookingDismiss = document.getElementById("cancelBookingDismiss");
const confirmCancelBooking = document.getElementById("confirmCancelBooking");
const cancelPolicyConfirm = document.getElementById("cancelPolicyConfirm");

let selectedBookingForCancellation = null;

if (historyBtn && historyModal) {
  historyBtn.addEventListener("click", () => {
    applyHistoryRoomImages();
    historyModal.style.display = "flex";
  });
}

if (closeHistory && historyModal) {
  closeHistory.addEventListener("click", () => {
    historyModal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  if (e.target === historyModal) {
    historyModal.style.display = "none";
  }
  if (e.target === upgradePlanModal) {
    upgradePlanModal.style.display = "none";
  }
  if (e.target === cancelBookingModal) {
    closeCancellationModal();
  }
});

if (upgradePlanBtn && upgradePlanModal) {
  upgradePlanBtn.addEventListener("click", () => {
    upgradePlanModal.style.display = "flex";
    renderUpgradeProgress();
  });
}

if (closeUpgradePlan && upgradePlanModal) {
  closeUpgradePlan.addEventListener("click", () => {
    upgradePlanModal.style.display = "none";
  });
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString(isVietnamese ? "vi-VN" : "en-US") + " VND";
}

function closeCancellationModal() {
  if (!cancelBookingModal) {
    return;
  }

  cancelBookingModal.style.display = "none";
  selectedBookingForCancellation = null;
  if (cancelPolicyConfirm) {
    cancelPolicyConfirm.checked = false;
  }
}

function openCancellationModal(button) {
  if (!cancelBookingModal || !button) {
    return;
  }

  selectedBookingForCancellation = {
    targetType: String(button.dataset.targetType || "booking").toLowerCase(),
    targetId: button.dataset.targetId,
    totalAmount: Number(button.dataset.totalAmount || 0),
    paymentMode: String(button.dataset.paymentMode || "PAY_LATER").toUpperCase(),
    refundAmount: Number(button.dataset.refundAmount || 0),
    cancellationFee: Number(button.dataset.cancellationFee || 0),
  };

  const isPrepaid = selectedBookingForCancellation.paymentMode === "PAY_NOW";
  const isDetailCancellation = selectedBookingForCancellation.targetType === "detail";
  const modalTitle = document.getElementById("cancelBookingTitle");
  const amountLabel = document.getElementById("cancelBookingAmountLabel");

  if (modalTitle) {
    modalTitle.textContent = isDetailCancellation ? T.roomCancellationPolicy : T.bookingCancellationPolicy;
  }
  if (amountLabel) {
    amountLabel.textContent = isDetailCancellation ? T.roomTotal : T.bookingTotal;
  }
  document.getElementById("cancelBookingTotal").textContent = formatMoney(selectedBookingForCancellation.totalAmount);
  document.getElementById("cancelBookingRefund").textContent = formatMoney(selectedBookingForCancellation.refundAmount);
  document.getElementById("cancelBookingFee").textContent = formatMoney(selectedBookingForCancellation.cancellationFee);
  document.getElementById("cancelBookingNote").textContent = isPrepaid
    ? (isDetailCancellation ? T.prepaidRefundNoteRoom : T.prepaidRefundNoteBooking)
    : (isDetailCancellation ? T.payLaterNoteRoom : T.payLaterNoteBooking);

  if (cancelPolicyConfirm) {
    cancelPolicyConfirm.checked = false;
  }

  cancelBookingModal.style.display = "flex";
}

function applyTheme(theme) {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.body.classList.toggle("profile-theme-dark", selectedTheme === "dark");
  document.body.classList.toggle("customer-theme-dark", selectedTheme === "dark");
  document.documentElement.setAttribute("data-customer-theme", selectedTheme);
  localStorage.setItem(PROFILE_THEME_STORAGE_KEY, selectedTheme);

  themeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.themeValue === selectedTheme);
  });
}

function profileChangeLang(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  url.searchParams.set("panel", "settings");
  window.location.href = url.toString();
}

window.profileChangeLang = profileChangeLang;

if (themeButtons.length) {
  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (window.CustomerTheme?.set) {
        window.CustomerTheme.set(button.dataset.themeValue);
      } else {
        applyTheme(button.dataset.themeValue);
      }
    });
  });
}

window.addEventListener("customer-theme-change", (event) => {
  applyTheme(event.detail?.theme);
});

function renderUpgradeProgress() {
  const summary = document.querySelector(".upgrade-plan-summary");
  const fill = document.getElementById("upgradeProgressFill");
  const currentEl = document.getElementById("upgradeProgressCurrent");
  const targetEl = document.getElementById("upgradeProgressTarget");
  const textEl = document.getElementById("upgradePlanText");

  if (!summary || !fill || !currentEl || !targetEl || !textEl) {
    return;
  }

  const totalSpent = Number(summary.dataset.totalSpent || 0);
  const memberLevel = String(summary.dataset.memberLevel || "Bronze").toLowerCase();

  let baseline = 0;
  let nextTarget = 50000000;
  let nextLabel = isVietnamese ? "Bạc / VIP" : "Silver / VIP";

  if (memberLevel === "silver") {
    baseline = 50000000;
    nextTarget = 100000000;
    nextLabel = isVietnamese ? "Vàng / VIP" : "Gold / VIP";
  } else if (memberLevel === "gold") {
    baseline = 100000000;
    nextTarget = 200000000;
    nextLabel = isVietnamese ? "Bạch kim / VVIP" : "Platinum / VVIP";
  } else if (memberLevel === "platinum") {
    fill.style.width = "100%";
    currentEl.textContent = formatMoney(totalSpent);
    targetEl.textContent = T.topTierReached;
    textEl.textContent = T.topTierText;
    return;
  }

  const progress = Math.max(0, Math.min(100, ((totalSpent - baseline) / (nextTarget - baseline)) * 100));
  fill.style.width = `${progress}%`;
  currentEl.textContent = formatMoney(totalSpent);
  targetEl.textContent = formatMoney(nextTarget);
  textEl.textContent = fillTemplate(T.upgradeToLabel, {
    amount: formatMoney(Math.max(0, nextTarget - totalSpent)),
    label: nextLabel,
  });
}

document.querySelectorAll(".booking-cancel-btn").forEach((button) => {
  button.addEventListener("click", () => openCancellationModal(button));
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".booking-cancel-btn");
  if (!button) {
    return;
  }
  openCancellationModal(button);
});

if (closeCancelBooking) {
  closeCancelBooking.addEventListener("click", closeCancellationModal);
}

if (cancelBookingDismiss) {
  cancelBookingDismiss.addEventListener("click", closeCancellationModal);
}

if (confirmCancelBooking) {
  confirmCancelBooking.addEventListener("click", async () => {
    if (!selectedBookingForCancellation?.targetId) {
      return;
    }
    if (!cancelPolicyConfirm?.checked) {
      alert(T.pleaseConfirmCancellation);
      return;
    }

    confirmCancelBooking.disabled = true;

    try {
      const apiPath = selectedBookingForCancellation.targetType === "detail"
        ? `/api/customer-bookings/details/${selectedBookingForCancellation.targetId}/cancel`
        : selectedBookingForCancellation.targetType === "pending"
          ? `/api/customer-bookings/pending/${selectedBookingForCancellation.targetId}/cancel`
        : `/api/customer-bookings/${selectedBookingForCancellation.targetId}/cancel`;

      const response = await fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmed: true }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || T.cancellationFailed);
      }

      window.location.reload();
    } catch (error) {
      alert(error.message || T.cancellationFailed);
    } finally {
      confirmCancelBooking.disabled = false;
    }
  });
}

applyStaticTranslations();

applyHistoryRoomImages();
renderMembershipPrivileges();
resetEditMode();
applyTheme(window.CustomerTheme?.get?.() || localStorage.getItem(PROFILE_THEME_STORAGE_KEY));

const initialPanel = new URL(window.location.href).searchParams.get("panel") || "overview";
activatePanel(initialPanel);
