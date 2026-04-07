package org.example.backendpj.Service;

import org.example.backendpj.Entity.DailyRevenue;
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
import java.util.List;

@Service
public class DailyRevenueService {

    private static final double DEFAULT_OTHER_COST = 2_000_000D;

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
        if (dailyRevenueRepository.existsById(targetDate)) {
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

        long checkoutCount = bookingDetailRepository.countByActualCheckOutDate(targetDate);
        double bookingRevenue = toDouble(bookingDetailRepository.sumPriceByActualCheckOutDate(targetDate));
        double rentalRevenue = toDouble(rentalContractRepository.sumActiveMonthlyRevenueByDate(targetDate)) / daysInMonth;
        double salaryCost = defaultZero(staffRepository.sumAllSalary()) / daysInMonth;

        DailyRevenue dailyRevenue = new DailyRevenue();
        dailyRevenue.setDate(targetDate);
        dailyRevenue.setTotalGuests((int) checkoutCount);
        dailyRevenue.setRoomsBooked((int) checkoutCount);
        dailyRevenue.setBookingRevenue(bookingRevenue);
        dailyRevenue.setRentalRevenue(rentalRevenue);
        dailyRevenue.setSalaryCost(salaryCost);
        dailyRevenue.setOtherCost(DEFAULT_OTHER_COST);

        return dailyRevenue;
    }

    private RevenueDTO toRevenueDTO(DailyRevenue dailyRevenue) {
        double booking = defaultZero(dailyRevenue.getBookingRevenue());
        double rental = defaultZero(dailyRevenue.getRentalRevenue());
        double salary = defaultZero(dailyRevenue.getSalaryCost());
        double other = defaultZero(dailyRevenue.getOtherCost());
        double revenue = booking + rental;
        double profit = revenue - salary - other;

        return new RevenueDTO(
                dailyRevenue.getDate().toString(),
                defaultZero(dailyRevenue.getTotalGuests()).intValue(),
                defaultZero(dailyRevenue.getRoomsBooked()).intValue(),
                revenue,
                profit);
    }

    private double toDouble(BigDecimal value) {
        return value != null ? value.doubleValue() : 0D;
    }

    private Double defaultZero(Double value) {
        return value != null ? value : 0D;
    }

    private Integer defaultZero(Integer value) {
        return value != null ? value : 0;
    }
}
