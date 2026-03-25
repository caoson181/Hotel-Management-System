package org.example.backendpj.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

import org.example.backendpj.Entity.Contact;
import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.ContactRepository;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.Service.SentimentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;

@Controller
public class ContactController {

    private final ContactRepository contactRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final SentimentService sentimentService;

    public ContactController(ContactRepository contactRepository,
            CustomerRepository customerRepository,
            UserRepository userRepository,
            SentimentService sentimentService) {

        this.contactRepository = contactRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.sentimentService = sentimentService;
    }

    @PostMapping("/contact")
    public String sendContact(@RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam String subject,
            @RequestParam String message,
            Principal principal) {

        Contact contact = new Contact();
        contact.setSubject(subject);
        contact.setMessage(message);
        contact.setCreatedAt(LocalDateTime.now());

        contact.setSentiment("Analyzing...");

        if (principal != null) {
            User user = null;

            if (principal instanceof org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) {

                var oauthToken = (org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) principal;
                var oauthUser = oauthToken.getPrincipal();

                String oauthEmail = oauthUser.getAttribute("email");

                user = userRepository.findByEmail(oauthEmail).orElse(null);

            } else {
                user = userRepository.findByUsername(principal.getName()).orElse(null);
            }

            Customer customer = customerRepository.findByUser(user).orElse(null);
            contact.setCustomer(customer);

        } else {
            contact.setGuestName(name);
            contact.setGuestEmail(email);
        }

        contactRepository.save(contact);

        sentimentService.analyzeAsync(contact);

        return "redirect:/contact?success";
    }

    @GetMapping("/reports/view-reports")
    public String viewReports(
            @RequestParam(defaultValue = "customer") String type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sentiment,
            Model model) {

        int pageSize = 5;

        List<Contact> all = contactRepository.findAll();

        // ================= FILTER TYPE =================
        List<Contact> filtered;

        if ("customer".equals(type)) {
            filtered = all.stream()
                    .filter(c -> c.getCustomer() != null)
                    .toList();
        } else {
            filtered = all.stream()
                    .filter(c -> c.getCustomer() == null)
                    .toList();
        }

        // ================= SEARCH =================
        if (keyword != null && !keyword.isBlank()) {
            String key = keyword.toLowerCase();

            filtered = filtered.stream()
                    .filter(c -> (c.getMessage() != null && c.getMessage().toLowerCase().contains(key)) ||
                            (c.getSubject() != null && c.getSubject().toLowerCase().contains(key)))
                    .toList();
        }

        // ================= FILTER SENTIMENT =================
        if (sentiment != null && !sentiment.isBlank()) {
            filtered = filtered.stream()
                    .filter(c -> sentiment.equalsIgnoreCase(c.getSentiment()))
                    .toList();
        }

        // ================= PAGINATION SAFE =================
        int total = filtered.size();
        int totalPages = (int) Math.ceil((double) total / pageSize);

        if (page < 1)
            page = 1;
        if (page > totalPages && totalPages > 0)
            page = totalPages;

        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, total);

        List<Contact> pageData = total == 0 ? List.of() : filtered.subList(start, end);

        // ================= SENTIMENT % =================
        long totalAll = all.size();

        long positive = all.stream()
                .filter(c -> "Positive".equals(c.getSentiment()))
                .count();

        long negative = all.stream()
                .filter(c -> "Negative".equals(c.getSentiment()))
                .count();

        long neutral = all.stream()
                .filter(c -> "Neutral".equals(c.getSentiment()))
                .count();

        double posPercent = totalAll == 0 ? 0 : (positive * 100.0 / totalAll);
        double negPercent = totalAll == 0 ? 0 : (negative * 100.0 / totalAll);
        double neuPercent = totalAll == 0 ? 0 : (neutral * 100.0 / totalAll);

        // ================= MODEL =================
        model.addAttribute("contacts", pageData);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("type", type);

        model.addAttribute("keyword", keyword);
        model.addAttribute("sentiment", sentiment);

        model.addAttribute("posPercent", posPercent);
        model.addAttribute("negPercent", negPercent);
        model.addAttribute("neuPercent", neuPercent);

        return "pages/reports/view-reports";
    }

    @GetMapping("/reports/export")
    public void exportExcel(HttpServletResponse response) throws IOException {

        List<Contact> contacts = contactRepository.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Feedback");

        // Header
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID");
        header.createCell(1).setCellValue("Name");
        header.createCell(2).setCellValue("Email");
        header.createCell(3).setCellValue("Subject");
        header.createCell(4).setCellValue("Message");
        header.createCell(5).setCellValue("Date");
        header.createCell(6).setCellValue("Sentiment");

        int rowNum = 1;

        for (Contact c : contacts) {
            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(c.getContactId());

            String name = c.getCustomer() != null
                    ? c.getCustomer().getUser().getFullName()
                    : c.getGuestName();

            String email = c.getCustomer() != null
                    ? c.getCustomer().getUser().getEmail()
                    : c.getGuestEmail();

            row.createCell(1).setCellValue(name);
            row.createCell(2).setCellValue(email);
            row.createCell(3).setCellValue(c.getSubject());
            row.createCell(4).setCellValue(c.getMessage());
            row.createCell(5).setCellValue(c.getCreatedAt().toString());
            row.createCell(6).setCellValue(c.getSentiment());
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=report.xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}
