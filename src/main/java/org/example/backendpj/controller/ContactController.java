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
    public String viewReports(Model model) {

        List<Contact> all = contactRepository.findAll();

        long total = all.size();

        long positive = all.stream()
                .filter(c -> "Positive".equals(c.getSentiment()))
                .count();

        long negative = all.stream()
                .filter(c -> "Negative".equals(c.getSentiment()))
                .count();

        long neutral = all.stream()
                .filter(c -> "Neutral".equals(c.getSentiment()))
                .count();

        // tránh chia cho 0
        double posPercent = total == 0 ? 0 : (positive * 100.0 / total);
        double negPercent = total == 0 ? 0 : (negative * 100.0 / total);
        double neuPercent = total == 0 ? 0 : (neutral * 100.0 / total);

        model.addAttribute("posPercent", posPercent);
        model.addAttribute("negPercent", negPercent);
        model.addAttribute("neuPercent", neuPercent);

        List<Contact> customers = all.stream()
                .filter(c -> c.getCustomer() != null)
                .toList();

        List<Contact> guests = all.stream()
                .filter(c -> c.getCustomer() == null)
                .toList();

        model.addAttribute("customerContacts", customers);
        model.addAttribute("guestContacts", guests);

        return "pages/reports/view-reports";
    }
}
