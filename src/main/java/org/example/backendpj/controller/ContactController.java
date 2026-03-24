package org.example.backendpj.controller;

import java.security.Principal;
import java.time.LocalDateTime;

import org.example.backendpj.Entity.Contact;
import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.ContactRepository;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.UserRepository;
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

    public ContactController(ContactRepository contactRepository,
            CustomerRepository customerRepository,
            UserRepository userRepository) {
        this.contactRepository = contactRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
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

        if (principal != null) {
            // ✅ đã login
            User user = userRepository.findByUsername(principal.getName()).orElse(null);
            Customer customer = customerRepository.findByUser(user).orElse(null);
            contact.setCustomer(customer);
        } else {
            // ✅ guest
            contact.setGuestName(name);
            contact.setGuestEmail(email);
        }

        contactRepository.save(contact);

        return "redirect:/contact?success";
    }

    @GetMapping("/reports/view-reports")
    public String viewReports(Model model) {
        model.addAttribute("contacts", contactRepository.findAll());
        return "pages/reports/view-reports"; // đúng path của bạn
    }
}
