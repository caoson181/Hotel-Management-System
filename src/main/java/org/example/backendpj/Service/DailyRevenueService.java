package org.example.backendpj.Service;

import org.example.backendpj.Entity.DailyRevenue;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Repository.BookingDetailRepository;
import org.example.backendpj.Repository.DailyRevenueRepository;
import org.example.backendpj.Repository.RentalContractRepository;
import org.example.backendpj.Repository.StaffRepository;
import org.example.backendpj.dto.RevenueDTO;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DailyRevenueService {

    private static final double DEFAULT_OTHER_COST = 2_000_000D;
    private static final LocalDate RECALC_START_DATE = LocalDate.of(2026, 4, 7);

    private final DailyRevenueRepository dailyRevenueRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final StaffRepository staffRepository;
    private final RentalContractRepository rentalContractRepository;

    public DailyRevenueService(
            DailyRevenueRepository dailyRevenueRepository,
            BookingDetailRepository bookingDetailRepository,
            StaffRepository staffRepository,
            RentalContractRepository rentalContractRepository) {
        this.dailyRevenueRepository = dailyRevenueRepository;
        this.bookingDetailRepository = bookingDetailRepository;
        this.staffRepository = staffRepository;
        this.rentalContractRepository = rentalContractRepository;
    }

    @Transactional
    public List<RevenueDTO> getRevenueByMonth(String monthStr) {
        YearMonth yearMonth = YearMonth.parse(monthStr);
        ensureRevenueRowsForMonth(yearMonth);

        List<DailyRevenue> list = dailyRevenueRepository.findByMonth(yearMonth.getYear(), yearMonth.getMonthValue());

        return list.stream()
                .map(this::toRevenueDTO)
                .toList();
    }

    @Transactional
    public void ensureRevenueForToday() {
        ensureRevenueForDate(LocalDate.now());
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void scheduledDailyRevenueGeneration() {
        ensureRevenueForToday();
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initializeRevenueOnStartup() {
        ensureRevenueForToday();
    }

    @Transactional
    public void ensureRevenueForDate(LocalDate targetDate) {
        if (targetDate.isBefore(RECALC_START_DATE)) {
            return;
        }

        dailyRevenueRepository.save(buildDailyRevenue(targetDate));
    }

    private void ensureRevenueRowsForMonth(YearMonth yearMonth) {
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        LocalDate today = LocalDate.now();

        if (yearMonth.equals(YearMonth.from(today))) {
            endDate = today;
        } else if (yearMonth.isAfter(YearMonth.from(today))) {
            endDate = startDate.minusDays(1);
        }

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            ensureRevenueForDate(date);
        }
    }

    private DailyRevenue buildDailyRevenue(LocalDate targetDate) {
        YearMonth yearMonth = YearMonth.from(targetDate);
        int daysInMonth = yearMonth.lengthOfMonth();

        List<BookingDetail> checkedOutDetails = bookingDetailRepository.findAllByActualCheckOutDate(targetDate)
                .stream()
                .filter(this::isRevenueEligible)
                .toList();
        long checkoutCount = checkedOutDetails.size();
        double bookingRevenue = checkedOutDetails.stream()
                .map(this::resolveRecognizedAmount)
                .mapToDouble(BigDecimal::doubleValue)
                .sum();
        double rentalRevenue = toDouble(rentalContractRepository.sumActiveMonthlyRevenueByDate(targetDate)) / daysInMonth;
        double salaryCost = defaultZero(staffRepository.sumAllSalary()) / daysInMonth;
        double totalRevenue = bookingRevenue + rentalRevenue;
        double profit = totalRevenue - salaryCost - DEFAULT_OTHER_COST;

        DailyRevenue dailyRevenue = new DailyRevenue();
        dailyRevenue.setDate(targetDate);
        dailyRevenue.setTotalGuests((int) checkoutCount);
        dailyRevenue.setRoomsBooked((int) checkoutCount);
        dailyRevenue.setBookingRevenue(bookingRevenue);
        dailyRevenue.setRentalRevenue(rentalRevenue);
        dailyRevenue.setSalaryCost(salaryCost);
        dailyRevenue.setOtherCost(DEFAULT_OTHER_COST);
        dailyRevenue.setProfit(profit);

        return dailyRevenue;
    }

    private RevenueDTO toRevenueDTO(DailyRevenue dailyRevenue) {
        double booking = defaultZero(dailyRevenue.getBookingRevenue());
        double rental = defaultZero(dailyRevenue.getRentalRevenue());
        double salary = defaultZero(dailyRevenue.getSalaryCost());
        double other = defaultZero(dailyRevenue.getOtherCost());
        double revenue = booking + rental;
        double profit = dailyRevenue.getProfit() != null
                ? dailyRevenue.getProfit()
                : revenue - salary - other;

        return new RevenueDTO(
                dailyRevenue.getDate().toString(),
                defaultZero(dailyRevenue.getTotalGuests()).intValue(),
                defaultZero(dailyRevenue.getRoomsBooked()).intValue(),
                revenue,
                profit,
                booking,
                rental,
                salary,
                other);
    }

    private double toDouble(BigDecimal value) {
        return value != null ? value.doubleValue() : 0D;
    }

    private boolean isRevenueEligible(BookingDetail detail) {
        return detail != null
                && (detail.getStatus() == null || !"NO_SHOW".equalsIgnoreCase(detail.getStatus()));
    }

    private BigDecimal resolveRecognizedAmount(BookingDetail detail) {
        if (detail == null) {
            return BigDecimal.ZERO;
        }
        if (detail.getFinalAmount() != null) {
            return detail.getFinalAmount();
        }
        if (detail.getPrice() == null || detail.getCheckInDate() == null) {
            return BigDecimal.ZERO;
        }

        LocalDate effectiveCheckOut = detail.getActualCheckOutDate() != null
                ? detail.getActualCheckOutDate()
                : detail.getCheckOutDate();
        long nights = effectiveCheckOut == null
                ? 1
                : Math.max(1, ChronoUnit.DAYS.between(detail.getCheckInDate(), effectiveCheckOut));
        return detail.getPrice().multiply(BigDecimal.valueOf(nights));
    }

    private Double defaultZero(Double value) {
        return value != null ? value : 0D;
    }

    private Integer defaultZero(Integer value) {
        return value != null ? value : 0;
    }
}
